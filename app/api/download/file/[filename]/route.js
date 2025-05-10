import { NextResponse } from "next/server";
import { join } from "path";
import { stat, createReadStream } from "fs";
import { promisify } from "util";
import { getServerSession } from "next-auth";
import Order from "@/models/Order";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/db";

// Promisify fs.stat for async/await usage
const statAsync = promisify(stat);

export async function GET(request, { params }) {
  // Check for authenticated session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "نیاز به ورود دارید" }, { status: 401 });
  }

  const userId = session.user.id;
  const filename = params.filename;

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
