import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

// Function to verify reCAPTCHA token
async function verifyRecaptchaToken(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  // Send POST request to Google's reCAPTCHA verification API
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
    method: "POST",
  });
  const data = await response.json();
  // Return true if verification is successful and score is sufficient
  return data.success && data.score >= 0.5;
}

// POST handler for user registration with OTP verification
export async function POST(req) {
  await connectToDatabase();

  try {
    const { phone, code, name, email, password, type, recaptchaToken } = await req.json();

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json({ message: "توکن امنیتی یافت نشد" }, { status: 400 });
    }

    if (recaptchaToken !== "no-recaptcha") {
      const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
      if (!isRecaptchaValid) {
        return NextResponse.json({ message: "تأیید امنیتی ناموفق بود" }, { status: 403 });
      }
    }

    // Validate type
    if (!type || !["register", "login", "email-login", "change-email", "change-phone"].includes(type)) {
      return NextResponse.json({ message: "نوع درخواست معتبر نیست" }, { status: 400 });
    }

 

    // Validate OTP code
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return NextResponse.json({ message: "کد تأیید نامعتبر است" }, { status: 400 });
    }

    // OTP query
    let otpQuery = { code, expiresAt: { $gt: new Date() } };
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    const phoneRegex = /^09[0-9]{9}$/;

    if (type === "change-email") {
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ message: "ایمیل فعلی معتبر نیست" }, { status: 400 });
      }
      otpQuery.email = email;
    } else if (type === "change-phone") {
      if (!phone || !phoneRegex.test(phone)) {
        return NextResponse.json({ message: "شماره تلفن فعلی معتبر نیست" }, { status: 400 });
      }
      otpQuery.phone = phone;
    } else if (type === "register" || type === "login") {
      if (!phone || !phoneRegex.test(phone)) {
        return NextResponse.json({ message: "شماره تلفن معتبر نیست" }, { status: 400 });
      }
      otpQuery.phone = phone;
    } else if (type === "email-login") {
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ message: "ایمیل معتبر نیست" }, { status: 400 });
      }
      otpQuery.email = email;
    }

    // Verify OTP
    const otp = await Otp.findOne(otpQuery);
    if (!otp) {
      return NextResponse.json({ message: "کد وارد شده صحیح نیست" }, { status: 400 });
    }
    if (otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "کد منقضی شده است" }, { status: 400 });
    }

    // Handle based on type
    if (type === "register") {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return NextResponse.json({ message: "نام باید بین 3 تا 30 حرف باشد" }, { status: 400 });
      }
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ message: "ایمیل معتبر نیست" }, { status: 400 });
      }
      if (!password) {
        return NextResponse.json({ message: "رمز عبور الزامی است" }, { status: 400 });
      }

      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        const field = existingUser.email === email ? "ایمیل" : "شماره تلفن";
        return NextResponse.json({ message: `${field} قبلاً ثبت شده است` }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 5);
      await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        isAdmin: false,
        isActive: true,
      });

      await Otp.deleteOne({ _id: otp._id });
      return NextResponse.json({ message: "ثبت نام با موفقیت انجام شد" }, { status: 200 });
    }

    if (type === "login" || type === "email-login") {
      const user = await User.findOne(type === "login" ? { phone } : { email });
      if (!user) {
        return NextResponse.json({ message: type === "login" ? "کاربری با این شماره تلفن یافت نشد" : "کاربری با این ایمیل یافت نشد" }, { status: 400 });
      }
      await Otp.deleteOne({ _id: otp._id });
      return NextResponse.json({ message: "تأیید با موفقیت انجام شد" }, { status: 200 });
    }

    if (type === "change-email") {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "ایمیل با حساب کاربری مطابقت ندارد" }, { status: 400 });
      }
      if (!otp.newEmail) {
        return NextResponse.json({ message: "ایمیل جدید یافت نشد" }, { status: 400 });
      }
      const existingEmail = await User.findOne({ email: otp.newEmail });
      if (existingEmail) {
        return NextResponse.json({ message: "این ایمیل توسط کاربر دیگری استفاده شده است" }, { status: 400 });
      }
      user.email = otp.newEmail;
      await user.save();
      await Otp.deleteOne({ _id: otp._id });
      return NextResponse.json({ message: "ایمیل با موفقیت تغییر کرد" }, { status: 200 });
    }

    if (type === "change-phone") {
      const user = await User.findOne({ phone });
      if (!user) {
        return NextResponse.json({ message: "شماره تلفن با حساب کاربری مطابقت ندارد" }, { status: 400 });
      }
      if (!otp.newPhone) {
        return NextResponse.json({ message: "شماره تلفن جدید یافت نشد" }, { status: 400 });
      }
      const existingPhone = await User.findOne({ phone: otp.newPhone });
      if (existingPhone) {
        return NextResponse.json({ message: "این شماره تلفن توسط کاربر دیگری استفاده شده است" }, { status: 400 });
      }
      user.phone = otp.newPhone;
      await user.save();
      await Otp.deleteOne({ _id: otp._id });
      return NextResponse.json({ message: "شماره تلفن با موفقیت تغییر کرد" }, { status: 200 });
    }
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
