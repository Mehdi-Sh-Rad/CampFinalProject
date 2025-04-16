import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comment";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(request) {
  await connectToDatabase();
  const comments = await Comment.find({}).populate("product").populate("user");
  return new Response(JSON.stringify(comments), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.user) {
      return new Response(JSON.stringify({ message: "کاربر الزامی است" }), {
        status: 400,
      });
    }
    if (!body.product) {
      return new Response(JSON.stringify({ message: "محصول الزامی است" }), {
        status: 400,
      });
    }

    if (body.text.length < 1 || body.text.length > 200) {
      return new Response(JSON.stringify({ message: "نام باید بین ۱ تا ۲۰۰ باشد" }), {
        status: 400,
      });
    }

    // Validate user existence
    const userExists = await User.findById(body.user);
    if (!userExists) {
      return new Response(JSON.stringify({ message: "کاربر یافت نشد" }), {
        status: 400,
      });
    }

    // Validate product existence
    const productExists = await Product.findById(body.product);
    if (!productExists) {
      return new Response(JSON.stringify({ message: "محصول یافت نشد" }), {
        status: 400,
      });
    }

    // Create comment
    const comment = await Comment.create(body);
    return new Response(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
