import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Order from "@/models/Order";
import User from "@/models/Product";
import Product from "@/models/User";


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

    const userOrder = await Order.find({ user: session.user.id })
    .populate("items.product", "name imageUrl price").populate("user" ,"name")
    .sort({ createdAt: -1 });
    return new Response(JSON.stringify(userOrder), { status: 200 });
  }

  // Fetch all tickets (for admin panel)
  const orders = await Order.find({})
  .populate("items.product", "name imageUrl price")
  .populate("user" ,"name")
  .sort({ createdAt: -1 });

  return new Response(JSON.stringify(orders), { status: 200 });
}
