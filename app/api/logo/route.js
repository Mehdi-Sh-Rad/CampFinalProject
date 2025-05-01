import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import LogoSettings from "@/models/LogoSettings";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await LogoSettings.findOne();
    if (!settings) {
      settings = await LogoSettings.create({
        headerLogo: "/PersianLogo.png",
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching logo settings:", error);
    return NextResponse.json(
      { headerLogo: "/PersianLogo.png" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.formData();

    let settings = await LogoSettings.findOne();
    if (!settings) {
      settings = new LogoSettings({});
    }

    const uploadDir = join(process.cwd(), "public");
    const file = data.get("headerLogo");
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      settings.headerLogo = `/${file.name}`;
    }

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error saving logo settings:", error);
    return NextResponse.json({ error: "Failed to save logo settings" }, { status: 500 });
  }
}