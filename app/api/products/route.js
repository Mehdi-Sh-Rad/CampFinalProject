import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";

export async function GET(request) {
  await connectToDatabase();
  const products = await Product.find({}).populate("category");
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(request) {
  try {
    const data = await request.formData();

    const file = data.get("file");
    const image = data.get("image");

    if (!file || !image) {
      return NextResponse.json({
        success: false,
        message: "اپلود فایل و تصویر الزامی میباشد",
      });
    }

    const name = data.get("name");
    const description = data.get("description");
    const price = data.get("price");
    const discountPrice = data.get("discountPrice");
    const active = data.get("active");
    const category = data.get("category");
    const types = data.get("types").split(",").map(tag => tag.trim());
    const tags = data.get("tags").split(",").map(tag => tag.trim());
    const free = data.get("free");

    if (!name || !description || isNaN(price) || isNaN(discountPrice) || !category) {
      return new Response(
        JSON.stringify({ message: "تمامی فیلد ها الزامی میباشند" }),
        {
          status: 400,
        }
      );
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ message: "نام محصول الزامی میباشد" }),
        {
          status: 400,
        }
      );
    }
    if (name.length < 3 || name.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }),
        {
          status: 400,
        }
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ message: "توضیحات محصول الزامی میباشد" }),
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
        JSON.stringify({ message: "قیمت یا موجودی باید بیش از عدد ۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    
    const bytesFile = await file.arrayBuffer();
    const bytesImage = await image.arrayBuffer();
    
    const bufferFile = Buffer.from(bytesFile);
    const bufferImage = Buffer.from(bytesImage);

    const uploadDirFile = join(process.cwd(), "public/uploads/files");
    const filePath = join(uploadDirFile, file.name);
    const uploadDirImage = join(process.cwd(), "public/uploads/images");
    const imagePath = join(uploadDirImage, image.name);

    await writeFile(filePath, bufferFile);
    await writeFile(imagePath, bufferImage);

    await connectToDatabase();

    console.log("Creating product with data:", {
      fileUrl: `/uploads/files/${file.name}`,
      name,
      description,
      price,
      discountPrice,
      category,
      types,
      tags,
      active,
      free,
      imageUrl: `/uploads/images/${image.name}`,
    });

    const product = await Product.create({

      fileUrl: `/uploads/files/${file.name}`,
      name,
      description,
      price,
      discountPrice,
      category,
      types,
      tags,
      active,
      free,
      imageUrl: `/uploads/images/${image.name}`,
    });

    console.log("Product created:", product);
    
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
