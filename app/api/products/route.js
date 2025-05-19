import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import { mkdirSync, existsSync } from "fs";


export async function GET(request) {
  await connectToDatabase();

  // Get the search parameters from the URL of the request.
  const { searchParams } = new URL(request.url);

  // Get the parameters from the search parameters.
  const category = searchParams.get("category") || null;
  const sort = searchParams.get("sort") || null;
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = minPriceParam ? parseInt(minPriceParam) : null;
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam) : null;
  const award = searchParams.get("award") === "true";
  const free = searchParams.get("free") === "true";
  const active = searchParams.get("active") === "true";
  const discount = searchParams.get("discountPrice") === "true";

  // Initialize an empty query object.
  let query = {};

  // If a 'category' exists, add it to the query object.
  if (category) query.category = category;

  // Handle price filtering based on the 'free', 'minPrice', and 'maxPrice' parameters.
  if (free) {
    query.finalPrice = 0;
  } else if (minPrice !== null && maxPrice !== null) {
    query.finalPrice = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice !== null) {
    query.finalPrice = { $gte: minPrice };
  } else if (maxPrice !== null) {
    query.finalPrice = { $lte: maxPrice };
  }; 

  // If 'award' 'active' 'discount' is true, add it to the query object
  if (award) query.award = true;

  if (discount) query.discountPrice = { $exists: true, $ne: null };

  if (active) query.active = true;

  // Initialize an empty sort condition object.
  let sortCondition = {};

  // Apply sorting based on the 'sort' parameter.
  if (sort === "latest") sortCondition.createdAt = -1;
  else if (sort === "price-asc") sortCondition.finalPrice = 1;
  else if (sort === "price-desc") sortCondition.finalPrice = -1;
  else if (sort === "name-asc") sortCondition.name = 1;
  else if (sort === "name-desc") sortCondition.name = -1;
  else if (sort === "sold-desc") sortCondition.soldCount = -1;
  else if (sort === "sold-asc") sortCondition.soldCount = 1;
  else if (sort === "view-desc") sortCondition.viewCount = -1;
  else if (sort === "view-asc") sortCondition.viewCount = 1;

  // Find products in the database based on the 'query', populate the 'category' field, and apply the 'sortCondition'.
  const productsRaw = await Product.find(query).populate("category").sort(sortCondition).collation({ locale: "fa", strength: 2 });;

  // Map over the raw product data
  const products = productsRaw.map((product) => ({
    _id: product._id,
    imageUrls: product.imageUrls,
    name: product.name,
    author: product.author,
    price: product.price,
    discountPrice: product.discountPrice,
    category: product.category,
    award: product.award,
    fileUrls: product.fileUrls,
    types: product.types,
    tags: product.tags,
    active: product.active,
  }));

  return new Response(JSON.stringify(products), { status: 200 });
}

// Create a new product
export async function POST(request) {
  try {
    const data = await request.formData();
    console.log("data:", data)
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
    let finalPrice = 0;

    // Validate name, author, description, and price
    if (!name || name.trim() === "") {
      return new Response(JSON.stringify({ message: "نام محصول الزامی است" }), { status: 400 });
    }
    const nameRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,30}$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json({message : "نام میتواند شامل حروف ، اعداد و فاصله باشد"} , {status : 400})
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
    const uploadDirFile = join(process.cwd(), "uploads/private/files");

    if (!existsSync(uploadDirFile)) {
                mkdirSync(uploadDirFile, { recursive: true });
              }


    const uploadDirImage = join(process.cwd(), "public/uploads/images");

    // Save files and images to disk
    const fileUrls = [];
    const imageUrls = [];


    // Function to generate a unique file name based on the current timestamp
    const generateUniqueFileName = (originalName) => {
      const extname = originalName.slice(originalName.lastIndexOf('.')); 
      const basename = originalName.slice(0, originalName.lastIndexOf('.')); 
      const timestamp = Date.now(); 
      return `${basename}-${timestamp}${extname}`; 
    };

    for (const file of files) {
      const bytesFile = await file.arrayBuffer();
      const bufferFile = Buffer.from(bytesFile);
      const uniqueFileName = generateUniqueFileName(file.name);
      const filePath = join(uploadDirFile, uniqueFileName);
      await writeFile(filePath, bufferFile);
      fileUrls.push(`uploads/private/files/${uniqueFileName}`);
    }

    for (const image of images) {
      const bytesImage = await image.arrayBuffer();
      const bufferImage = Buffer.from(bytesImage);
      const uniqueImageName = generateUniqueFileName(image.name);
      const imagePath = join(uploadDirImage, uniqueImageName);
      await writeFile(imagePath, bufferImage);
      imageUrls.push(`/uploads/images/${uniqueImageName}`);
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
      finalPrice,
      category,
      types,
      tags,
      active,
      free,
      award,
      soldCount: 0,
    };

    if (!free && discountPrice === undefined) {
      productData.finalPrice = price;
    };
    
    if (!free && discountPrice !== undefined) {
      productData.discountPrice = discountPrice;
      productData.finalPrice = discountPrice;
    };
 
console.log(productData);

    const product = await Product.create(productData);

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error("Error saving product:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
