import connectToDatabase from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import { sendSms } from "@/app/lib/melipayamak";
import Otp from "@/models/Otp";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectToDatabase();
  try {
    const { name, email, phone, type } = await req.json();
    if (!type || (type !== "register" && type !== "login" && type !== "email-login")) {
      return NextResponse.json({ message: "نوع درخواست معتبر نیست" }, { status: 400 });
    }

    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    const phoneRegex = /^09[0-9]{9}$/;

    if (type === "email-login") {
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ message: "ایمیل معتبر نیست" }, { status: 400 });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "کاربری با این ایمیل یافت نشد" }, { status: 400 });
      }
    } else {
      if (!phone || !phoneRegex.test(phone)) {
        return NextResponse.json({ message: "شماره تلفن وارد شده صحیح نیست" }, { status: 400 });
      }
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ message: "ایمیل معتبر نیست" }, { status: 400 });
      }
    }

    if (type === "register") {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return NextResponse.json({ message: "نام باید بین 3 تا 30 حرف باشد" }, { status: 400 });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json({ message: "ایمیل تکراری می باشد" }, { status: 400 });
      }
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return NextResponse.json({ message: "این شماره موبایل قبلاً ثبت شده است" }, { status: 400 });
      }
    } else if (type === "login") {
      const user = await User.findOne({ phone });
      if (!user) {
        return NextResponse.json({ message: "کاربری با این شماره موبایل یافت نشد" }, { status: 400 });
      }
    }
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otp = await Otp.create({
      phone: phone || null,
      email: email || null,
      code: otpCode,
      kind: type === "register" ? 1 : 2,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // send otp code to user phone number or email

    if (type === "email-login") {
      await sendEmail(email, "کد تأیید ورود", `کد تأیید شما: ${otpCode}`);
    } else {
      await sendSms(phone, `کد تایید شما: ${otpCode}`);
    }
    return NextResponse.json({ message: "کد تایید ارسال شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
