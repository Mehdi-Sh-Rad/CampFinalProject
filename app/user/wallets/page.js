"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { getWallet } from "@/app/lib/fetch/Wallets";
import Loading from "@/app/loading";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// Fetch the wallet data
  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      try {
        const data = await getWallet();
        if (!data) throw new Error("مشکل در دریافت اطلاعات کیف پول");
  
        // Sort the transactionHistory array by date in descending order
        if (data.transactionHistory && Array.isArray(data.transactionHistory)) {
          data.transactionHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        }  
        setWallets([data]); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  // Check if there is any wallets
  useEffect(() => {
    if (wallets.length === 0) {
      setError("کیف پولی وجود ندارد");
    } else {
      setError(null);
    }
  }, [wallets]);

  // Format the date to Persian date
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
        {loading && <Loading />}
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl"> مشاهده کیف پول </h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">در این قسمت می توانید مانده و گردش های کیف پول خود را مشاهده نمایید</span>
          <Link
            href="/user/wallets/add"
            className="z-10 flex gap-x-2 justify-center items-center absolute left-10 bottom-16 bg-white py-2 px-4 rounded text-gray-600 shadow-lg dark:bg-shop-dark dark:text-shop-bg"
          >
            شارژ کیف پول
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
          <Image
            className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
            src="/uploads/top-header-user.png"
            alt="هدر"
            width={1663}
            height={277}
          />
        </div>
        <div className="container py-4 px-10 -mt-10 z-30 relative">
          {wallets.map((wal, indx) => (
            <span key={wal._id + 1} className="bg-slate-200 rounded-xl p-4 mx-3 m-1"> موجودی کیف پول شما: {wal.balance.toLocaleString("fa-IR")} تومان </span>
          ))}
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
                              تراکنش
                            </th><th scope="col" className="px-4 py-4">
                              شارژ / خرید
                            </th>
                            <th scope="col" className="px-4 py-4">
                              تاریخ و ساعت شارژ / خرید
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
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
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
                              تراکنش
                            </th><th scope="col" className="px-4 py-4">
                              شارژ / خرید
                            </th>
                            <th scope="col" className="px-4 py-4">
                              تاریخ و ساعت شارژ / خرید
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {wallets && wallets.map((wallet) => (
                            <React.Fragment key={wallet._id}>
                              {wallet.transactionHistory.map((tr, index) => (
                                <tr key={tr._id}>
                                  <td className="whitespace-nowrap px-4 py-4 font-medium">{index + 1}</td>
                                  <td className="whitespace-nowrap px-4 py-4 font-medium">{tr.amount?.toLocaleString("fa-IR")}</td>
                                  <td className="whitespace-nowrap px-4 py-4 font-medium">{tr.type ==
                                    'credit' ? <p className="text-green-500">شارژ</p> : <p className="text-red-500">خرید</p>}</td>
                                  <td className="whitespace-nowrap px-4 py-4 font-medium">{formatToPersianDate(tr.date)}</td>
                                </tr>
                              ))}
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