import { NextResponse } from "next/server";
import { join } from "path";
import { stat, createReadStream } from "fs";
import { promisify } from "util";
import { getServerSession } from "next-auth";
import Order from "@/models/Order";
import crypto from "crypto";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/db";
export const runtime = "nodejs";

// Promisify fs.stat for async/await usage
const statAsync = promisify(stat);

export async function GET(request, { params }) {
  // Check for authenticated session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/unauthorize", request.url));
  }

  const userId = session.user.id;
  const filename = params.filename;
  const { searchParams } = new URL(request.url);
  const signature = searchParams.get("signature");
  const timestamp = parseInt(searchParams.get("timestamp") || "0", 10);

  if (!signature || !timestamp) {
    return NextResponse.json({ message: "لینک دانلود نامعتبر است" }, { status: 400 });
  }

  // Verify signature
  const secret = process.env.DOWNLOAD_SECRET;
  const data = `${userId}:${filename}:${timestamp}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ message: "لینک دانلود نامعتبر است" }, { status: 403 });
  }

  // Check timestamp (valid for 5 minutes)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp - timestamp > 300) {
    return NextResponse.json({ message: "لینک دانلود نامعتبر است" }, { status: 403 });
  }

  //connect to database
  await connectToDatabase();

  // Find all orders of the current user with populated product data
  const orders = await Order.find({ user: userId }).populate("user").populate("items.product");

  // Check if the user has purchased the file
  const userHasFile = orders.some((order) => order.items.some((item) => item.product?.fileUrls?.some((url) => url.includes(filename))));

  // If user is not authorized to access the file
  if (!userHasFile) {
    return NextResponse.redirect(new URL("/unauthorize", request.url));
  }

  // Resolve file path
  const filePath = join(process.cwd(), "uploads/private/files", filename);

  try {
    // Check if file exists
    await statAsync(filePath);

    // Create file stream and return as response
    const stream = createReadStream(filePath);

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    // Return 404 if file not found
    return NextResponse.json({ message: "فایل یافت نشد" }, { status: 404 });
  }
}
