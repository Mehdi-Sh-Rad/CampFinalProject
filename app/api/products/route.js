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


    const file = data.get("image");

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "اپلود تصویر الزامی میباشد",
      });
    }

    const name = data.get("name");
    const description = data.get("description");
    const price = data.get("price");
    const active = data.get("active");
    const discountPrice = data.get("discountPrice");

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

    if (price <= 0 || stock < 0) {
      return new Response(
        JSON.stringify({ message: "قیمت یا موجودی باید بیش از عدد ۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads");
    const filePath = join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    await connectToDatabase();

    const product = await Product.create({
      name,
      description,
      price,
      active,
      discountPrice,
      category,
      imageUrl: `/uploads/${file.name}`,
    });
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
