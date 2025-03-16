import connectToDatabase from "@/CampFinalProject/app/lib/db";
import Comments from "@/models/Comments";

export async function GET(request)
{
    await connectToDatabase();
    const Comments = await Comments.find({});
    return new Response(JSON.stringify(Comments), {status: 200});
}
export async function POST(request)
{
    await connectToDatabase();
    try {
      const body = await request.json();
        const Comment = await Comment.create(body);
        return new Response(JSON.stringify(Comment), {status: 200});

    }
    catch (error) {
        new Response(JSON.stringify({ message: error.message}), {status: 400});
    }
}
