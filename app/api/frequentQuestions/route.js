import connectToDatabase from "@/app/lib/db";
import FrequentQuestion from "@/models/FrequentQuestion";

export async function GET(request) {
  await connectToDatabase();
  const frequentQuestion = await FrequentQuestion.find({});
  return new Response(JSON.stringify(frequentQuestion), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    if (
      !body.question ||
      typeof body.question !== "string" ||
      body.question.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ message: "نام دسته بندی الزامی میباشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.topic.length < 1 || body.topic.length > 50) {
      return new Response(
        JSON.stringify({ message: "موضوع سوال باید بین ۱ تا ۵۰ کاراکتر باشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.question.length < 1 || body.question.length > 100) {
      return new Response(
        JSON.stringify({ message: "سوال باید بین ۱ تا ۱۰۰ کاراکتر باشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.answer.length < 1 || body.answer.length > 300) {
      return new Response(
        JSON.stringify({ message: "پاسخ باید بین ۱ تا ۳۰۰ کاراکتر باشد" }),
        {
          status: 400,
        }
      );
    }
    const frequentQues = await FrequentQuestion.create(body);
    return new Response(JSON.stringify(frequentQues), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
