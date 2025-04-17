import connectToDatabase from "@/app/lib/db";
import Payment from "@/models/Payment";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(request) {
  await connectToDatabase();
  const payments = await Payment.find({}).populate("product").populate("user");
  return new Response(JSON.stringify(payments), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();

    // Validate orderCode
    if (!body.orderCode || body.orderCode.trim() === "") {
      return new Response(JSON.stringify({ message: "کد پیگیری سفارش الزامی است" }), {
        status: 400,
      });
    }

    // Validate user
    if (!body.user) {
      return new Response(JSON.stringify({ message: "انتخاب کاربر الزامی است" }), {
        status: 400,
      });
    }
    const userExists = await User.findById(body.user);
    if (!userExists) {
      return new Response(JSON.stringify({ message: "کاربر یافت نشد" }), {
        status: 400,
      });
    }

    // Validate product
    if (!body.product) {
      return new Response(JSON.stringify({ message: "انتخاب محصول الزامی است" }), {
        status: 400,
      });
    }
    const productExists = await Product.findById(body.product);
    if (!productExists) {
      return new Response(JSON.stringify({ message: "محصول یافت نشد" }), {
        status: 400,
      });
    }

    // Validate totalPrice
    if (!body.totalPrice || isNaN(body.totalPrice) || body.totalPrice <= 0) {
      return new Response(JSON.stringify({ message: "قیمت نهایی فاکتور باید عدد مثبت باشد" }), {
        status: 400,
      });
    }

    // Validate totalDiscount
    if (body.totalDiscount && (isNaN(body.totalDiscount) || body.totalDiscount < 0)) {
      return new Response(JSON.stringify({ message: "قیمت تخفیفی باید عدد مثبت باشد" }), {
        status: 400,
      });
    }
    if (body.totalDiscount && body.totalDiscount >= body.totalPrice) {
      return new Response(JSON.stringify({ message: "قیمت تخفیفی باید کمتر از قیمت نهایی فاکتور باشد" }), {
        status: 400,
      });
    }

    // Validate status
    if (typeof body.status !== "boolean") {
      return new Response(JSON.stringify({ message: "وضعیت پرداخت باید مقدار بولین باشد" }), {
        status: 400,
      });
    }

    // Create payment
    const payment = await Payment.create(body);
    return new Response(JSON.stringify(payment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
