"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], discountPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/cart");
        if (!res.ok) {
          setError("لطفا وارد حساب کاربری خود شوید");
          setCart({ items: [], discountPrice: 0 });
          return;
        }

        const data = await res.json();
        setCart(data && data.items ? data : { items: [], discountPrice: 0 });
      } catch (error) {
        setError(error);
        setCart({ items: [], discountPrice: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  async function updateCart() {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.log("خطا در بروز رسانی", error.message);
    }
  }

  async function addToCart(productId, quantity = 1) {

    try {    
      // Check if the product already exists in the cart
      const existingItem = cart.items.find((item) => item.product._id === productId);
      if (existingItem) {
        setError("این محصول به سبد خرید شما اضافه شده است");
        return; // Exit the function if the product is already in the cart
      }

      setUpdatingItem(productId);
      setError(null);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(
          errorData.message || "مشکلی در اضافه کردن به سبد خرید پیش آمده است"
        );
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در اضافه کردن به سبد خرید پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function removeFromCart(productId) {
    try {
      setUpdatingItem(productId);
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در حذف محصول پیش آمده است");
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در حذف محصول پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  function clearCart() {
    setCart({ items: [], discountPrice: 0 });
  }

  function clearError() {
    setError(null);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        error,
        loading,
        updatingItem,
        addToCart,
        removeFromCart,
        clearCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
