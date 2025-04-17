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

    // Validate topic
    if (!body.topic || typeof body.topic !== "string" || body.topic.trim() === "") {
      return new Response(JSON.stringify({ message: "موضوع الزامی است" }), {
        status: 400,
      });
    }
    if (body.topic.length < 3 || body.topic.length > 50) {
      return new Response(JSON.stringify({ message: "موضوع باید بین ۳ تا ۵۰ کاراکتر باشد" }), {
        status: 400,
      });
    }

    // Validate question
    if (!body.question || typeof body.question !== "string" || body.question.trim() === "") {
      return new Response(JSON.stringify({ message: "سوال الزامی است" }), {
        status: 400,
      });
    }
    if (body.question.length < 3 || body.question.length > 100) {
      return new Response(JSON.stringify({ message: "سوال باید بین ۳ تا ۱۰۰ کاراکتر باشد" }), {
        status: 400,
      });
    }

    // Validate answer
    if (!body.answer || typeof body.answer !== "string" || body.answer.trim() === "") {
      return new Response(JSON.stringify({ message: "پاسخ الزامی است" }), {
        status: 400,
      });
    }
    if (body.answer.length < 3 || body.answer.length > 500) {
      return new Response(JSON.stringify({ message: "پاسخ باید بین ۳ تا ۵۰۰ کاراکتر باشد" }), {
        status: 400,
      });
    }

    // Create frequent question
    const frequentQues = await FrequentQuestion.create(body);
    return new Response(JSON.stringify(frequentQues), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
