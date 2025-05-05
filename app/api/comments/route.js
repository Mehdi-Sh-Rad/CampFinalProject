import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Comment from "@/models/Comment";
import Product from "@/models/Product";
import User from "@/models/User";


export async function GET(request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId"); // Get the productId query parameter
  const isUserRequest = url.searchParams.get("user"); // Check if the "user" query parameter is present

  if (isUserRequest) {
    // Fetch comments of the logged-in user
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    const userComments = await Comment.find({ user: session.user.id })
    .populate("user")
    .populate("product")
    .sort({ createdAt: -1 });

    return new Response(JSON.stringify(userComments), { status: 200 });
  }

  // Fetch comments for a specific product
  let filter = {};
  if (productId) {
    filter = { product: productId };


    const productComments = await Comment.find(filter)
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(productComments), { status: 200 });
  };

  // Fetch all tickets (for admin panel)
  const comments = await Comment.find({}).populate("user").populate("product").sort({ createdAt: -1 });
  return new Response(JSON.stringify(comments), { status: 200 });

};



export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    const session = await getServerSession({ req: request, ...authOptions });
    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "لطفا ابتدا وارد حساب شوید" }), { status: 401 });
    }

    body.user = session.user.id; // Assign the logged-in user's ID to the comment
    body.status = false; // Set the status to false by default


    // Validate required fields

    if (!body.product) {
      return new Response(JSON.stringify({ message: "محصول الزامی است" }), {
        status: 400,
      });
    }

    if (body.text.length < 1 || body.text.length > 200) {
      return new Response(JSON.stringify({ message: "نام باید بین ۱ تا ۲۰۰ باشد" }), {
        status: 400,
      });
    }

    // Validate product existence
    const productExists = await Product.findById(body.product);
    if (!productExists) {
      return new Response(JSON.stringify({ message: "محصول یافت نشد" }), {
        status: 400,
      });
    }

    // Create comment
    const comment = await Comment.create(body);
    return new Response(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
