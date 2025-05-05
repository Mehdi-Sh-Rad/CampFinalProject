import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    let cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
      await cart.save();
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در سبد خرید رخ داده است" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "اطلاعات ورودی ناقص است" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "محصول مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find((item) => {
      return item.product.toString() === productId;
    });

    if (!existingItem) {
      // Add the product to the cart if it doesn't already exist
      cart.items.push({ product: productId });
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در افزودن سبد خرید رخ داده است" },
      { status: 500 }
    );
  }
};


export async function DELETE(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "اطلاعات ورودی ناقص است" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter((item) => {
      return item.product.toString() !== productId;
    });

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در حذف محصول از سبد خرید رخ داده است" },
      { status: 500 }
    );
  }
}
