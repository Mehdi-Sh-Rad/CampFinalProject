import Discount from '@/models/Discount';
import connectToDatabase from '../../lib/db';

async function connectDB() {
  try {
    await connectToDatabase();
  } catch (error) {
    throw new Error('Failed to connect to database');
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      const discount = await Discount.findById(id).lean();
      if (!discount) {
        return new Response(JSON.stringify({ message: 'کد تخفیف یافت نشد' }), { status: 404 });
      }
      return new Response(JSON.stringify(discount), { status: 200 });
    } else {
      const discounts = await Discount.find({}).populate('category').lean();
      return new Response(JSON.stringify(discounts), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { code, category, percentage, date, status } = await req.json();


    if (!category) {
      return new Response(JSON.stringify({ message: "دسته‌بندی الزامی است" }), { status: 400 });
    }

    // Validate category existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return new Response(JSON.stringify({ message: "دسته‌بندی یافت نشد" }), { status: 400 });
    }

    if (!percentage || isNaN(percentage)) {
      return new Response(JSON.stringify({ message: "درصد تخفیف الزامی و باید عدد باشد" }), {
        status: 400,
      });
    }
    if (percentage < 1 || percentage > 100) {
      return new Response(JSON.stringify({ message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد" }), {
        status: 400,
      });
    }

    if (!date) {
      return new Response(JSON.stringify({ message: "تاریخ انقضا الزامی است" }), { status: 400 });
    }
    
    const currentDate = new Date();
    const expirationDate = new Date(date);

    if (expirationDate <= currentDate) {
      return new Response(JSON.stringify({ message: 'تاریخ انقضا باید بزرگ‌تر از امروز باشد' }), { status: 400 });
    }
    const discount = await Discount.create({ code, category, percentage, date, status });
    return new Response(JSON.stringify(discount.toJSON()), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { id, code, category, percentage, date, status } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: 'ID الزامی است' }), { status: 400 });
    }
    const currentDate = new Date();
    const expirationDate = new Date(date);

    if (expirationDate <= currentDate) {
      return new Response(JSON.stringify({ message: 'تاریخ انقضا باید بزرگ‌تر از امروز باشد' }), { status: 400 });
    }

    const updateData = { code, percentage, date, status };
    if (category) {
      updateData.category = category;
    }
    if (category == "") {
      updateData.category = null;
    }


    const discount = await Discount.findByIdAndUpdate(id, updateData , { new: true, runValidators: true });
    if (!discount) {
      return new Response(JSON.stringify({ message: 'کد تخفیف یافت نشد' }), { status: 404 });
    }
    return new Response(JSON.stringify(discount.toJSON()), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ message: 'ID is required' }), { status: 400 });
    }
    await Discount.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'کد تخفیف حذف شد' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}