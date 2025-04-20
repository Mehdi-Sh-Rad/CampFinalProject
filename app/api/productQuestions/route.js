import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import ProductQuestion from "@/models/ProductQuestion";
import User from "@/models/User";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

// GET: Fetch all product questions with populated user and product
export async function GET(request) {
  await connectToDatabase();
  const proQuestions = await ProductQuestion.find({}).populate("product").populate("user");
  return new Response(JSON.stringify(proQuestions), { status: 200 });
}

// POST: Create a new product question with validation
export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    console.log(ErrorBoundary);

    const { user, product, question } = body;

    // Validate user
    if (!user) {
      return new Response(JSON.stringify({ message: "انتخاب کاربر الزامی است" }), { status: 400 });
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return new Response(JSON.stringify({ message: "کاربر یافت نشد" }), { status: 400 });
    }

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
    return new Response(JSON.stringify(proQues), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
