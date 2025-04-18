import connectToDatabase from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import Otp from "@/models/Otp";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

//verify reCaptchaToken
async function verifyRecaptchaToken(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY; // Secret key for reCAPTCHA

  // Send POST request to Google's reCAPTCHA verification API
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
    method: "POST",
  });
  const data = await response.json();

  // Return true if verification is successful and score is sufficient
  return data.success && data.score >= 0.5;
}

// POST handler for initiating password reset
export async function POST(req) {
  await connectToDatabase();
  try {
    const { email, recaptchaToken } = await req.json();

    // Validate required fields
    if (!email || !recaptchaToken) {
      return NextResponse.json({ message: "ایمیل و توکن امنیتی الزامی است" }, { status: 400 });
    }

    // Verify reCAPTCHA token
    const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json({ message: "تأیید امنیتی ناموفق بود" }, { status: 403 });
    }

    // Validate email format
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ message: "ایمیل معتبر نیست" }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "کاربری با این ایمیل یافت نشد" }, { status: 400 });
    }

    // Check for existing valid OTP to prevent spamming
    const existingOtp = await Otp.findOne({
      $or: [{ email }],
      expiresAt: { $gt: new Date() },
    });

    // If a valid OTP exists, return remaining time
    //در صورت وجود کد منقضی نشده از ارسال پیاپی کد یکبار مصرف جلوگیری می شود
    if (existingOtp) {
      const timeLeft = Math.ceil((existingOtp.expiresAt - Date.now()) / 1000);
      return NextResponse.json({ message: "لینک قبلی هنوز معتبر است.", timeLeft }, { status: 429 });
    }

    // Generate a secure reset token and set expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store reset token in OTP collection
    const otp = await Otp.create({
      email: email,
      code: resetToken,
      method: "reset-password",
      expiresAt,
    });

    // send otp link to user email

    const baseUrl = process.env.BASE_URL;
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      "بازیابی رمز عبور",
      `
          برای بازیابی رمز عبور خود روی لینک زیر کلیک کنید: 
          ${resetLink}
          این لینک تا 15 دقیقه معتبر است.
          اگر این درخواست از سمت شما نیست، لطفاً نادیده بگیرید.
        `
    );
    return NextResponse.json({ message: "لینک بازیابی رمزعبور به ایمیل شما ارسال شد" }, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
