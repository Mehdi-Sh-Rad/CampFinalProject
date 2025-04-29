import connectToDatabase from "@/app/lib/db";
import Wallet from "@/models/Wallet";
import User from "@/models/User";


export async function GET(request) {
  await connectToDatabase();
  const wallet = await Wallet.find({}).populate("items.product");
  return new Response(JSON.stringify(wallet), { status: 200 });
}

