"use client";
import { useCart } from "@/app/context/CartContext";
import React, { useEffect, useState } from "react";

const AddToCartButton = ({ productId }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setLocalError(null);

      const result = await addToCart(productId, 1);
      if (!result.success) {
        setLocalError(result.message);
      }
    } catch (err) {
      setLocalError("مشکلی در افزودن به سبد خرید پیش آمد");
    } finally {
      setLoading(false);
    }
  };

  // پاک کردن خطا بعد از 3 ثانیه
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <section className="flex justify-center items-center flex-col">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-[#7B61FF] text-white px-10 py-3 rounded-lg hover:bg-[#4BC0D9] transition-all shadow-md hover:shadow-lg"
      >
        {loading ? "در حال افزودن..." : "افزودن به سبد خرید"}
      </button>

      {localError && <p className="text-red-500 text-sm mt-3">{localError}</p>}
    </section>
  );
};

export default AddToCartButton;