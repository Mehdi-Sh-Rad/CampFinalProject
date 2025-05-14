"use client";

import { getCategory, updateCategory } from "@/app/lib/fetch/Categories";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const UpdateCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch category data by ID on mount
  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const data = await getCategory(id);
        if (!data) {
          setError(data.message || "خطا در دریافت داده");
          setLoading(false);
          return;
        }

        setName(data.name || "");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  // Validate form input
  const validateForm = () => {
    if (name.trim() === "") {
      setFormError("نام دسته بندی الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام دستع بندی باید بین ۳ تا ۳۰ باشد");
      return false;
    }
    setFormError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = updateCategory(id, { name });
      if (!response) throw new Error("مشکلی در ویرایش دسته بندی پیش آمده است");
      router.push("/admin/categories");

    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh] bg-shop-bg dark:bg-[#171a26]">
        <div className="bg-white dark:bg-shop-dark rounded-lg p-6 shadow-xl shadow-[#112692]/5 flex flex-col items-center gap-y-4">
          <Image src="/logo-min.png" width={50} height={50} alt="logo" />
          <h3 className="text-shop-red dark:text-gray-200 flex gap-x-2 items-center border border-shop-red/30 rounded py-2 px-4">
            <svg
              className="dark:text-shop-red"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 10.5378C8 9.43327 8.89543 8.53784 10 8.53784H11.3333C12.4379 8.53784 13.3333 9.43327 13.3333 10.5378V19.8285C13.3333 20.9331 14.2288 21.8285 15.3333 21.8285H16C16 21.8285 12.7624 23.323 10.6667 22.9361C10.1372 22.8384 9.52234 22.5913 9.01654 22.3553C8.37357 22.0553 8 21.3927 8 20.6832V10.5378Z"
                fill="currentColor"
              />
              <path
                d="M13 3.5C13 2.11929 11.8807 1 10.5 1C9.11929 1 8 2.11929 8 3.5C8 4.88071 9.11929 6 10.5 6C11.8807 6 13 4.88071 13 3.5Z"
                fill="currentColor"
              />
            </svg>
            {error}
          </h3>
          <button
            onClick={() => router.back()}
            className="bg-shop-red text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-shop-red transition-all duration-300"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">ویرایش دسته بندی </h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت دسته بندی محصول را ویرایش کنید.</span>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header.png"}
          alt="هدر"
          width={1663}
          height={277}
        />
      </div>
      <div className="container py-4 px-10 -mt-10 z-50 relative">
        <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
          <div className="max-w-[400px] bg-white dark:bg-shop-dark">
            {error && (
              <h3 className="text-shop-red dark:text-gray-200 flex gap-x-2 items-center border border-shop-red/30 rounded py-1 px-2">
                <svg className="dark:text-shop-red" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 10.5378C8 9.43327 8.89543 8.53784 10 8.53784H11.3333C12.4379 8.53784 13.3333 9.43327 13.3333 10.5378V19.8285C13.3333 20.9331 14.2288 21.8285 15.3333 21.8285H16C16 21.8285 12.7624 23.323 10.6667 22.9361C10.1372 22.8384 9.52234 22.5913 9.01654 22.3553C8.37357 22.0553 8 21.3927 8 20.6832V10.5378Z"
                    fill="currentColor"></path>
                  <path
                    d="M13 3.5C13 2.11929 11.8807 1 10.5 1C9.11929 1 8 2.11929 8 3.5C8 4.88071 9.11929 6 10.5 6C11.8807 6 13 4.88071 13 3.5Z"
                    fill="currentColor"></path>
                </svg>
                {error}
              </h3>
            )}
            {formError && <h3>{formError}</h3>}
            <form className="py-4" onSubmit={handleSubmit}>
              <div className="flex flex-col items-start gap-y-4 w-full">
                <input
                  name="name"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`${loading ? "در حال بارگذاری..." : ""}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
