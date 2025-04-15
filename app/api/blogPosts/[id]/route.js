import connectToDatabase from "@/app/lib/db";
import BlogPost from "@/models/BlogPost";
import { NextResponse } from "next/server";
import { join } from "path";
import { unlink, writeFile, mkdir } from "fs/promises";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;
  try {
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return NextResponse.json({ message: "مقاله پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json(blogPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه مقاله معتبر نیست" },
        { status: 400 }
      );
    }

    const data = await request.formData();

    await connectToDatabase();

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: "مقاله معتبر نیست" },
        { status: 404 }
      );
    }

    const title = data.get("title");
    const description = data.get("description");
    const image = data.get("image");

    if (!title || !description) {
      return NextResponse.json(
        { message: "تمامی فیلد‌های الزامی (عنوان، توضیحات) باید پر شوند" },
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

    let imageUrl = blogPost.imageUrl;

    if (image && image.name) {
      const uploadDirImage = join(process.cwd(), "public/uploads/images");
      await mkdir(uploadDirImage, { recursive: true });

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDirImage, image.name);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/images/${image.name}`;

      if (blogPost.imageUrl) {
        const oldFilePath = join(process.cwd(), "public", blogPost.imageUrl);
        await unlink(oldFilePath).catch((err) => {
          console.error("خطا در حذف تصویر قبلی:", err);
        });
      }
    }

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageUrl,
      },
      { new: true }
    );

    return NextResponse.json(updatedBlogPost, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/blogPosts/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "خطا در ویرایش مقاله" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "خطا در حذف مقاله" },
        { status: 400 }
      );
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: "مقاله معتبر نیست" },
        { status: 404 }
      );
    }

    if (blogPost.imageUrl) {
      const filePath = join(process.cwd(), "public", blogPost.imageUrl);
      await unlink(filePath).catch((err) => {
        console.error("خطا در حذف تصویر:", err);
      });
    }

    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/blogPosts/[id]:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}