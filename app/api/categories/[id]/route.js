import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return new Response(JSON.stringify({ message: "دسته بندی پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(category), { status: 200 });
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
    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ message: "نام دسته بندی الزامی میباشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.name.length < 3 || body.name.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  try {
    await Category.findByIdAndDelete(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
