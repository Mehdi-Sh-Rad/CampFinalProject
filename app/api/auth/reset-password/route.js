import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function verifyRecaptchaToken(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("خطا: RECAPTCHA_SECRET_KEY تعریف نشده است");
    throw new Error("خطا در تنظیمات سرور");
  }
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
    method: "POST",
  });
  const data = await response.json();
  console.log("پاسخ reCAPTCHA:", data);
  return data.success && data.score >= 0.5;
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { token, password, recaptchaToken } = await req.json();
    if ((!token, !password, !recaptchaToken)) {
      return NextResponse.json({ message: "توکن ، رمز عبور و توکن امنیتی الزامی می باشد" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "رمز عبور باید حداقل 8 کاراکتر باشد" }, { status: 400 });
    }

    const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json({ message: "تأیید امنیتی ناموفق بود" }, { status: 403 });
    }

    const otp = await Otp.findOne({ code: token, method: "reset-password" });
    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "لینک بازیابی نامعتبر یا منقضی شده است" }, { status: 400 });
    }

    const user = await User.findOne({ email: otp.email });
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Otp.deleteOne({ _id: otp._id });

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در سرور" }, { status: 500 });
  }
}
