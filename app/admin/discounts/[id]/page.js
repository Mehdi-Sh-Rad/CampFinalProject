"use client";

import AuthWrapper from "@/app/components/auth/auth";
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
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [percentage, setPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError("مشکلی در دریافت دسته بندی ها رخ داده است"));
  }, []);
  useEffect(() => {
    const fetchDiscountData = async () => {
      setLoading(true);
      console.log("Fetching discount with id:", id);
      try {
        const response = await fetch(`/api/discounts?id=${id}`);
        console.log("API Response status:", response.status);
        if (!response.ok) throw new Error("مشکل در دریافت اطلاعات کد تخفیف");
        const discount = await response.json();
        console.log("Discount data:", discount);
        if (discount.message) {
          throw new Error(discount.message);
        }
        setCode(discount.code || "");
        setProduct(discount.product || "");
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

  const validateForm = () => {
    if (percentage && (percentage < 1 || percentage > 100)) {
      setFormError("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد");
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
      const response = await fetch(`/api/discounts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          product,
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
              <select
                name="product"
                autoComplete={product}
                className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                placeholder="انتخاب محصول"
                type="text"
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}>
                <option value="">انتخاب محصول موردنظر</option>
                {products.map((cat) => {
                  return (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  );
                })}
              </select>
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
                  format="YYYY/MM/DD HH:mm"
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
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">فعال</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
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

export default EditDiscount;