import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import User from "@/models/User";
import bcrypt from "bcryptjs";


export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "لطفا ابتدا لاگین کنید" }, { status: 401 });
    }

    const { currentPassword, newPassword, recaptchaToken } = await req.json();

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "رمز فعلی و رمز جدید الزامی است." }, { status: 400 });
    }

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json({ message: "رمز عبور باید حداقل 8 کاراکتر باشد" }, { status: 400 });
    }

   

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "رمز فعلی اشتباه است" }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ message: "رمز با موفقیت تغییر کرد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
