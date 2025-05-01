import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";

export async function GET(request) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search")?.trim();

    if (!searchQuery) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ],
    }).limit(10);

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
