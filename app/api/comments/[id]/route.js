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
