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
    const { orderCode, user, product, totalPrice, totalDiscount, status } = body;

    // Validate orderCode
    if (!orderCode || orderCode.trim() === "") {
      return new Response(JSON.stringify({ message: "کد پیگیری سفارش الزامی است" }), {
        status: 400,
      });
    }

    // Validate user
    if (!user) {
      return new Response(JSON.stringify({ message: "انتخاب کاربر الزامی است" }), {
        status: 400,
      });
    }
    const userExists = await User.findById(user);
    if (!userExists) {
      return new Response(JSON.stringify({ message: "کاربر یافت نشد" }), {
        status: 400,
      });
    }

    // Validate product
    if (!product) {
      return new Response(JSON.stringify({ message: "انتخاب محصول الزامی است" }), {
        status: 400,
      });
    }
    const productExists = await Product.findById(product);
    if (!productExists) {
      return new Response(JSON.stringify({ message: "محصول یافت نشد" }), {
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
      user,
      product,
      totalPrice: priceNum,
      totalDiscount: discountNum,
      status,
    });
    return new Response(JSON.stringify(payment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
