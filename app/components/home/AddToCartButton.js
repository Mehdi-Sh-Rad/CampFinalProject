"use client";
import { useCart } from "@/app/context/CartContext";
import React, { useEffect, useState } from "react";

const AddToCartButton = ({ productId }) => {
  const { addToCart, error , clearError } = useCart();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleAddToCart = async () => {
    console.log("beffer",error)
    setLoading(true);
    console.log( "after", error)
    setLocalError(null);

    await addToCart(productId, 1);

    if (error) {
      setLocalError(error);
    }

    setLoading(false);
  };

  return (
    <section className="">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-purple-500 text-white px-10 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
      >
        {loading ? "در حال افزودن..." : "افزودن به سبد خرید"}
      </button>

      {localError && <p className="text-red-500 text-sm mt-3">{localError}</p>}
    </section>
  );
};

export default AddToCartButton;
