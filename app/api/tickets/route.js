// import connectToDatabase from "@/app/lib/db";
// import Tickets from "@/models/Ticket";

// export async function GET(request) {
//   await connectToDatabase();
//   const tickets = await Tickets.find({});
//   return new Response(JSON.stringify(tickets), { status: 200 });
// }

// export async function POST(request) {
//   await connectToDatabase();
//   try {
//     const body = await request.json();

//     // Basic validation
//     if (!body.topic || typeof body.topic !== "string" || body.topic.trim().length < 1 || body.topic.trim().length > 100) {
//       return new Response(JSON.stringify({ message: "موضوع تیکت باید بین ۱ تا ۱۰۰ کاراکتر باشد" }), {
//         status: 400,
//       });
//     }

//     const ticket = await Tickets.create(body);

//     return new Response(JSON.stringify(ticket), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: error.message }), {
//       status: 500,
//     });
//   }
// }

import connectToDatabase from "@/app/lib/db";
import Tickets from "@/models/Ticket";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const isUserRequest = url.searchParams.get("user"); // Check if the "user" query parameter is present

  if (isUserRequest) {
    // Fetch tickets for the logged-in user
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    const userTickets = await Tickets.find({ userId: session.user.id });
    return new Response(JSON.stringify(userTickets), { status: 200 });
  }

  // Fetch all tickets (for admin panel)
  const tickets = await Tickets.find({});
  return new Response(JSON.stringify(tickets), { status: 200 });
};



// POST request to create a new ticket
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
};
