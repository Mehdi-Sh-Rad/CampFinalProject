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
    const body = await request.json();
    // if (
    //   !body.name ||
    //   typeof body.name !== "string" ||
    //   body.name.trim() === ""
    // ) {
    //   return new Response(
    //     JSON.stringify({ message: "نام دسته بندی الزامی میباشد" }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }
    // if (body.name.length < 3 || body.name.length > 30) {
    //   return new Response(
    //     JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }
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
