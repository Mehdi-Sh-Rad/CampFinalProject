import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Wallet from "@/models/Wallet";
import User from "@/models/User";

//Show Wallet
export async function GET(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    let wallet = await Wallet.findOne({ user: session.user.id })
    .populate("user")
    .sort({ createdAt: -1 });

    if (!wallet) {
      wallet = new Wallet({ user: session.user.id, balance: 0 });
      await wallet.save();
    }

    return NextResponse.json(wallet);
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در کیف پول رخ داده است" },
      { status: 500 }
    );
  }
};

//Create Wallet
export async function POST(req) {

  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const { amount, type } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "مقدار نامعتبر است" },
        { status: 400 }
      );
    }

    let wallet = await Wallet.findOne({ user: session.user.id });

    if (!wallet) {
      wallet = new Wallet({ user: session.user.id, balance: 0 });
    }

    if (type === "debit") {
      if (wallet.balance < amount) {
        return NextResponse.json(
          { error: "موجودی کافی نیست" },
          { status: 400 }
        );
      }
      wallet.balance -= Number(amount);
    } else if (type === "credit") {
      if (amount < 1000) {
        return NextResponse.json(
          { error: "مقدار شارژ نمی تواند کمتر از 1,000 تومان باشد" },
          { status: 400 }
        );
      }
      wallet.balance += Number(amount);
    };

    wallet.transactionHistory.push({
      amount: Number(amount),
      type: type,
      date: new Date(),
    });

    await wallet.save();

    return NextResponse.json({
      message: "مقدار با موفقیت در کیف پول اعمال شد",
      balance: wallet.balance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در کیف پول رخ داده است" },
      { status: 500 }
    );
  }
}


//Charge Wallet
export async function PUT(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "مقدار نامعتبر است" },
        { status: 400 }
      );
    }

    let wallet = await Wallet.findOne({ user: session.user.id });

    if (!wallet) {
      wallet = new Wallet({ user: session.user.id, balance: 0 });
      await wallet.save();
    }

    wallet.balance += Number(amount);
    wallet.transactionHistory.push({
      amount: Number(amount),
      type: isBlock ? "debit" : "credit",
      date: new Date(),
    });
    await wallet.save();

    return NextResponse.json({
      message: "مقدار با موفقیت به کیف پول اضافه شد",
      balance: wallet.balance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در کیف پول رخ داده است" },
      { status: 500 }
    );
  }
}

//Withdraw from Wallet
export async function DELETE(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "مقدار نامعتبر است" },
        { status: 400 }
      );
    }

    let wallet = await Wallet.findOne({ user: session.user.id });

    if (!wallet) {
      return NextResponse.json(
        { error: "کیف پول شما وجود ندارد" },
        { status: 404 }
      );
    }

    if (wallet.balance < amount) {
      return NextResponse.json(
        { error: "موجودی کافی نیست" },
        { status: 400 }
      );
    }

    wallet.balance -= amount;
    await wallet.save();

    return NextResponse.json({
      message: "مقدار با موفقیت از کیف پول کسر شد",
      balance: wallet.balance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در کیف پول رخ داده است" },
      { status: 500 }
    );
  }
}
