import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Header from "../../components/home/Header";
import Benefits from "../../components/home/Benefits";
import Footer from "../../components/home/Footer";
import ProductCard from "@/app/components/ProductCard";

export default async function AwardsProductsPage() {
  await connectToDatabase();

  const productsRaw = await Product.find({ tags: "awards" });

  const products = productsRaw.map(product => ({
    _id: product._id,
    imageUrls: product.imageUrls,
    name: product.name,
    author: product.author,
    price: product.price,
    discountPrice: product.discountPrice,
  }));

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center p-4 text-red-500">محصولی با تگ جوایز یافت نشد</div>
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
          جوایز و پرفروش‌ها
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <Benefits />
      <Footer />
    </div>
  );
}