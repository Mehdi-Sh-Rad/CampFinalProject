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

    if (
      !body.problem ||
      typeof body.problem !== "string" ||
      body.problem.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ message: " درج سوال الزامی میباشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.topic.length < 1 || body.topic.length > 50) {
      return new Response(
        JSON.stringify({ message: "موضوع سوال باید بین ۱ تا ۵۰ کاراکتر باشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.problem.length < 1 || body.problem.length > 100) {
      return new Response(
        JSON.stringify({ message: "سوال باید بین ۱ تا ۱۰۰ کاراکتر باشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.answer.length < 1 || body.answer.length > 300) {
      return new Response(
        JSON.stringify({ message: "پاسخ باید بین ۱ تا ۳۰۰ کاراکتر باشد" }),
        {
          status: 400,
        }
      );
    }
    const ticket = await Tickets.create(body);
    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
