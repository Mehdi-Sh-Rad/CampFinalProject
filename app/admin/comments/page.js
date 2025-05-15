"use client";

import { getComments } from "@/app/lib/fetch/Comments";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComments();
        if (!data) throw new Error(" مشکل در دریافت اطلاعات نظرات");  
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  //Delete comment by ID
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (error) {
      setError("مشکلی در حذف پیش آمد");
    }
  };

  // Toggle comment status
  const handleStatus = async (id, preStatus) => {
    const newStatus = !Boolean(preStatus);
    setStatus(newStatus);
    try {
      const response = await fetch(`/api/comments/${id}`, {
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
    setComments(
      comments.map((comment) => {
        if (comment._id === id) {
          return { ...comment, status: newStatus };
        }
        return comment;
      })
    );
  };
  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl"> مدیریت نظرات </h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base"> نظرات محصولات را مدیریت کنید.</span>
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
                          <th scope="col" className=" px-6 py-4">
                            کاربر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            محصول
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            نظر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            عملیات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(4)].map((_, index) => (
                          <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap px-2 py-4 font-medium">
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
                              <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    // Render comments table
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-2 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            کاربر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            محصول
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            نظر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            عملیات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comments &&
                          comments.map((comment, index) => {
                            return (
                              <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap  px-2 py-4 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap  px-6 py-4">{comment.user?.name || "not available"}</td>
                                <td className="whitespace-nowrap  px-6 py-4">{comment.product?.name || "not available"}</td>
                                <td
                                  className="whitespace-nowrap  px-6 py-4"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px",
                                  }}>
                                  {comment.text}
                                </td>
                                <td className="whitespace-nowrap  px-6 py-4">
                                  <div className="flex justify-center gap-x-2">
                                    <button onClick={() => handleDelete(comment._id)}>
                                      <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                        <path
                                          d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                          d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </button>
                                    <button onClick={() => handleStatus(comment._id, comment.status)}>
                                      {comment.status ? (
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
                                        <svg
                                          className="w-6 h-6 text-gray-800 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                        </svg>
                                      )}
                                    </button>
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

export default Comments;
