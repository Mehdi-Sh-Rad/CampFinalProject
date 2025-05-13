import connectToDatabase from "@/app/lib/db";
import Banner from "@/models/Banner";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join, dirname } from "path";
import { mkdir } from "fs/promises";

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

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.formData();

    const bannerData = {
      link: data.get("link"),
      description: data.get("description"),
    };

    const image = data.get("image");
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(
        process.cwd(),
        "public/uploads/banners",
        image.name
      );

      const dir = dirname(filePath);
      await mkdir(dir, { recursive: true });

      await writeFile(filePath, buffer);
      bannerData.image = `/uploads/banners/${image.name}`;
    } else {
      throw new Error("تصویر بنر اجباری است");
    }

    const banner = await Banner.create(bannerData);
    return new Response(JSON.stringify(banner), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/banners:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const data = await request.formData();
    const id = data.get("id");

    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      throw new Error("بنر مورد نظر یافت نشد");
    }

    const bannerData = {
      link: data.get("link"),
      description: data.get("description"),
      image: existingBanner.image,
    };

    const image = data.get("image");
    if (image && image.size > 0) {
      if (existingBanner.image) {
        const oldImagePath = join(
          process.cwd(),
          "public",
          existingBanner.image
        );
        try {
          await unlink(oldImagePath);
          console.log(`فایل تصویر قبلی حذف شد: ${oldImagePath}`);
        } catch (err) {
          console.error(`خطا در حذف فایل تصویر قبلی: ${err.message}`);
        }
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(
        process.cwd(),
        "public/uploads/banners",
        image.name
      );

      const dir = dirname(filePath);
      await mkdir(dir, { recursive: true });

      await writeFile(filePath, buffer);
      bannerData.image = `/uploads/banners/${image.name}`;
    }

    const banner = await Banner.findByIdAndUpdate(id, bannerData, {
      new: true,
    });
    return new Response(JSON.stringify(banner), { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/banners:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const banner = await Banner.findById(id);
    if (banner && banner.image) {
      const imagePath = join(process.cwd(), "public", banner.image);
      try {
        await unlink(imagePath);
        console.log(`فایل تصویر حذف شد: ${imagePath}`);
      } catch (err) {
        console.error(`خطا در حذف فایل تصویر: ${err.message}`);
      }
    }

    await Banner.findByIdAndDelete(id);
    const banners = await Banner.find();
    return new Response(JSON.stringify(banners), { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/banners:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
