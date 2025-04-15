import connectToDatabase from "@/app/lib/db";
import BlogPost from "@/models/BlogPost";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDatabase();

  try {
    const blogPosts = await BlogPost.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();

    const title = data.get("title");
    const description = data.get("description");
    const image = data.get("image");

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "عنوان و توضیحات الزامی می‌باشند" },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { message: "عنوان مقاله الزامی می‌باشد" },
        { status: 400 }
      );
    }
    if (title.length < 3 || title.length > 100) {
      return NextResponse.json(
        { message: "عنوان باید بین ۳ تا ۱۰۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (typeof description !== "string" || description.trim() === "") {
      return NextResponse.json(
        { message: "توضیحات مقاله الزامی می‌باشد" },
        { status: 400 }
      );
    }
    if (description.length < 10 || description.length > 5000) {
      return NextResponse.json(
        { message: "توضیحات باید بین ۱۰ تا ۵۰۰۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image && image.name) {
      const uploadDirImage = join(process.cwd(), "public/uploads/images");
      await mkdir(uploadDirImage, { recursive: true });

      const bytesImage = await image.arrayBuffer();
      const bufferImage = Buffer.from(bytesImage);
      const imagePath = join(uploadDirImage, image.name);
      await writeFile(imagePath, bufferImage);
      imageUrl = `/uploads/images/${image.name}`;
    }

    await connectToDatabase();

    const blogPost = await BlogPost.create({
      title,
      description,
      imageUrl,
    });

    return NextResponse.json(blogPost, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/blogPosts:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}