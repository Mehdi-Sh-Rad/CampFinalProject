import connectToDatabase from "@/app/lib/db";
import ProductQuestion from "@/models/ProductQuestion";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export async function GET(request) {
  await connectToDatabase();
  const proQuestions = await ProductQuestion.find({}).populate("product").populate("user");
  return new Response(JSON.stringify(proQuestions), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    console.log(ErrorBoundary)

    if (body.question.length < 1 || body.question.length > 200) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۱ تا ۲۰۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    const proQues = await ProductQuestion.create(body);
    return new Response(JSON.stringify(proQues), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

