import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";
import User from "@/models/Product";
import Product from "@/models/User";

export async function GET(request) {
  await connectToDatabase();
  const order = await Order.find({})
  .populate("items.product", "name imageUrl price")
  .populate("user" ,"name")
  .sort({ createdAt: -1 });
  return new Response(JSON.stringify(order), { status: 200 });
}
