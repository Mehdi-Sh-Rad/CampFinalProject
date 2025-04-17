import connectToDatabase from "@/app/lib/db";
import FrequentQuestion from "@/models/FrequentQuestion";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const frequentQuestions = await FrequentQuestion.findById(id);
    if (!frequentQuestions) {
      return new Response(JSON.stringify({ message: "دسته بندی پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(frequentQuestions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  try {
    const { id } = params;
    const body = await request.json();

    // Validate ID
    if (!id) {
      return new Response(JSON.stringify({ message: "شناسه سوال الزامی است" }), {
        status: 400,
      });
    }

    // Check if question exists
    const existingQuestion = await FrequentQuestion.findById(id);
    if (!existingQuestion) {
      return new Response(JSON.stringify({ message: "سوال متداول یافت نشد" }), {
        status: 404,
      });
    }

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

    // Update frequent question
    const frequentQues = await FrequentQuestion.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(frequentQues), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  try {
    await FrequentQuestion.findByIdAndDelete(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
