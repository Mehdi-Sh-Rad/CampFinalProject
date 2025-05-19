import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ message: "Filename is required" }, { status: 400 });
  }

  await connectToDatabase();

  // Check if user has purchased the file
  const orders = await Order.find({ user: userId }).populate("items.product");
  const userHasFile = orders.some((order) =>
    order.items.some((item) => item.product?.fileUrls?.some((url) => url.includes(filename)))
  );

  if (!userHasFile) {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  // Generate signature
  const secret = process.env.DOWNLOAD_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);
  const data = `${userId}:${filename}:${timestamp}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");

  return NextResponse.json({ signature, timestamp });
}