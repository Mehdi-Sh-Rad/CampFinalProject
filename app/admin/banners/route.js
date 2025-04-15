import connectToDatabase from "@/app/lib/db";
import Banner from "@/models/Banner";

export async function GET() {
  await connectToDatabase();

  try {
    const banners = await Banner.find();
    return new Response(JSON.stringify(banners), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
