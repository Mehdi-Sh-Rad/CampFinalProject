import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";

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
    }

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
    let price = parseFloat(data.get("price"));
    const discountPrice = data.get("discountPrice") ? parseFloat(data.get("discountPrice")) : undefined;
    const active = data.get("active") === "true";
    const category = data.get("category");
    const types =
      data
        .get("types")
        ?.split(",")
        .map((tag) => tag.trim()) || [];
    const tags =
      data
        .get("tags")
        ?.split(",")
        .map((tag) => tag.trim()) || [];
    const free = data.get("free") === "true";
    const award = data.get("award") === "true";

    // Validate name, author, description, and price
    if (!name || name.trim() === "") {
      return new Response(JSON.stringify({ message: "نام محصول الزامی است" }), { status: 400 });
    }
    if (name.length < 3 || name.length > 30) {
      return new Response(JSON.stringify({ message: "نام محصول باید بین 3 تا 30 کاراکتر باشد" }), { status: 400 });
    }

    if (!author || author.trim() === "") {
      return new Response(JSON.stringify({ message: "نام نویسنده الزامی است" }), { status: 400 });
    }
    if (author.length < 3 || author.length > 50) {
      return new Response(JSON.stringify({ message: "نام نویسنده باید بین 3 تا 50 کاراکتر باشد" }), { status: 400 });
    }
    if (!description || description.trim() === "") {
      return new Response(JSON.stringify({ message: "توضیحات محصول الزامی است" }), { status: 400 });
    }
    if (description.length < 3 || description.length > 500) {
      return new Response(JSON.stringify({ message: "توضیحات محصول باید بین 3 تا 500 کاراکتر باشد" }), { status: 400 });
    }

    if (!category) {
      return new Response(JSON.stringify({ message: "انتخاب دسته‌بندی الزامی است" }), { status: 400 });
    }

    if (!free && (!price || isNaN(price) || price <= 0)) {
      return new Response(JSON.stringify({ message: "قیمت محصول باید مقدار مثبت باشد یا گزینه رایگان را انتخاب کنید" }), { status: 400 });
    }
    if (discountPrice !== undefined && (isNaN(discountPrice) || discountPrice < 0)) {
      return new Response(JSON.stringify({ message: "قیمت تخفیفی باید عدد مثبت باشد" }), { status: 400 });
    }

    if (discountPrice !== undefined && !free && discountPrice >= price) {
      return new Response(JSON.stringify({ message: "قیمت تخفیفی باید کمتر از قیمت اصلی باشد" }), { status: 400 });
    }

    if (files.length > 10) {
      return new Response(JSON.stringify({ message: "حداکثر 10 فایل مجاز است" }), {
        status: 400,
      });
    }
    if (images.length > 10) {
      return new Response(JSON.stringify({ message: "حداکثر 10 تصویر مجاز است" }), {
        status: 400,
      });
    }

    if (tags.length === 0) {
      return new Response(JSON.stringify({ message: "حداقل یک برچسب الزامی است" }), { status: 400 });
    }

    // Set price to 0 and discountPrice to undefined if free is true
    if (free) {
      price = 0;
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

    const productData = {
      fileUrls, // Array of file URLs
      imageUrls, // Array of image URLs
      name,
      author,
      description,
      price,
      category,
      types,
      tags,
      active,
      free,
      award,
    };
    if (!free && discountPrice !== undefined) {
      productData.discountPrice = discountPrice;
    }

    const product = await Product.create(productData);


    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error("Error saving product:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
