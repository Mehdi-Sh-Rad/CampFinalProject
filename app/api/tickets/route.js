import connectToDatabase from "@/app/lib/db";
import Tickets from "@/models/Ticket";

export async function GET(request) {
  await connectToDatabase();
  const tickets = await Tickets.find({});
  return new Response(JSON.stringify(tickets), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // Basic validation
    if (!body.topic || typeof body.topic !== "string" || body.topic.trim().length < 1 || body.topic.trim().length > 100) {
      return new Response(JSON.stringify({ message: "موضوع تیکت باید بین ۱ تا ۱۰۰ کاراکتر باشد" }), {
        status: 400,
      });
    }

    const ticket = await Tickets.create(body);

    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
