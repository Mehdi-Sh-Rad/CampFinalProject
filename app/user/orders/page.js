"use client";
import AuthWrapper from "@/app/components/auth/auth";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/orders?user=true");
        if (!response.ok) throw new Error("مشکل در دریافت کدهای تخفیف");
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl"> گزارش سفارشات ثبت شده مشتریان</h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">در این قسمت اطلاعات سفارشات مشتریان را مشاهده نمایید</span>

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
                              شماره سفارش
                            </th>
                            <th scope="col" className="px-4 py-4">
                              محصول/محصولات سفارشی
                            </th>
                            <th scope="col" className="px-4 py-4">
                              وضعیت
                            </th>
                            <th scope="col" className="px-4 py-4">
                              مبلغ پرداختی
                            </th>
                            <th scope="col" className="px-4 py-4">
                              تاریخ و ساعت
                            </th>
                            <th scope="col" className="px-4 py-4">
                              عملیات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(4)].map((_, index) => (
                            <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                              <td className="whitespace-nowrap px-1 py-4 font-medium">
                                <div className="w-10 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-2 py-4 font-medium">
                                <div className="w-10 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
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
                              شماره سفارش
                            </th>
                            <th scope="col" className="px-4 py-4">
                              محصول/محصولات سفارشی
                            </th>
                            <th scope="col" className="px-4 py-4">
                              وضعیت
                            </th>
                            <th scope="col" className="px-4 py-4">
                              مبلغ پرداختی
                            </th>
                            <th scope="col" className="px-4 py-4">
                              تاریخ و ساعت
                            </th>
                            <th scope="col" className="px-4 py-4">
                              عملیات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders &&
                            orders.map((order, index) => (
                              <React.Fragment key={order._id + 1}>
                                <tr className="border-b border-neutral-200 dark:border-white/10">
                                  <td className="whitespace-nowrap px-1 py-4 font-medium">{index + 1}</td>
                                  <td className="whitespace-nowrap px-2 py-4 font-medium">{order.orderCode}</td>
                                  <td
                                    className="whitespace-nowrap  px-6 py-4"
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "150px",
                                    }}>
                                    {order.items.map((item) => item.product?.name).join(" , ")}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-4">{order.status ? "تایید" : "در انتظار"}</td>
                                  <td className="whitespace-nowrap px-4 py-4">{order.payablePrice > 0 ? order.payablePrice?.toLocaleString("fa-IR") : "رایگان"}</td>
                                  <td className="whitespace-nowrap px-4 py-4">{formatToPersianDate(order.updatedAt)}</td>
                                  <td className="whitespace-nowrap px-4 py-4">
                                    <div className="flex justify-center gap-x-2">
                                      {order.status && (
                                        <Link href={`/user/orders/${order._id}`} className="relative group">
                                          <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M8.92574 16.39H14.3119C14.7178 16.39 15.0545 16.05 15.0545 15.64C15.0545 15.23 14.7178 14.9 14.3119 14.9H8.92574C8.5198 14.9 8.18317 15.23 8.18317 15.64C8.18317 16.05 8.5198 16.39 8.92574 16.39ZM12.2723 9.9H8.92574C8.5198 9.9 8.18317 10.24 8.18317 10.65C8.18317 11.06 8.5198 11.39 8.92574 11.39H12.2723C12.6782 11.39 13.0149 11.06 13.0149 10.65C13.0149 10.24 12.6782 9.9 12.2723 9.9ZM19.3381 9.02561C19.5708 9.02292 19.8242 9.02 20.0545 9.02C20.302 9.02 20.5 9.22 20.5 9.47V17.51C20.5 19.99 18.5099 22 16.0545 22H8.17327C5.59901 22 3.5 19.89 3.5 17.29V6.51C3.5 4.03 5.5 2 7.96535 2H13.2525C13.5099 2 13.7079 2.21 13.7079 2.46V5.68C13.7079 7.51 15.203 9.01 17.0149 9.02C17.4381 9.02 17.8112 9.02316 18.1377 9.02593C18.3917 9.02809 18.6175 9.03 18.8168 9.03C18.9578 9.03 19.1405 9.02789 19.3381 9.02561ZM19.6111 7.566C18.7972 7.569 17.8378 7.566 17.1477 7.559C16.0527 7.559 15.1507 6.648 15.1507 5.542V2.906C15.1507 2.475 15.6685 2.261 15.9646 2.572C16.5004 3.13476 17.2368 3.90834 17.9699 4.67837C18.7009 5.44632 19.4286 6.21074 19.9507 6.759C20.2398 7.062 20.0279 7.565 19.6111 7.566Z"
                                              fill="currentColor"></path>
                                          </svg>
                                          <span className="absolute left-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                            نمایش
                                          </span>
                                        </Link>
                                      )}
                                    </div>
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

export default Orders;
