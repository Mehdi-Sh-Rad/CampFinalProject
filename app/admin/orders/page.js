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
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/orders");
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

  // Toggle comment status
  const handleStatus = async (id, preStatus) => {
    const newStatus = !Boolean(preStatus);
    setStatus(newStatus);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 400) {
        let message = await response.json();
        setError(message.message);
      }
      if (!response.ok) throw new Error("مشکلی در تغییر وضعیت آمده است");
    } catch (error) {
      setError(error.message);
    }
    setOrders(
      orders.map((order) => {
        if (order._id === id) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

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
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl"> گزارش و تایید سفارشات ثبت شده مشتریان</h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">در این قسمت اطلاعات سفارشات مشتریان را مشاهده و تایید نمایید</span>

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
                              شماره سفارش
                            </th>
                            <th scope="col" className="px-4 py-4">
                              محصول/محصولات سفارشی
                            </th>
                            <th scope="col" className="px-4 py-4">
                              وضعیت
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
                              <td className="whitespace-nowrap px-4 py-4 font-medium">
                                <div className="w-10 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
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
                              کاربر
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
                              تاریخ و ساعت
                            </th>
                            <th scope="col" className="px-4 py-4">
                              عملیات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders && orders.map((order, index) => (
                            <React.Fragment key={order._id}>
                              <tr className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap px-4 py-4 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap px-4 py-4">{order.user?.name}</td>
                                <td className="whitespace-nowrap px-4 py-4">{order.orderCode}</td>
                                <td
                                  className="whitespace-nowrap  px-6 py-4"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px",
                                  }}>
                                  {order.items.map((item) => item.product.name).join(" , ")}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">{order.status ? "تایید" : "در انتظار"}</td>

                                <td className="whitespace-nowrap px-4 py-4">{formatToPersianDate(order.updatedAt)}</td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  <button onClick={() => handleStatus(order._id, order.status)}>
                                    {order.status ? (
                                      <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                                      </svg>

                                    )}
                                  </button>
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

export default Orders;