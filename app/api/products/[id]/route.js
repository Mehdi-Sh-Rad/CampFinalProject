import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import { isValidObjectId } from "mongoose";
import { mkdirSync, existsSync } from "fs";

// View product by ID
export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "آیدی محصول نامعتبر است" }, { status: 400 });
  }
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

function extractFileName(url) {
  return url.split("/").pop();
}

// Update an existing product by ID
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
        message: "محصول معتبر نیست",
      });
    }

    const name = data.get("name");
    const author = data.get("author");
    const description = data.get("description");
    let price = data.get("price");
    let discountPrice = data.get("discountPrice") ? parseFloat(data.get("discountPrice")) : undefined;
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
    const active = data.get("active");
    const free = data.get("free") === "true";

    const award = data.get("award");

    // Get all files and images as arrays
    let files = data.getAll("files");
    let images = data.getAll("images");

    if (!files.length || !images.length) {
      return NextResponse.json({
        success: false,
        console: "files",
        message: "آپلود فایل‌ها و تصاویر الزامی میباشد",
      });
    }

    // Validate required fields
    if (!name || name.trim() === "") {
      return new Response(JSON.stringify({ message: "نام محصول الزامی است" }), { status: 400 });
    }
    if (name.length < 3 || name.length > 30) {
      return new Response(JSON.stringify({ message: "نام محصول باید بین 3 تا 30 کاراکتر باشد" }), { status: 400 });
    }

     const nameRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,30}$/;
        if (!nameRegex.test(name)) {
          return NextResponse.json({message : "نام میتواند شامل حروف ، اعداد و فاصله باشد"} , {status : 400})
        }

    if (!author || author.trim() === "") {
      return new Response(JSON.stringify({ message: "نام نویسنده الزامی است" }), { status: 400 });
    }
    if (author.length < 3 || author.length > 50) {
      return new Response(JSON.stringify({ message: "نام نویسنده باید بین 3 تا 50 کاراکتر باشد" }), { status: 400 });
    }

    const authorRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,50}$/;
        if (!authorRegex.test(author)) {
          return NextResponse.json({message : "نام نویسنده میتواند شامل حروف ، اعداد و فاصله باشد"} , {status : 400})
        }

    if (!description || description.trim() === "") {
      return new Response(JSON.stringify({ message: "توضیحات محصول الزامی است" }), { status: 400 });
    }
    if (description.length < 3 || description.length > 500) {
      return new Response(JSON.stringify({ message: "توضیحات محصول باید بین 3 تا 500 کاراکتر باشد" }), { status: 400 });
    }

    const descriptionRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,500}$/;
        if (!descriptionRegex.test(description)) {
          return NextResponse.json({message : "توضیحات محصول میتواند شامل حروف ، اعداد و فاصله باشد"} , {status : 400})
        }

    if (!category) {
      return new Response(JSON.stringify({ message: "انتخاب دسته‌بندی الزامی است" }), { status: 400 });
    }

    if (!free && (!price || isNaN(price) || price <= 0)) {
      return new Response(JSON.stringify({ message: "قیمت محصول باید مقدار مثبت باشد یا گزینه رایگان را انتخاب کنید" }), { status: 400 });
    }
    if (free && discountPrice !== undefined) {
      discountPrice = undefined; // Ignore discountPrice if free is true
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

    // Set price to 0 if free is true
    if (free) {
      price = 0;
    }
    console.log("after : ", free, price);

    let imageUrls = [];
    let fileUrls = [];

    // Function to generate a unique file name based on the current timestamp
    const generateUniqueFileName = (originalName) => {
      const extname = originalName.slice(originalName.lastIndexOf(".")); 
      const basename = originalName.slice(0, originalName.lastIndexOf("."));
      const timestamp = Date.now(); 
      return `${basename}-${timestamp}${extname}`; 
    };

    // Handle images
    if (images && images.length > 0) {
      for (const image of images) {
        if (image instanceof File) {
          // Process new image files
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadDir = join(process.cwd(), "public/uploads/images");
          const uniqueImageName = generateUniqueFileName(image.name);
          const filePath = join(uploadDir, uniqueImageName);

          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/images/${uniqueImageName}`);
        } else if (typeof image === "string") {
          // Keep existing image URLs
          imageUrls.push(image);
        } else {
          console.log("Unexpected image type:", image);
        }
      }

      // Delete old images that are not in the new list
      if (product.imageUrls && product.imageUrls.length > 0) {
        for (const oldImage of product.imageUrls) {
          if (!imageUrls.includes(oldImage)) {
            const oldImagePath = join(process.cwd(), "public", oldImage);
            await unlink(oldImagePath).catch(() => {
              console.log("خطا در حذف تصویر قبلی");
            });
          }
        }
      }
    }

    // Handle files
    if (files && files.length > 0) {
      for (const file of files) {
        if (file instanceof File) {
          // Process new file uploads
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadDir = join(process.cwd(), "uploads/private/files");
          const uniqueFileName = generateUniqueFileName(file.name);

          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = join(uploadDir, uniqueFileName);

          await writeFile(filePath, buffer);
          fileUrls.push(`uploads/private/files/${uniqueFileName}`);
        } else if (typeof file === "string") {
          fileUrls.push(file);
        } else {
          console.log("Unexpected image type:", file);
        }
      }

      // Delete old files that are not in the new list
      if (product.fileUrls && product.fileUrls.length > 0) {
        for (const oldFile of product.fileUrls) {
          if (!fileUrls.includes(oldFile)) {
            const oldFilePath = join(process.cwd(), "uploads/private/files", extractFileName(oldFile));
            await unlink(oldFilePath).catch(() => {
              console.log("خطا در حذف فایل قبلی");
            });
          }
        }
      }
    }

    product.name = name;
    product.author = author;
    product.description = description;
    product.price = free ? 0 : price;
    product.category = category;
    product.tags = tags;
    product.types = types;
    product.active = active;
    product.free = free;
    product.award = award;
    product.imageUrls = imageUrls;
    product.fileUrls = fileUrls;

    if (free) {
      product.discountPrice = undefined;
      product.finalPrice = 0;
    } else if (discountPrice !== undefined) {
      product.discountPrice = discountPrice;
      product.finalPrice = discountPrice;
    } else {
      product.finalPrice = price;
    }

    const saved = await product.save();

    return new Response(JSON.stringify(saved), { status: 200 });
  } catch (error) {
    console.log("خطا در ویرایش محصول", error);
    return NextResponse.json({
      success: false,
      message: "خطا در ویرایش محصول",
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

    // Delete the image file from the server
    const imageUrls = product.imageUrls;
    if (!imageUrls || imageUrls.length === 0) {
      return new Response(JSON.stringify({ message: "تصویر محصول پیدا نشد" }), { status: 404 });
    }
    imageUrls.map((imageUrl) => {
      const filePath = join(process.cwd(), "public", imageUrl);
      unlink(filePath).catch(() => {
        console.log("خطا در حذف تصویر از سرور");
      });
    });

    // Delete the file from the server
    const fileUrls = product.fileUrls;
    if (!fileUrls || fileUrls.length === 0) {
      return new Response(JSON.stringify({ message: "فایل محصول پیدا نشد" }), { status: 404 });
    }
    fileUrls.map((fileUrl) => {
      const filePath = join(process.cwd(), "public", fileUrl);
      unlink(filePath).catch(() => {
        console.log("خطا در حذف فایل از سرور");
      });
    });

    // Delete the product from the database
    await Product.findByIdAndDelete(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
