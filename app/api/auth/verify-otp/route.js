import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req) {
  await connectToDatabase();

  try {
    const { phone, code, name, email, password } = await req.json();
    if (!phone || !name || !email || !password) {
      return NextResponse.json({ message: "لطفا تمامی فیلد ها را پر کنید" }, { status: 400 });
    }
    const otp = await Otp.findOne({ phone, code });
    if (!otp) {
      return NextResponse.json({ message: "کد وارد شده صحیح نیست" }, { status: 400 });
    }
    if (otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "کد منقضی شده است" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        isAdmin: false,
        isActive: true,
      });
      await Otp.deleteOne({ phone, code });
      return NextResponse.json({ message: "ثبت نام با موفقیت انجام شد" }, { status: 200 });
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const message = duplicateField === "phone" ? "شماره موبایل تکراری است" : "ایمیل تکراری است";
        return NextResponse.json({ message }, { status: 400 });
      }
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
