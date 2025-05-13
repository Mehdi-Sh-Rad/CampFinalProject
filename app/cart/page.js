"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowUp, FaTrashAlt } from "react-icons/fa";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";
import EmptyCart from "../components/carts/EmptyCart";
import Loading from "../loading";

export default function Cart() {
  const { cart, removeFromCart, loading, error } = useCart(); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (cart && cart.items) {
      const calculatedTotalPrice = cart.items.reduce(
        (total, item) => total + (item.product.finalPrice || 0) * item.quantity,
        0
      );
      setTotalPrice(calculatedTotalPrice);
    }
  }, [cart?.items]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="bg-[#F0EBFF] min-h-screen">
        <Header />
        <Loading />
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-[#F0EBFF] min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6">
          <h4 className="text-center bg-[#4BC0D9]/10 py-3 rounded-lg text-lg font-semibold text-[#1B1F3B]">
            سبد خرید
          </h4>
        </section>
        {error && (
          <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg mb-6">
            {error}
          </div>
        )}
        <section className="flex flex-col lg:flex-row gap-6">
          <section className="lg:w-2/3">
            {cart.items.map((item) => (
              <section
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                key={item.product?._id || item._id}
              >
                <section className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="w-20 h-20 flex-shrink-0">
                    {item.product?.imageUrls ? (
                      <Image
                        src={item.product.imageUrls[0]}
                        className="rounded-lg object-cover"
                        width={80}
                        height={80}
                        alt={item.product?.name || "محصول"}
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">
                        تصویر موجود نیست
                      </span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-base sm:text-lg font-semibold text-[#1B1F3B]">
                      {item.product?.name || "محصول نامشخص"}
                    </p>
                    <p className="text-sm text-gray-600">
                      تعداد: {item.quantity}
                    </p>
                  </div>
                </section>
                <section className="flex items-center justify-between w-full sm:w-auto">
                  <p className="text-base sm:text-lg font-bold text-[#1B1F3B]">
                    {item.product.finalPrice
                      ? `${(
                          item.product.finalPrice * item.quantity
                        ).toLocaleString()} تومان`
                      : "رایگان"}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product?._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </section>
              </section>
            ))}
          </section>

          <section className="lg:w-1/3">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h5 className="text-lg font-semibold text-[#1B1F3B] mb-4">
                جمع‌بندی سبد خرید
              </h5>
              <section className="flex justify-between items-center mb-3">
                <p className="text-gray-600 text-sm sm:text-base">
                  قیمت کالاها ({cart.items.length})
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {totalPrice.toLocaleString()} تومان
                </p>
              </section>
              <section className="flex justify-between items-center text-lg font-bold text-[#1B1F3B]">
                <p>جمع کل</p>
                <p>{totalPrice.toLocaleString()} تومان</p>
              </section>
              <section className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-[#7B61FF] hover:bg-[#6A50E6] text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-200"
                >
                  تکمیل فرآیند خرید
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-[#1B1F3B] hover:bg-[#14162E] text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-200"
                >
                  بازگشت به فروشگاه
                </Link>
              </section>
            </section>
          </section>
        </section>
      </main>
      <Benefits id="benefits" />
      <Footer />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-[#7B61FF] text-white p-3 rounded-full shadow-lg hover:bg-[#6A50E6] transition-all duration-300"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}