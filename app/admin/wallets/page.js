"use client";
import AuthWrapper from "@/app/components/auth/auth";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { getWallets } from "@/app/lib/fetch/Wallets";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      try {
        const data = await getWallets();
        if (!data) throw new Error("مشکل در دریافت کیف پول");
        setWallets(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const formatToPersianDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const persianDate = new DateObject({
      date: date,
      calendar: persian,
      locale: persian_fa,
    });
    return persianDate.format("HH:mm - YYYY/MM/DD");
  };


  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl"> گزارش کیف پول مشتریان</h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">در این قسمت اطلاعات کیف پول مشتریان را مشاهده نمایید</span>

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
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    {loading ? (
                      <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                        <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                          <tr>
                          <th scope="col" className="px-4 py-4">
                              #
                            </th>
                            <th scope="col" className="px-4 py-4">
                              کاربر
                            </th>
                            <th scope="col" className="px-4 py-4">
                              موجودی کیف پول
                            </th>
                            <th scope="col" className="px-4 py-4">
                              تاریخ و ساعت آخرین شارژ / برداشت
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(4)].map((_, index) => (
                            <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                              <td className="whitespace-nowrap px-4 py-4 font-medium">
                                <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                        <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                          <tr>
                            <th scope="col" className="px-4 py-4">
                              #
                            </th>
                            <th scope="col" className="px-4 py-4">
                              کاربر
                            </th>
                            <th scope="col" className="px-4 py-4">
                              موجودی کیف پول
                            </th>
                            <th scope="col" className="px-4 py-4">
                              تاریخ و ساعت آخرین شارژ / برداشت
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {wallets && wallets.map((wallet, index) => (
                            <React.Fragment key={wallet._id}>
                              <tr className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap px-4 py-4 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap px-4 py-4">{wallet.user?.name}</td>
                                <td className="whitespace-nowrap px-4 py-4">{wallet.balance.toLocaleString("fa-IR")}</td>
                                <td className="whitespace-nowrap px-4 py-4">{formatToPersianDate(wallet.updatedAt)}</td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  <div className="flex justify-center gap-x-2"></div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Wallets;