import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comment";

export async function GET(request) {
  await connectToDatabase();
  const comments = await Comment.find({}).populate("product").populate("user");
  return new Response(JSON.stringify(comments), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    if (body.text.length < 1 || body.text.length > 200) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۱ تا ۲۰۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    const comment = await Comment.create(body);
    return new Response(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

