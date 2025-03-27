import connectToDatabase from "@/app/lib/db";
import Payment from "@/models/Payment";

export async function GET(request) {
  await connectToDatabase();
  const payments = await Payment.find({}).populate("product").populate("user");
  return new Response(JSON.stringify(payments), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();


  try {
    const body = await request.json();

    if (
      !body.orderCode ||
      typeof body.orderCode !== "string" ||
      body.orderCode.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ message: "کدپیگیری سفارش الزامی میباشد" }),
        {
          status: 400,
        }
      );
    }
    if (
      !body.product || !body.user) {
      return new Response(
        JSON.stringify({ message: "کاربر یا محصول وارد نشده است" }),
        {
          status: 400,
        }
      );
    }
    if (body.price <= 0) {
      return new Response(
        JSON.stringify({ message: "قیمت باید عددی مثبت باشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.totalDiscount && body.totalDiscount < body.price) {
      return new Response(
        JSON.stringify({ message: "قیمت تخفیفی می بایست کمتر از قیمت فاکتور باشد" }),
        {
          status: 400,
        }
      );
    }
    
    const payment = await Payment.create(body);
    return new Response(JSON.stringify(payment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

