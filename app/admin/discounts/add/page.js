"use client";
import AuthWrapper from "@/app/components/auth/auth";
import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import { useRouter } from "next/navigation";
import Image from "next/image";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const AddDiscount = () => {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [percentage, setPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError("مشکلی در دریافت دسته بندی ها رخ داده است"));
  }, []);
  useEffect(() => {
    generateDiscountCode();
  }, []);


  const generateDiscountCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCode(result);
  };

  const validateForm = () => {
    if (code.trim() === "") {
      setFormError("کد تخفیف الزامی می‌باشد");
      return false;
    }
    if (!product) {
      setFormError("انتخاب محصول مورد نظر الزامی می‌باشد");
      return false;
    }
    if (percentage.trim() === "") {
      setFormError("درصد تخفیف الزامی می‌باشد");
      return false;
    } else if (
      percentage.length < 1 ||
      percentage.length > 3 ||
      percentage < 1 ||
      percentage > 100
    ) {
      setFormError("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد");
      return false;
    }
    if (!expirationDate) {
      setFormError("تاریخ انقضا الزامی می‌باشد");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const isoDate = expirationDate.toDate().toISOString();

      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          product,
          percentage,
          date: isoDate,
          status,
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          const message = await response.json();
          setFormError(message.message);
        } else {
          throw new Error("مشکلی در ساخت کد تخفیف پیش آمده است");
        }
      } else {
        router.push("/admin/discounts");
      }
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">
            افزودن کد تخفیف جدید
          </h1>
          <div className="z-10 absolute right-10 bottom-10">
            <button
              type="button"
              onClick={generateDiscountCode}
              className="flex gap-x-2 justify-center items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              ساخت کد جدید
              <svg
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
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
            {formError && (
              <div className="text-red-500 text-center">{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">
                  کد تخفیف
                </label>
                <input
                  type="text"
                  value={code}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="کد خودکار تولید می‌شود"
                />
              </div>
              <select
                name="product"
                autoComplete="product"
                className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                placeholder="انتخاب محصول"
                type="text"
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}>

                <option value="">انتخاب محصول مورد نظر</option>
                {products.map((cat) => {
                  return (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  );
                })}
              </select>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">
                  درصد تخفیف
                </label>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="... درصد تخفیف"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">
                  تاریخ انقضا
                </label>
                <DatePicker
                  value={expirationDate}
                  onChange={setExpirationDate}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD HH:mm"
                  minDate={new Date()}
                  multiple={false}
                  className="w-full"
                  inputClass="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  containerClassName="w-full"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  فعال
                </span>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                ذخیره
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AddDiscount;
