import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Payment from "@/models/Payment";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(request) {
  await connectToDatabase();
  const payments = await Payment.find({}).populate("user")
  .populate("items.product")
  .sort({ createdAt: -1 });
  return new Response(JSON.stringify(payments), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { orderCode, items, totalPrice, totalDiscount, status } = body;

    // Validate orderCode
    if (!orderCode || orderCode.trim() === "") {
      return new Response(JSON.stringify({ message: "کد پیگیری سفارش الزامی است" }), {
        status: 400,
      });
    }

    const session = await getServerSession({ req: request, ...authOptions });
    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    const userId = session.user.id; // Assign the logged-in user's ID to the payment

    // Validate items
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ message: "انتخاب محصول الزامی است" }), {
        status: 400,
      });
    }

    // Validate totalPrice
    const priceNum = parseFloat(totalPrice);
    if (!totalPrice || isNaN(priceNum) || priceNum <= 0) {
      return new Response(JSON.stringify({ message: "قیمت نهایی فاکتور باید عدد مثبت باشد" }), {
        status: 400,
      });
    }

    // Validate totalDiscount
    let discountNum;
    if (totalDiscount !== undefined && totalDiscount !== "") {
      discountNum = parseFloat(totalDiscount);
      if (isNaN(discountNum) || discountNum < 0) {
        return new Response(JSON.stringify({ message: "قیمت تخفیفی باید عدد مثبت باشد" }), {
          status: 400,
        });
      }
      if (discountNum >= priceNum) {
        return new Response(JSON.stringify({ message: "قیمت تخفیفی باید کمتر از قیمت نهایی فاکتور باشد" }), {
          status: 400,
        });
      }
    }

    // Validate status
    if (typeof status !== "boolean") {
      return new Response(JSON.stringify({ message: "وضعیت پرداخت باید مقدار بولین باشد" }), {
        status: 400,
      });
    }

    // Create payment
    const payment = await Payment.create({
      orderCode,
      user: userId,
      items,
      totalPrice: priceNum,
      totalDiscount: discountNum || 0,
      status,
    });

    return new Response(JSON.stringify(payment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}