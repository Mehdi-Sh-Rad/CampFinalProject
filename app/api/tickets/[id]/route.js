import connectToDatabase from "@/app/lib/db";
import Tickets from "@/models/Ticket";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const tickets = await Tickets.findById(id);
    if (!tickets) {
      return new Response(JSON.stringify({ message: "دسته بندی پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(tickets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  try {
    const body = await request.json();
    // if (
    //   !body.name ||
    //   typeof body.name !== "string" ||
    //   body.name.trim() === ""
    // ) {
    //   return new Response(
    //     JSON.stringify({ message: "نام دسته بندی الزامی میباشد" }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }
    // if (body.name.length < 3 || body.name.length > 30) {
    //   return new Response(
    //     JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }
    const ticket = await Tickets.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  try {
    await Tickets.findByIdAndDelete(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
