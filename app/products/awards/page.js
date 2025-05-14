
"use client";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import React, { useEffect, useState } from "react";
import Header from "../../components/home/Header";
import Benefits from "../../components/home/Benefits";
import Footer from "../../components/home/Footer";
import ProductCard from "@/app/components/ProductCard";

const AwardsProductsPage = () => {
  const [awardProducts, setWardProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/products?award=true");
          if (!response.ok) throw new Error("مشکل در دریافت کدهای تخفیف");
          const data = await response.json();
          setWardProducts(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }, []);

  if (!awardProducts || awardProducts.length === 0) {
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

export default AwardsProductsPage;