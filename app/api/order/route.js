import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "برای ثبت سفارش باید وارد شوید" },
        { status: 401 }
      );
    }

    let cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 400 }
      );
    }

    const totalPrice = cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity || 0),
      0
    );

    const discountPrice = cart.discountPrice || 0;
    const finalPrice = totalPrice - discountPrice;

    const newOrder = await Order.create({
      user: session.user.id,
      items: cart.items,
      totalPrice,
      discountPrice,
      finalPrice,
    });

    await Cart.deleteOne({ user: session.user.id });

    return NextResponse.json({
      message: "سفارش شما با موفقیت ثبت شد",
      orderId: newOrder._id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "خطایی رخ داده است" },
      { status: 500 }
    );
  }
}
