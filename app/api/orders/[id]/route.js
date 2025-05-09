import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isValidObjectId } from "mongoose";
import { getToken } from "next-auth/jwt";

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

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const session = await getServerSession({ req, ...authOptions });

    if (!session?.user) return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
    const userId = session.user.id;

       const { id } = await  params;
      
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "آیدی سفارش نامعتبر است" }, { status: 400 });
    }

    const order = await Order.findOne({ _id: id, user :userId }).populate("user").populate("items.product");
    if (!order) return NextResponse.json({ message: "سفارش یافت نشد" }, { status: 404 });

   
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
