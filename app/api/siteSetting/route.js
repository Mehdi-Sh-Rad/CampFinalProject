import connectToDatabase from "@/app/lib/db";
import SiteSetting from "@/models/SiteSetting";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({
        slogan: "جهان کتاب، در دستان شما",
      });
    }
    return new Response(JSON.stringify(settings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({ slogan: data.slogan });
    } else {
      settings = await SiteSetting.findOneAndUpdate({}, { slogan: data.slogan }, { new: true });
    }

    return new Response(JSON.stringify(settings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}