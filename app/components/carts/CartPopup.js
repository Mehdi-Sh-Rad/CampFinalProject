"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

export default function CartPopup() {
  const { cart, removeFromCart, updatingItem, toggleCartPopup } = useCart();

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-[300px] min-w-[300px] max-w-full max-h-96 overflow-y-auto overflow-x-hidden ml-12">
      {cart.items.length === 0 ? (
        <div className="p-6 text-center text-gray-600 text-base">
          سبد خرید شما خالی است
        </div>
      ) : (
        <>
          <div className="p-6">
            {cart.items.map((item) => (
              <div
                key={item.product?._id}
                className="flex items-center gap-4 p-3 border-b border-gray-200"
              >
                {item.product?.imageUrls?.[0] ? (
                  <div className="relative w-[60px] h-[80px] flex-shrink-0">
                    <Image
                      src={item.product.imageUrls[0]}
                      alt={item.product.name || "محصول"}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-[60px] h-[80px] bg-gray-200 flex items-center justify-center rounded flex-shrink-0">
                    <span className="text-gray-500 text-sm">تصویر موجود نیست</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-dark truncate">
                    {item.product?.name || "محصول بدون نام"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.quantity} ×{" "}
                    {item.product?.discountPrice
                      ? item.product.discountPrice.toLocaleString()
                      : item.product?.price?.toLocaleString() || 0}{" "}
                    تومان
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  disabled={updatingItem === item.product._id}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 flex-shrink-0"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-200">
            <Link
              href="/cart"
              onClick={() => toggleCartPopup()} 
              className="block w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-all text-center text-base"
            >
              مشاهده سبد خرید
            </Link>
          </div>
        </>
      )}
    </div>
  );
}