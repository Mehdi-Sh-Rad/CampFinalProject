import User from '@/models/User';
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
      const user = await User.findById(id).lean();
      if (!user) {
        return new Response(JSON.stringify({ message: 'کاربر یافت نشد' }), { status: 404 });
      }
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      const users = await User.find({}).populate('name').lean();
      return new Response(JSON.stringify(users), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
