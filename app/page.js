"use client";
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import Header from "./components/home/Header";
import Banner from "./components/home/Banner";
import NewArrivals from "./components/home/NewArrivals";
import NewBlogs from "./components/home/NewBlogs";
import Categories from "./components/home/Categories";
import Benefits from "./components/home/Benefits";
import AwardsSection from "./components/home/AwardsSection";
import Footer from "./components/home/Footer";
import Loading from "./loading"

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [newBlogs, setNewBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [awards, setAwards] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState({
    banners: true,
    newArrivals: true,
    newBlogs: true,
    categories: true,
    awards: true,
  });
  const [errors, setErrors] = useState({
    banners: null,
    newArrivals: null,
    newBlogs: null,
    categories: null,
    awards: null,
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners`, {
          credentials: "omit",
        });
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData);
        }
        const data = await res.json();
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

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(`/api/products?type=newArrivals`, {
          credentials: "omit",
        });
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData);
        }
        const data = await res.json();
        setNewArrivals(data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setErrors((prev) => ({ ...prev, newArrivals: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, newArrivals: false }));
      }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const fetchNewBlogs = async () => {
      try {
        const res = await fetch(`/api/blogPosts?type=newBlogs`, {
          credentials: "omit",
        });
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData);
        }
        const data = await res.json();
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`, {
          credentials: "omit",
        });
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData);
        }
        const data = await res.json();
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

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await fetch(`/api/products?type=awards`, {
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

  const isLoading = Object.values(loading).some((value) => value);
  const hasError = Object.values(errors).find((value) => value !== null);

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
      <NewArrivals products={newArrivals.slice(0, 4)} totalProducts={newArrivals.length} id="new-arrivals" />
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