import connectToDatabase from "@/app/lib/db";
import Comments from "@/models/Comments";

export async function GET(request) {
    await connectToDatabase();
    const comments = await Comments.find({});
    return new Response(JSON.stringify(comments), { status: 200 });
}
export async function POST(request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const comment = await Comment.create(body);
        return new Response(JSON.stringify(comment), { status: 200 });

    }
    catch (error) {
        new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }
}

