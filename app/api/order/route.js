import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { sendEmail } from "@/app/lib/email";

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "برای ثبت سفارش باید وارد شوید" }, { status: 401 });
    }

    let cart = await Cart.findOne({ user: session.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "سبد خرید شما خالی است" }, { status: 400 });
    }

    const totalPrice = cart.items.reduce((total, item) => total + (item.product.discountPrice * item.quantity || 0), 0);

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

    //get product info for each item in the order
    await newOrder.populate("items.product");

    //Create email body with html
    const emailContent = `
  <h2>سفارش شما با موفقیت ثبت شد</h2>
  <p>شماره سفارش: <strong>${newOrder._id}</strong></p>
  <p>مبلغ کل: ${totalPrice.toLocaleString()} تومان</p>
  <p>تخفیف: ${discountPrice.toLocaleString()} تومان</p>
  <p><strong>مبلغ پرداختی: ${finalPrice.toLocaleString()} تومان</strong></p>
  <hr/>
  <h3>جزئیات سفارش:</h3>
  <ul>
    ${newOrder.items
      .map(
        (item) => `
      <li>
        ${item.product?.name || "نامشخص"} - تعداد: ${item.quantity} - قیمت واحد: ${item.product?.price?.toLocaleString() || "0"} تومان
      </li>
    `
      )
      .join("")}
  </ul>
  <p>از خرید شما متشکریم!</p>
`;

    // Send email to user
    await sendEmail(session.user.email, "سفارش شما با موفقیت ثبت شد", emailContent);

    return NextResponse.json({
      message: "سفارش شما با موفقیت ثبت شد",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: error.message || "خطایی رخ داده است" }, { status: 500 });
  }
}
