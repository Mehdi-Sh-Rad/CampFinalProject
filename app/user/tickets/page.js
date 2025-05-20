"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tickets?user=true");

        if (!response.ok) throw new Error("مشکل در دریافت سوالات متداول");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Handle ticket deletion by ID
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      setTickets(tickets.filter((tick) => tick._id !== id));
    } catch (error) {
      setError("مشکلی در حذف پیش آمد");
    }
  };
  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">مدیریت تیکت ها</h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">در این قسمت تیکت های مشتریان را مدیریت کنید</span>
        <Link
          href={"/user/tickets/add"}
          as={"/user/tickets/add"}
          className="z-10 flex gap-x-2 justify-center items-center absolute left-10 bottom-16 bg-white py-2 px-4 rounded text-gray-600 shadow-lg dark:bg-shop-dark dark:text-shop-bg">
          ثبت تیکت جدید 
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </Link>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header-user.png"}
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
                    // Render skeleton table during loading
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-1 py-1">
                            #
                          </th>
                          <th scope="col" className=" px-1 py-1">
                            موضوع
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            آخرین پیام
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            مشاهده و گفتگو
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(4)].map((_, index) => (
                          <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap px-1 py-1 font-medium">
                              <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                            <td className="whitespace-nowrap px-1 py-1">
                              <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    // Render tickets table
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-1 py-1">
                            #
                          </th>
                          <th scope="col" className=" px-1 py-1">
                            موضوع
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            آخرین پیام
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            مشاهده و گفتگو
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets &&
                          tickets.map((ticket, index) => {
                            return (
                              <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap  px-1 py-1 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap  px-1 py-1">{ticket.topic}</td>
                                <td
                                  className="whitespace-nowrap  px-1 py-4"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px",
                                  }}>
                                  {ticket.message.slice(-1)[0]?.text || "No messages yet"}
                                </td>
                                <td className="whitespace-nowrap  px-6 py-4">
                                  <div className="flex justify-center gap-x-2">
                                    <Link href={`/user/tickets/${ticket._id}`}>
                                      <svg
                                        className="w-6 h-6 text-gray-600 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"
                                        />
                                      </svg>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
  );
};

export default Tickets;
