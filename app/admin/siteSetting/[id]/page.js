"use client";

import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

const EditBanner = () => {
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/banners?id=${id}`);
        if (!response.ok) throw new Error("مشکل در دریافت بنر");
        const data = await response.json();
        setBanner(data[0]);
      } catch (error) {
        setError("مشکلی در دریافت بنر پیش آمد. لطفاً دوباره تلاش کنید.");
      }
    };
    if (id) fetchBanner();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("id", id);

    try {
      const response = await fetch("/api/banners", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        router.push("/admin/siteSetting");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "مشکلی در ویرایش بنر پیش آمد. لطفاً دوباره تلاش کنید."
        );
      }
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمد. لطفاً دوباره تلاش کنید.");
    }
  };

  if (!banner) {
    return <div className="text-center py-4">در حال بارگذاری...</div>;
  }

  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">
            ویرایش بنر
          </h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">
            اطلاعات بنر را ویرایش کنید.
          </span>
          <Link
            href="/admin/siteSetting"
            className="z-10 flex gap-x-2 justify-center items-center absolute left-10 bottom-16 bg-white py-2 px-4 rounded text-gray-600 shadow-lg dark:bg-shop-dark dark:text-shop-bg"
          >
            بازگشت به مدیریت
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <Image
            className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
            src="/uploads/top-header.png"
            alt="هدر"
            width={1663}
            height={277}
          />
        </div>
        <div className="container py-4 px-10 -mt-10 z-30 relative">
          <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div>
                <label className="block mb-2 text-sm font-medium">
                  تصویر بنر:
                </label>
                <input
                  type="file"
                  name="image"
                  className="w-full p-2 border rounded-md"
                />
                {banner.image && (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    width={80}
                    height={40}
                    className="mt-2 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">عنوان:</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={banner.title}
                  className="w-full p-2 border rounded-md"
                  placeholder="عنوان بنر"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  زیرعنوان:
                </label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={banner.subtitle}
                  className="w-full p-2 border rounded-md"
                  placeholder="زیرعنوان بنر"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">لینک:</label>
                <input
                  type="text"
                  name="link"
                  defaultValue={banner.link}
                  className="w-full p-2 border rounded-md"
                  placeholder="لینک بنر (اختیاری)"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              >
                ذخیره تغییرات
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default EditBanner;
