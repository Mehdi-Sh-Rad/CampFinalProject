import connectToDatabase from "@/app/lib/db";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

//view all users
export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "لطفا ابتدا وارد حساب شوید" }, { status: 401 });
    }

    const user = await User.findById(session.user.id); // Fetch only the current user's data
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update user information
export async function PUT(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ request, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "لطفا ابتدا وارد حساب شوید" }, { status: 401 });
    }
    const user = await User.findById(session.user.id); // Fetch only the current user's data
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }
    const data = await request.formData();
    const name = data.get("name");

    let image = data.get("image");

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "نام الزامی است" }, { status: 400 });
    }

    const nameRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,30}$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json({ message: "نام نامعتبر است. فقط حروف، اعداد و فاصله مجاز است." }, { status: 400 });
    }

    // Handle images
    if (image && typeof image.name === "string" && image.name.length > 0) {
      if (image instanceof File) {
        // Process new image files
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public/profileImages");
        const filePath = join(uploadDir, image.name);
        await writeFile(filePath, buffer);
        // Set the image URL
        image = `/profileImages/${image.name}`;
      } else {
        console.log("Unexpected image type:", image);
      }

      // Delete old images that are not in the new list
      if (user.image && user.image.length > 0) {
        const oldImage = user.image;

        const oldImagePath = join(process.cwd(), "public", oldImage);
        await unlink(oldImagePath).catch(() => {
          console.log("خطا در حذف تصویر قبلی");
        });
      } else {
        console.log("No old image to delete");
      }
    }

    // Update the user's information
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,

        image: image ? image : "/uploads/profile.png", // Use the new image URL if provided, otherwise keep the old one
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
