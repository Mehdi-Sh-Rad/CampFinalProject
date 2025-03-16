import connectToDatabase from "@/app/lib/db";
import Comments from "@/models/Comments";

export async function DELETE(request, { params }) {
    await connectToDatabase();
    try {
        await Comments.findByIdAndDelete(params.id);
        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}