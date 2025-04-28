"use client";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";
import ProductCard from "@/app/components/ProductCard";
import ProductsSortSelect from "../components/home/ProductsSortSelect";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsFilter from "../components/home/ProductsFilter";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  // State for selected sorting option
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [loading, setLoading] = useState(true);

  // Extract filter parameters from URL
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const award = searchParams.get("award");
  const free = searchParams.get("free");
  const active = searchParams.get("active");

  // Fetch products based on URL parameters
  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();

        // Set URL parameters based on current filter/sort state
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (award) params.set("award", "true");
        if (free) params.set("free", "true");
        if (active) params.set("active", "true");

        // Fetch products from API
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
      }
      setLoading(false);
    }

    fetchProducts();

    // re-fetch when these change
  }, [category, sort, minPrice, maxPrice, award, free, active]);

  // Handle sort option change
  const handleSortChange = (newSort) => {
    setSort(newSort);

    const params = new URLSearchParams();

    // Persist other filters when sort changes
    if (category) params.set("category", category);
    if (minPrice != null) params.set("minPrice", minPrice);
    if (maxPrice != null) params.set("maxPrice", maxPrice);
    if (award) params.set("award", "true");
    if (free) params.set("free", "true");
    if (active) params.set("active", "true");
    if (newSort) params.set("sort", newSort);

    // Update URL to reflect new sort
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    // Extract filter values
    const { minPrice: minF, maxPrice: maxF, award: aw, free: fr, active: ac } = filters;
    const params = new URLSearchParams();

    // Preserve category and sort
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (minF != null && minF !== "") params.set("minPrice", minF);
    if (maxF != null && maxF !== "") params.set("maxPrice", maxF);
    if (aw) params.set("award", "true");
    if (fr) params.set("free", "true");
    if (ac) params.set("active", "true");

    // Update URL to apply filters
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dark mb-8 text-center">همه محصولات</h1>
        <div className="flex flex-col-reverse md:flex-row-reverse items-center md:items-start justify-between gap-4 mb-6">
          <div className="w-full md:w-2/12" >
            <ProductsSortSelect sort={sort} onSortChange={handleSortChange} />
          </div>

          <div className="w-full md:w-10/12 flex justify-end">
            <ProductsFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-4">در حال بارگذاری...</div>
        ) : products.length === 0 ? (
          <div className="text-center p-4 text-red-500">محصولی یافت نشد</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} showCategory={true} />
            ))}
          </div>
        )}
      </div>
      <Benefits />
      <Footer />
    </div>
  );
}
