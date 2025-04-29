"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductQuestions = () => {
  const [productQuestions, setProductQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch product questions on component mount
  useEffect(() => {
    setLoading(true);
    const fetchProductQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/productQuestions?user=true");

        if (!response.ok) throw new Error(" مشکل در دریافت اطلاعات نظرات");
        const data = await response.json();
        setProductQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductQuestions();
  }, []);

  //Delete product question by ID
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/productQuestions/${id}`, { method: "DELETE" });
      setProductQuestions(productQuestions.filter((productQuestion) => productQuestion._id !== id));
    } catch (error) {
      setError("مشکلی در حذف پیش آمد");
    }
  };
  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">سوالات در مورد محصول</h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base"> سوالات مربوط به محصولات را مدیریت کنید</span>
        <Link
          href={"/user/productQuestions/add"}
          as={"/user/productQuestions/add"}
          className="z-10 flex gap-x-2 justify-center items-center absolute left-10 bottom-16 bg-white py-2 px-4 rounded text-gray-600 shadow-lg dark:bg-shop-dark dark:text-shop-bg">
          افزودن سوال جدید
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </Link>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header.png"}
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
                    // Render skeleton rows during loading
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-2 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-2 py-4">
                            محصول
                          </th>
                          <th scope="col" className=" px-2 py-4">
                            سوال
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            پاسخ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(4)].map((_, index) => (
                          <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap px-2 py-4 font-medium">
                              <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                            <td className="whitespace-nowrap px-2 py-4">
                              <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                            <td className="whitespace-nowrap px-2 py-4">
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
                    // Render product questions table
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-2 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-2 py-4">
                            محصول
                          </th>
                          <th scope="col" className=" px-4 py-4">
                            سوال
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            پاسخ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productQuestions &&
                          productQuestions.map((proQuestion, index) => {
                            return (
                              <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap  px-1 py-4 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap  px-2 py-4">{proQuestion.product?.name || "not available"}</td>
                                <td
                                  className="whitespace-nowrap  px-4 py-4"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px",
                                  }}>
                                  {proQuestion.question}
                                </td>
                                <td
                                  className="whitespace-nowrap  px-6 py-4"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px",
                                  }}>
                                  {proQuestion.answer}
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

export default ProductQuestions;
