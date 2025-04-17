import connectToDatabase from "@/app/lib/db";
import ProductQuestion from "@/models/ProductQuestion";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const productQuestion = await ProductQuestion.findById(id).populate("user").populate("product");
    if (!productQuestion) {
      return new Response(JSON.stringify({ message: "سوال محصول پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(productQuestion), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const { id } = await params;
  try {
    await ProductQuestion.findByIdAndDelete(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// PUT: Update a product question's answer by ID
export async function PUT(request, { params }) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { answer } = body;

    // Validate answer
    if (!answer || answer.trim() === "") {
      return new Response(JSON.stringify({ message: "پاسخ به سوال الزامی است" }), { status: 400 });
    }
    if (answer.length < 1 || answer.length > 200) {
      return new Response(JSON.stringify({ message: "پاسخ باید بین ۱ تا ۲۰۰ کاراکتر باشد" }), { status: 400 });
    }

    // Update product question
    const proQues = await ProductQuestion.findByIdAndUpdate(
      params.id,
      { answer },
      {
        new: true,
      }
    );

    // Check if question not found
    if (!proQues) {
      return new Response(JSON.stringify({ message: "سؤال مورد نظر پیدا نشد." }), { status: 404 });
    }

    // Return the updated document
    return new Response(JSON.stringify(proQues), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
