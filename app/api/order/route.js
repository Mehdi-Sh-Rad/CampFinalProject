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
    const body = await req.json();
    const orderCode = body.orderCode;
    const status = body.status;
    const totalPrice = cart.items.reduce((total, item) => total + (item.product.finalPrice || 0), 0);

    const discountPrice = cart.discountPrice || 0;
    const payablePrice = totalPrice - discountPrice;

    const newOrder = await Order.create({
      user: session.user.id,
      orderCode,
      status,
      items: cart.items,
      totalPrice,
      discountPrice,
      payablePrice,
    });
    
    // Update soldCount for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { soldCount: 1 },
      });
    }

    await Cart.deleteOne({ user: session.user.id });

    //get product info for each item in the order
    await newOrder.populate("items.product");

    //Create email body with html
    const emailContent = `
  <h2>سفارش شما با موفقیت ثبت شد</h2>
  <p>شماره سفارش: <strong>${newOrder.orderCode}</strong></p>
  <p>مبلغ کل: ${totalPrice.toLocaleString()} تومان</p>
  <p>تخفیف: ${discountPrice.toLocaleString()} تومان</p>
  <p><strong>مبلغ پرداختی: ${payablePrice.toLocaleString()} تومان</strong></p>
  <hr/>
  <h3>جزئیات سفارش:</h3>
  <ul>
    ${newOrder.items
        .map(
          (item) => `
      <li>
        ${item.product?.name || "نامشخص"} - قیمت : ${item.product?.finalPrice > 0 ? item.product?.finalPrice?.toLocaleString() : "رایگان" } 
      </li>
    `
        )
        .join("")}
  </ul>
  <p>از خرید شما متشکریم!</p>
  <p>
    <a href="${process.env.BASE_URL}/user/orders/${newOrder._id}" target="_blank" style="color: #1a73e8;">
      مشاهده جزئیات سفارش
    </a>
  </p>
`;

    // Send email to user
    await sendEmail(session.user.email, "سفارش شما با موفقیت ثبت شد", emailContent);

    return NextResponse.json({
      message: "سفارش شما با موفقیت ثبت شد",
      orderId: newOrder.orderCode,
    });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: error.message || "خطایی رخ داده است" }, { status: 500 });
  }
}
