import connectToDatabase from "@/app/lib/db";
import Ticket from "@/models/Ticket";

// GET: Fetch a ticket and its messages
export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return new Response(JSON.stringify({ message: "تیکت پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// POST: Add a new message to the ticket
export async function POST(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const { text, sender } = await request.json(); // Expecting `text` and `sender` in the request body
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return new Response(JSON.stringify({ message: "تیکت پیدا نشد" }), {
        status: 404,
      });
    }

    // Add the new message to the ticket's messages array
    ticket.message.push({ text, sender, timestamp: new Date() });
    await ticket.save();

    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// PUT: Update ticket details (optional, if needed)
export async function PUT(request, { params }) {
  await connectToDatabase();
  try {

    const { text , sender} = await request.json(); 
    console.log("the sender is **********:", text)
    const ticket = await Ticket.findByIdAndUpdate(params.id, {
      $push: {
        message: { text, sender, timestamp: new Date() },
      },
    }, {
      new: true,
    });
   
    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// DELETE: Delete a ticket
export async function DELETE(request, { params }) {
  await connectToDatabase();
  try {
    await Ticket.findByIdAndDelete(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

