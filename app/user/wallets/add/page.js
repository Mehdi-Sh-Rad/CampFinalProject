"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import { useRouter } from "next/navigation";
import Image from "next/image";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const DepositWallets = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [formError, setFormError] = useState(true);
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount == "") {
      setFormError(" مبلغ شارژ صفر می‌باشد");
      return false;
    };

    if (isNaN(amount)) {
      setFormError("مقدار شارژ باید عددی باشد");
      return false;
    };

    if (amount < 1000) {
      setFormError("مقدار شارژ نمی تواند کمتر از 1,000 تومان باشد");
      return false;
    };

    try {
      setLoading(true);
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          type: "credit",
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          const message = await response.json();
          setFormError(message.message);
        } else {
          throw new Error("مشکلی در شارژ کیف پول پیش آمده است");
        }
      } else {
        router.push("/user/wallets");
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">
            افزودن رکورد پرداخت جدید
          </h1>
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
                  مبلغ شارژ کیف پول
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                مبلغ انتخابی شما: {amount ? Number(amount).toLocaleString("fa-IR") : "۰"} تومان
              </div>

              <div>
                <button type="submit" className="bg-green-500 text-white ml-3 py-2 px-4 rounded">
                  ارسال به درگاه پرداخت
                </button>
                <Link href={"/user/wallets"} className="bg-red-700 text-white py-2 px-4 rounded">
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

export default DepositWallets;
