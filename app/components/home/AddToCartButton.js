"use client";
import { useCart } from "@/app/context/CartContext";
import React, { useState } from "react";

const AddToCartButton = ({ productId }) => {
  const { addToCart, error } = useCart();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleAddToCart = async () => {
    setLoading(true);
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
        className="bg-green-500 text-white px-10 py-3 rounded-lg hover:bg-secondary transition-all shadow-md hover:shadow-lg"
      >
        {loading ? "در حال افزودن..." : "افزودن به سبد خرید"}
      </button>

      {localError && <p className="text-danger mt-3">{localError}</p>}
    </section>
  );
};

export default AddToCartButton;
