import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { join } from "path";
import {unlink, writeFile } from "fs/promises";

export async function GET(request) {
  await connectToDatabase();
  const products = await Product.find({}).populate("category");
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(request) {
  try {
    const data = await request.formData();
    if (!data) {
      return NextResponse.json({
        success: false,
        message: "خطا در دریافت اطلاعات",
      });
    };

    // Get all files and images as arrays   
    let files = data.getAll("files"); // Use "files" as the key for multiple files
    let images = data.getAll("images"); // Use "images" as the key for multiple images
    if (!files.length || !images.length) {
      return NextResponse.json({
        success: false,
        message: "آپلود فایل‌ها و تصاویر الزامی میباشد",
      });
    }

    const name = data.get("name");
    const author = data.get("author");
    const description = data.get("description");
    const price = parseFloat(data.get("price"));
    const discountPrice = parseFloat(data.get("discountPrice"));
    const active = data.get("active") === "true";
    const category = data.get("category");
    const types = data.get("types")?.split(",").map((tag) => tag.trim()) || [];
    const tags = data.get("tags")?.split(",").map((tag) => tag.trim()) || [];
    const free = data.get("free") === "true";
    const award = data.get("award") === "true";

    if (!name || !description || !author || isNaN(price) || isNaN(discountPrice) || !category) {
      return new Response(
        JSON.stringify({ message: "تمامی فیلد ها الزامی میباشند" }),
        {
          status: 400,
        }
      );
    }

    // Validate name, author, description, and price
    if (name.length < 3 || name.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }),
        {
          status: 400,
        }
      );
    }

    if (author.length < 3 || author.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام نویسنده باید بین ۳ تا ۳۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    if (files.length > 10) {
      return new Response(
        JSON.stringify({ message: "حداکثر ۱۰ فایل مجاز است" }),
        {
          status: 400,
        }
      );
    }
    if (images.length > 10) {
      return new Response(
        JSON.stringify({ message: "حداکثر ۱۰ تصویر مجاز است" }),
        {
          status: 400,
        }
      );
    }

    if (description.length < 3 || description.length > 200) {
      return new Response(
        JSON.stringify({ message: "توضیحات باید بین ۳ تا ۲۰۰ باشد" }),
        {
          status: 400,
        }
      );
    }

    if (price <= 0) {
      return new Response(
        JSON.stringify({ message: "قیمت باید بیش از عدد ۰ باشد" }),
        {
          status: 400,
        }
      );
    }

    // Ensure upload directories exist
    const uploadDirFile = join(process.cwd(), "public/uploads/files");
    const uploadDirImage = join(process.cwd(), "public/uploads/images");

    // Save files and images to disk
    const fileUrls = [];
    const imageUrls = [];

    for (const file of files) {
      const bytesFile = await file.arrayBuffer();
      const bufferFile = Buffer.from(bytesFile);
      const filePath = join(uploadDirFile, file.name);
      await writeFile(filePath, bufferFile);
      fileUrls.push(`/uploads/files/${file.name}`);
    }

    for (const image of images) {
      const bytesImage = await image.arrayBuffer();
      const bufferImage = Buffer.from(bytesImage);
      const imagePath = join(uploadDirImage, image.name);
      await writeFile(imagePath, bufferImage);
      imageUrls.push(`/uploads/images/${image.name}`);
    }

    // Save product to database
    await connectToDatabase();

    const product = await Product.create({
      fileUrls, // Array of file URLs
      imageUrls, // Array of image URLs
      name,
      author,
      description,
      price,
      discountPrice,
      category,
      types,
      tags,
      active,
      free,
      award,
    });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error("Error saving product:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}