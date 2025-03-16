import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ message: "محصول پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "شناسه محصول معتبر نیست",
      });
    }

    const data = await request.formData();

    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: " محصول معتبر نیست",
      });
    }

    const name = data.get("name");
    const description = data.get("description");
    const price = data.get("price");
    const stock = data.get("stock");
    const category = data.get("category");
    const file = data.get("image");

    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
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

    let imageUrl = product.imageUrl;

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads");
      const filePath = join(uploadDir, file.name);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${file.name}`;

      const oldFilePath = join(process.cwd(), "public", product.imageUrl);
      await unlink(oldFilePath).catch(() => {
        console.log("خطا در حذف تصویر قبلی");
      });
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
      },
      { new: true }
    );

    return new Response(JSON.stringify(updateProduct), { status: 200 });
  } catch (error) {
    console.log("خطا در ویرایش محصول");
    return NextResponse.json({
      success: false,
      message: "خطا در ویرایش مخصول",
    });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "خطا در حذف محصول",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: " محصول معتبر نیست",
      });
    }

    const filePath = join(process.cwd(), "public", product.imageUrl);
    await unlink(filePath).catch(() => {
      console.log("خطا در حذف تصویر قبلی");
    });

    await Product.findByIdAndDelete(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
