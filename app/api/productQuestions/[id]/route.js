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
export async function PUT(request, { params }) {
  await connectToDatabase();
  try {
    const body = await request.json();

    const proQues = await ProductQuestion.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(proQues), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

