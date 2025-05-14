"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], discountPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false); 
  const [updatingItem, setUpdatingItem] = useState(null);

  const showPopup = (message) => {
    setPopupMessage(message);
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
  };

  const toggleCartPopup = () => {
    setIsCartPopupVisible((prev) => !prev);
  };

  useEffect(() => {
    let timer;
    if (isCartPopupVisible) {
      timer = setTimeout(() => {
        setIsCartPopupVisible(false);
      }, 5000); 
    }
    return () => clearTimeout(timer); 
  }, [isCartPopupVisible]);

  useEffect(() => {
    async function fetchCart() {
      try {
        setLoading(true);
        const res = await fetch("/api/cart");
        if (!res.ok) {
          setCart({ items: [], discountPrice: 0 });
          return;
        }

        const data = await res.json();
        setCart(data && data.items ? data : { items: [], discountPrice: 0 });
      } catch (error) {
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
      const existingItem = cart.items.find((item) => item.product._id === productId);
      if (existingItem) {
        return { success: false, message: "این محصول به سبد خرید شما اضافه شده است" };
      }

      setUpdatingItem(productId);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "مشکلی در اضافه کردن به سبد خرید پیش آمده است" };
      }

      await updateCart();
      showPopup("محصول با موفقیت به سبد خرید اضافه شد!");
      setIsCartPopupVisible(true); 
      return { success: true };
    } catch (error) {
      return { success: false, message: "مشکلی در اضافه کردن به سبد خرید پیش آمده است" };
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
        return { success: false, message: errorData.message || "مشکلی در حذف محصول پیش آمده است" };
      }

      await updateCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: "مشکلی در حذف محصول پیش آمده است" };
    } finally {
      setUpdatingItem(null);
    }
  }

  function clearCart() {
    setCart({ items: [], discountPrice: 0 });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        updatingItem,
        addToCart,
        removeFromCart,
        clearCart,
        showPopup,
        isPopupVisible,
        popupMessage,
        isCartPopupVisible,
        setIsCartPopupVisible,
        toggleCartPopup,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}