"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const EditDiscount = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Fetch discount data by ID on mount
  useEffect(() => {
    const fetchDiscountData = async () => {
      setLoading(true);
      console.log("Fetching discount with id:", id);
      try {
        const response = await fetch(`/api/discounts?id=${id}`);
        const discount = await response.json();
        console.log("API Response status:", response.status);
        if (!response.ok) {
          setError(discount.message || "خطا در دریافت داده");
          setLoading(false);
          return;
        }
       
        if (discount.message) {
          throw new Error(discount.message);
        }
        setCode(discount.code || "");
        setPercentage(discount.percentage || "");
        setExpirationDate(
          discount.date
            ? new DateObject({
                date: new Date(discount.date),
                calendar: persian,
                locale: persian_fa,
              })
            : null
        );
        setStatus(discount.status !== undefined ? discount.status : true);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDiscountData();
  }, [id]);

  // Validate form inputs
  const validateForm = () => {

    if (percentage && (percentage < 1 || percentage > 100)) {
      setFormError("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد");
      return false;
    }
    if (!expirationDate) {
      setFormError("تاریخ انقضا الزامی است");
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
      const response = await fetch(`/api/discounts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          code,
          percentage: percentage || undefined,
          date: expirationDate ? expirationDate.toDate().toISOString() : undefined,
          status,
        }),
      });

      if (response.status === 400) {
        const message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در به‌روزرسانی کد تخفیف پیش آمد");
      router.push("/admin/discounts");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }


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
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">ویرایش کد تخفیف</h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت کد تخفیف را ویرایش کنید.</span>
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
            {formError && <div className="text-red-500 text-center">{formError}</div>}
            {error && <div className="text-red-500 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">کد تخفیف</label>
                <input
                  type="text"
                  value={code}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="کد تخفیف"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">محصول</label>
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">درصد تخفیف</label>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="درصد تخفیف"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">تاریخ انقضا</label>
                <DatePicker
                  value={expirationDate}
                  onChange={setExpirationDate}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  minDate={new Date()}
                  multiple={false}
                  className="w-full"
                  inputClass="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  containerClassName="w-full"
                  placeholder="تاریخ انقضا"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">وضعیت</label>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} className="w-4 h-4 m-1" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">فعال</span>
                </div>
              </div>
              <div>
                <button type="submit" className="bg-green-500 text-white ml-3 py-2 px-4 rounded">
                  ذخیره تغییرات
                </button>
                <Link href={"/admin/discounts"} className="bg-red-700 text-white py-2 px-4 rounded">
                  انصراف
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default EditDiscount;
