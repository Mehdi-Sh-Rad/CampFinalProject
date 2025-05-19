"use client";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";
import ProductCard from "@/app/components/home/ProductCard";
import ProductsSortSelect from "../components/home/ProductsSortSelect";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsFilter from "../components/home/ProductsFilter";
import { FaSearch } from "react-icons/fa";

// Mapping for sort values to URL and back
const sortToUrlMap = {
  "price-asc": "cheapest",
  "price-desc": "expensive",
  "sold-asc": "least-sold",
  "sold-desc": "most-sold",
  "view-asc": "least-viewed",
  "view-desc": "most-viewed",
  "name-asc": "name-az",
  "name-desc": "name-za",
  "": "",
};

const urlToSortMap = Object.fromEntries(Object.entries(sortToUrlMap).map(([key, value]) => [value, key]));

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Convert URL sort param to internal sort value
  const urlSort = searchParams.get("sort") || "";

  // State for selected sorting option and filters
  const [sortState, setSort] = useState(urlToSortMap[urlSort] || "");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    award: searchParams.get("award") === "true",
    free: searchParams.get("free") === "true",
    active: searchParams.get("active") === "true",
    discountPrice: searchParams.get("discountPrice") === "true",
  });

  // Extract filter parameters from URL
  const category = searchParams.get("category");

  // Reset sort and filters on page refresh
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    router.replace(`/products?${params.toString()}`, { scroll: false });
    setSort("");
    setFilters({
      minPrice: "",
      maxPrice: "",
      award: false,
      free: false,
      active: false,
      discountPrice: false,
    });
    setIsInitialLoad(false);
  }, []);

  // Fetch products based on URL parameters
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Set URL parameters based on current filter/sort state
        if (category) params.set("category", category);
        if (sortState) params.set("sort", sortState);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.award) params.set("award", "true");
        if (filters.free) params.set("free", "true");
        if (filters.active) params.set("active", "true");
        if (filters.discountPrice) params.set("discountPrice", "true");

        // Fetch products from API
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, sortState, filters.minPrice, filters.maxPrice, filters.award, filters.free, filters.active, filters.discountPrice]);

  // Handle sort option change
  const handleSortChange = (newSort) => {
    setSort(newSort);

    const params = new URLSearchParams();

    // Reset filters when sorting changes
    if (category) params.set("category", category);
    if (newSort) params.set("sort", sortToUrlMap[newSort]);

    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.award) params.set("award", "true");
    if (filters.free) params.set("free", "true");
    if (filters.active) params.set("active", "true");
    if (filters.discountPrice) params.set("discountPrice", "true");

    // Update URL to reflect new sort
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    // Preserve category
    if (category) params.set("category", category);

    // Preserve sort
    if (sortState) params.set("sort", sortToUrlMap[sortState]);

    // Reset sort when filters are applied
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.award) params.set("award", "true");
    if (newFilters.free) params.set("free", "true");
    if (newFilters.active) params.set("active", "true");
    if (newFilters.discountPrice) params.set("discountPrice", "true");

    // Update URL to apply filters
    router.push(`/products?${params.toString()}`, { scroll: false });
    setSort(""); // Reset sort when filters are applied
  };

  // Reset all filters and sort
  const handleResetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      award: false,
      free: false,
      active: false,
      discountPrice: false,
    });
    setSort("");

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Update filters and sort when URL changes (e.g., from circle menu)
  useEffect(() => {
    if (isInitialLoad) return;
    const newFilters = {
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      award: searchParams.get("award") === "true",
      free: searchParams.get("free") === "true",
      active: searchParams.get("active") === "true",
      discountPrice: searchParams.get("discountPrice") === "true",
    };
    setFilters(newFilters);

    // Update sort from URL
    const newSort = urlToSortMap[searchParams.get("sort") || ""] || "";
    setSort(newSort);

    // Reset sort if filters are applied, unless the sort is part of the circle menu
    // if (newFilters.free || newFilters.discountPrice || newFilters.minPrice || newFilters.maxPrice || newFilters.award || newFilters.active) {
    //   if (!["sold-desc", "view-desc"].includes(newSort)) {
    //     setSort("");
    //   }
    // }
  }, [searchParams, isInitialLoad]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dark mb-8 text-center">همه محصولات</h1>
        <div className="flex flex-col-reverse md:flex-row-reverse items-center md:items-start justify-between gap-4 mb-6">
          <div className="w-full md:w-2/12">
            <ProductsSortSelect sort={sortState} onSortChange={handleSortChange} isFreeFilterActive={filters.free} />
          </div>

          <div className="w-full md:w-10/12 flex flex-col items-end gap-2">
            <ProductsFilter onFilterChange={handleFilterChange} filters={filters} onResetFilters={handleResetFilters} />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-4">در حال بارگذاری...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <FaSearch className="text-gray-400 text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">محصولی یافت نشد</h2>
            <p className="text-gray-500 text-center mb-6">متأسفانه محصولی با این مشخصات پیدا نشد. می‌توانید فیلترها را تغییر دهید یا همه محصولات را مشاهده کنید.</p>
            <button onClick={handleResetFilters} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition">
              مشاهده همه محصولات
            </button>
          </div>
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
