import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comment";


export async function DELETE(request, { params }) {
  await connectToDatabase();
  const { id } = await params;
  try {
    await Comment.findByIdAndDelete(id);
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
    const { id } = await params;
    if (!body) {
      return new Response(JSON.stringify({ message: "No data provided" }), {
        status: 400,
      });
    }   
    const comment = await Comment.findByIdAndUpdate(id, body, {
      new: true,
    });
    return new Response(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
