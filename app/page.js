"use client";
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import Header from "./components/home/Header";
import Banner from "./components/home/Banner";
import Product from "./components/home/Product"
import NewBlogs from "./components/home/NewBlogs";
import Categories from "./components/home/Categories";
import Benefits from "./components/home/Benefits";
import AwardsSection from "./components/home/AwardsSection";
import Footer from "./components/home/Footer";
import Loading from "./loading";
import { getCategories } from "./lib/fetch/Categories";
import { getProducts } from "./lib/fetch/Products";
import { getBanners } from "./lib/fetch/Banners";
import { getBlogs } from "./lib/fetch/Blogs";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [newBlogs, setNewBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [awards, setAwards] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState({
    banners: true,
    BestSellers: true,
    newBlogs: true,
    categories: true,
    awards: true,
  });
  const [errors, setErrors] = useState({
    banners: null,
    BestSellers: null,
    newBlogs: null,
    categories: null,
    awards: null,
  });

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        if (!data) {
          const errorData = await res.text();
          throw new Error(errorData);
        }

        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setErrors((prev) => ({ ...prev, banners: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, banners: false }));
      }
    };
    fetchBanners();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();

        if (!data) throw new Error("مشکل در دریافت محصولات ");

        setProducts(data);
      } catch (error) {
        setErrors(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchNewBlogs = async () => {
      try {
        const data = await getBlogs();

        if (!data) {
          const errorData = await res.text();
          throw new Error(errorData);
        }

        setNewBlogs(data);
      } catch (error) {
        console.error("Error fetching new blogs:", error);
        setErrors((prev) => ({ ...prev, newBlogs: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, newBlogs: false }));
      }
    };
    fetchNewBlogs();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        if (!data) {
          const errorData = await res.text();
          throw new Error(errorData, "خطا در دریافت اطلاعات دسته بندی");
        }

        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrors((prev) => ({ ...prev, categories: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // filter award products
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await fetch("/api/products?award=true", {
          credentials: "omit",
        });
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData);
        }
        const data = await res.json();
        setAwards(data);
      } catch (error) {
        console.error("Error fetching awards:", error);
        setErrors((prev) => ({ ...prev, awards: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, awards: false }));
      }
    };
    fetchAwards();
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if any loading state is true
  const isLoading = Object.values(loading).some((value) => value);
  const hasError = Object.values(errors).find((value) => value !== null);

  // Check if any error state is true
  if (hasError) {
    return (
      <div className="text-center p-4 text-red-500">
        خطا: {hasError}
        <ul>
          {Object.entries(errors).map(([key, value]) =>
            value ? (
              <li key={key}>
                {key}: {value}
              </li>
            ) : null
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {isLoading && <Loading />}
      <Header />
      <Banner banners={banners} />
      <Product products={products.slice(0, 4)} totalProducts={products.length} id="new-arrivals" />
      <NewBlogs blogPosts={newBlogs.slice(0, 3)} totalPosts={newBlogs.length} id="new-blogs" />
      <Categories categories={categories.slice(0, 3)} totalCategories={categories.length} id="categories" />
      <AwardsSection awards={awards.slice(0, 4)} totalAwards={awards.length} id="awards-section" />
      <Benefits id="benefits" />
      <Footer />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-all duration-300"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}