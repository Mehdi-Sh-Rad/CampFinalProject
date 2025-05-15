"use client";
import { getComment } from "@/app/lib/fetch/Comments";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch comments of the user
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComment()

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
                          <th scope="col" className=" px-4 py-4">
                            محصول
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            نظر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            وضعیت
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(4)].map((_, index) => (
                          <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap px-1 py-4 font-medium">
                              <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                            </td>
                            <td className="whitespace-nowrap px-2 py-4">
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
                    // Render comments table
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-2 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-4 py-4">
                            محصول
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            نظر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            وضعیت
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comments &&
                          comments.map((comment, index) => {
                            return (
                              <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap  px-2 py-4 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap  px-4 py-4">{comment.product?.name || "not available"}</td>
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
                                <td className="whitespace-nowrap  px-6 py-4">{comment.status ? "تایید" : "تایید نشده"}</td>                           
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
