import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";


export async function PUT(request, { params }) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { id } = await params;
    if (!body) {
      return new Response(JSON.stringify({ message: "No data provided" }), {
        status: 400,
      });
    }   
    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
    });
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
