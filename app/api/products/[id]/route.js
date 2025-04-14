import connectToDatabase from "@/app/lib/db";
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
        message: "محصول معتبر نیست",
      });
    }

    const name = data.get("name");
    const author = data.get("author");
    const description = data.get("description");
    const price = data.get("price");
    const discountPrice = data.get("discountPrice");
    const category = data.get("category");
    const types = data.get("types")?.split(",").map((tag) => tag.trim()) || [];
    const tags = data.get("tags")?.split(",").map((tag) => tag.trim()) || [];
    const active = data.get("active");
    const free = data.get("free");
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

    let imageUrls = [];
    let fileUrls = [];

    // Handle images
    if (images && images.length > 0) {
      for (const image of images) {
        if (image instanceof File) {
          // Process new image files
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadDir = join(process.cwd(), "public/uploads/images");
          const filePath = join(uploadDir, image.name);

          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/images/${image.name}`);
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
       
          const uploadDir = join(process.cwd(), "public/uploads/files");
          const filePath = join(uploadDir, file.name);

          await writeFile(filePath, buffer);
          fileUrls.push(`/uploads/files/${file.name}`);
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
            const oldFilePath = join(process.cwd(), "public", oldFile);
            await unlink(oldFilePath).catch(() => {
              console.log("خطا در حذف فایل قبلی");
            });
          }
        }
      }
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        author,
        description,
        price,
        discountPrice,
        category,
        tags,
        types,
        active,
        free,
        award,
        imageUrls,
        fileUrls,
      },
      { new: true }
    );

    return new Response(JSON.stringify(updateProduct), { status: 200 });
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
      return new Response(
        JSON.stringify({ message: "تصویر محصول پیدا نشد" }),
        { status: 404 }
      );
    }
    imageUrls.map((imageUrl) => {
      const filePath = join(process.cwd(), "public", imageUrl);
      unlink(filePath).catch(() => {
        console.log("خطا در حذف تصویر از سرور");
      });
    }
    );

    // Delete the file from the server
    const fileUrls = product.fileUrls;
    if (!fileUrls || fileUrls.length === 0) {
      return new Response(
        JSON.stringify({ message: "فایل محصول پیدا نشد" }),
        { status: 404 }
      );
    }   
    fileUrls.map((fileUrl) => {
      const filePath = join(process.cwd(), "public", fileUrl);
      unlink(filePath).catch(() => {
        console.log("خطا در حذف فایل از سرور");
      });
    }
    );

    // Delete the product from the database
    await Product.findByIdAndDelete(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
