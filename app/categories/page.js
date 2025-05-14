import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Link from "next/link";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";

export default async function CategoriesPage() {
  await connectToDatabase();

  const categories = await Category.find({});
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center p-4 text-red-500">دسته‌بندی‌ای یافت نشد</div>
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
          همه دسته‌بندی‌ها
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <Link href={`/products?category=${category._id}`}>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-dark mb-2 hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Benefits />
      <Footer />
    </div>
  );
}