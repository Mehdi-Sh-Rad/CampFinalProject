import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import ProductQuestion from "@/models/ProductQuestion";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

// GET: Fetch all product questions with populated user and product
// export async function GET(request) {
//   await connectToDatabase();
//   const proQuestions = await ProductQuestion.find({}).populate("product").populate("user");
//   return new Response(JSON.stringify(proQuestions), { status: 200 });
// }

export async function GET(request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const isUserRequest = url.searchParams.get("user"); // Check if the "user" query parameter is present

  if (isUserRequest) {
    // Fetch tickets for the logged-in user
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    const userProductQues = await ProductQuestion.find({ user: session.user.id }).populate("product").populate("user")
    .sort({ createdAt: -1 });

    return new Response(JSON.stringify(userProductQues), { status: 200 });
  }

  // Fetch all tickets (for admin panel)
  const tickets = await ProductQuestion.find({}).populate("product").populate("user")
    .sort({ createdAt: -1 });
  return new Response(JSON.stringify(tickets), { status: 200 });
}



// POST: Create a new product question with validation
export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    body.user = session.user.id;
    const { product, question } = body;


    // Validate product
    if (!product) {
      return new Response(JSON.stringify({ message: "انتخاب محصول الزامی است" }), { status: 400 });
    }
    const productExists = await Product.findById(product);
    if (!productExists) {
      return new Response(JSON.stringify({ message: "محصول یافت نشد" }), { status: 400 });
    }

    // Validate question length
    if (question.length < 1 || question.length > 200) {
      return new Response(JSON.stringify({ message: "سوال باید بین ۱ تا ۲۰۰ باشد" }), {
        status: 400,
      });
    }

    // Create product question
    const proQues = await ProductQuestion.create(body);

    if (!proQues) {
      return new Response(JSON.stringify({ message: "مشکلی در ساخت سوال در دیتابیس پیش آمده است" }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify(proQues), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
