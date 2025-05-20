import connectToDatabase from "@/app/lib/db";
import Tickets from "@/models/Ticket";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// View all tickets or tickets for a specific user
export async function GET(request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const isUserRequest = url.searchParams.get("user"); 

  if (isUserRequest) {
    // Fetch tickets for the logged-in user
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    const userTickets = await Tickets.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(userTickets), { status: 200 });
  }

  // Fetch all tickets (for admin panel)
  const tickets = await Tickets.find({}).populate("userId").sort({ createdAt: -1 });
  return new Response(JSON.stringify(tickets), { status: 200 });
};


// Create a new ticket
export async function POST(request) {
  await connectToDatabase();
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.topic || typeof body.topic !== "string" || body.topic.trim().length < 1 ) {
      return new Response(JSON.stringify({ message: "موضوع تیکت باید بین ۱ تا ۱۰۰ کاراکتر باشد" }), {
        status: 400,
      });
    }

    // Add the logged-in user's ID to the ticket
    const ticketData = {
      ...body,
      userId: session.user.id, // Associate the ticket with the logged-in user
    };

    const ticket = await Tickets.create(ticketData);

    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}