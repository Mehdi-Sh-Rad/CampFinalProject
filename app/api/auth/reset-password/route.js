import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function verifyRecaptchaToken(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY; // Secret key for reCAPTCHA

  // Validate secret key existence
  if (!secretKey) {
    throw new Error("خطا در تنظیمات سرور");
  }

  // Send POST request to Google's reCAPTCHA verification API
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
    method: "POST",
  });
  const data = await response.json();

  // Return true if verification is successful and score is sufficient
  return data.success && data.score >= 0.5;
}

// POST handler for resetting user password
export async function POST(req) {
  try {
    await connectToDatabase();
    const { token, password, recaptchaToken } = await req.json();

    // Validate required fields
    if ((!token, !password, !recaptchaToken)) {
      return NextResponse.json({ message: "توکن ، رمز عبور و توکن امنیتی الزامی می باشد" }, { status: 400 });
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json({ message: "رمز عبور باید حداقل 8 کاراکتر باشد" }, { status: 400 });
    }

    // Verify reCAPTCHA token
    const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json({ message: "تأیید امنیتی ناموفق بود" }, { status: 403 });
    }

    // Find OTP record for password reset
    const otp = await Otp.findOne({ code: token, method: "reset-password" });
    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "لینک بازیابی نامعتبر یا منقضی شده است" }, { status: 400 });
    }

    // Find user associated with OTP email
    const user = await User.findOne({ email: otp.email });
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: otp._id });

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در سرور" }, { status: 500 });
  }
}
