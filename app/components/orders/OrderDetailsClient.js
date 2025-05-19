"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OrderDetailsClient({ id }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Extract filename from file URL
  function extractFilename(url) {
    return url.split("/").pop();
  }

  // Handle file download with signature
  async function handleDownload(filename) {
    try {
      // Get signature and timestamp
      const res = await fetch(`/api/download/generate-download-signature?filename=${encodeURIComponent(filename)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در دریافت امضا");
      }

      const { signature, timestamp } = await res.json();

      if (!signature || !timestamp) {
        throw new Error("امضا یا زمان‌بندی نامعتبر است");
      }

      // Construct download URL with signature and timestamp
      const downloadUrl = `/api/download/file/${encodeURIComponent(filename)}?signature=${encodeURIComponent(signature)}&timestamp=${timestamp}`;
      window.location.href = downloadUrl;
    } catch (error) {
      setError(error.message || "خطا در دانلود فایل");
    }
  }

  // Fetch order details on component mount
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "مشکل در دریافت سفارش");
          return;
        }

        const { order } = await res.json();

        setOrder(order);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  // Show error or loading state
  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <p>در حال بارگیری سفارش...</p>;

  // Render order details and download links
  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold  text-xl md:text-3xl">جزئیات سفارش #{order.orderCode}</h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base"> لیست اقلام، قیمت‌ها و فایل‌های سفارش شما</span>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header.png"}
          alt="هدر"
          width={1663}
          height={277}
        />
      </div>
      <div className="container py-4 px-10 -mt-10 z-50 relative">
        <div className="bg-white py-10 px-10 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
          <div className="bg-white dark:bg-shop-dark grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.items.map((item, index) => {
              const prod = item.product || {};
              const files = prod.fileUrls || [];
              return (
                <div key={index} className="bg-white dark:bg-[#1f2430] rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
                  <div className="w-full h-56 relative">
                    <Image src={prod.imageUrls[0] || "/placeholder.png"} alt={prod.name} fill className="object-fill" />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-1 dark:text-gray-200">{prod.name}</h2>
                    <p className="text-green-600 mb-3">{prod.finalPrice.toLocaleString()} تومان</p>

                    {files.length > 0 && (
                      <div className="mt-3">
                        <h3 className="font-medium text-sm mb-1 dark:text-gray-200">فایل‌های محصول:</h3>
                        <ul className="list-disc list-inside dark:text-white space-y-1">
                          {files.map((fileUrl, index) => (
                            <li key={index}>
                              <button onClick={() => handleDownload(extractFilename(fileUrl))} className="text-blue-500 hover:underline focus:outline-none">
                                {`دانلود فایل ${index + 1}`}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
