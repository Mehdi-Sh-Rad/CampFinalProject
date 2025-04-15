import connectToDatabase from "@/app/lib/db";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";

export default async function BlogsPage() {
  await connectToDatabase();

  const blogPosts = await BlogPost.find({}).sort({ createdAt: -1 });
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center p-4 text-red-500">مقاله‌ای یافت نشد</div>
        <Benefits />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dark mb-8 text-center">
          همه مقالات
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {blogPosts.map((blogPost) => (
            <div
              key={blogPost._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <Link href={`/blogs/${blogPost._id}`}>
                <div className="relative w-full h-48">
                  {blogPost.imageUrl ? (
                    <Image
                      src={blogPost.imageUrl}
                      alt={blogPost.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500">تصویر موجود نیست</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/blogs/${blogPost._id}`}>
                  <h2 className="text-lg font-semibold text-dark mb-2 hover:text-primary transition-colors">
                    {blogPost.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {blogPost.description}
                </p>
                <Link
                  href={`/blogs/${blogPost._id}`}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-all text-center block"
                >
                  ادامه مطلب
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Benefits />

      <Footer />
    </div>
  );
}
