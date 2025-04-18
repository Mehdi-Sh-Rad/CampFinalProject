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
    const { phone, code, name, email, password, recaptchaToken } = await req.json();

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json({ message: "توکن امنیتی یافت نشد" }, { status: 400 });
    }
    const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json({ message: "تأیید امنیتی ناموفق بود" }, { status: 403 });
    }

    // Validate required fields
    if (!phone || !name || !email || !password) {
      return NextResponse.json({ message: "لطفا تمامی فیلد ها را پر کنید" }, { status: 400 });
    }

    // Verify OTP
    const otp = await Otp.findOne({ phone, code });
    if (!otp) {
      return NextResponse.json({ message: "کد وارد شده صحیح نیست" }, { status: 400 });
    }
    if (otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "کد منقضی شده است" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
      // Create new user
      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        isAdmin: false,
        isActive: true,
      });

      // Delete used OTP
      await Otp.deleteOne({ phone, code });

      // Return success response
      return NextResponse.json({ message: "ثبت نام با موفقیت انجام شد" }, { status: 200 });
    } catch (error) {
      // Handle duplicate key errors (phone or email)
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const message = duplicateField === "phone" ? "شماره موبایل تکراری است" : "ایمیل تکراری است";
        return NextResponse.json({ message }, { status: 400 });
      }
    }
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
