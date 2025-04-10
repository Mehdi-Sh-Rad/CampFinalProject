import connectToDatabase from "@/app/lib/db";
import Ticket from "@/models/Ticket";

// DELETE: Delete a ticket
export async function DELETE(request, { params }) {
    await connectToDatabase();
    try {
        const id = await params.id;
        await Ticket.findByIdAndDelete(id);
        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}
