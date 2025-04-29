import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "آیدی ارسال نشده است" }, { status: 400 });
    }

    await Product.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });

    return NextResponse.json({message : "بازدید افزایش یافت"} , {status : 200})
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
