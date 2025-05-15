"use client";
import { useCart } from "@/app/context/CartContext";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const AddToCartButton = ({ productId }) => {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Check if the user is logged in
  const handleAddToCart = async () => {
    if (!session) {
      return setLocalError("برای افزودن به سبد خرید ثبت نام کنید و یا وارد حساب کاربری خود شوید");
    }
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

  // Set timer for local Error
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <section>
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