"use client";

import AuthWrapper from "@/app/components/auth/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products");

        if (!response.ok) throw new Error("مشکل در دریافت محصولات ");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      setError("مشکلی در حذف پیش آمد");
    }
  };
  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold  text-xl md:text-3xl">محصولات</h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">محصولات سایت را از این بخش مدیریت کنید.</span>
          <Link
            href={"/admin/products/add"}
            className="z-10 flex gap-x-2 justify-center items-center absolute left-10 bottom-16 bg-white py-2 px-4 rounded text-gray-600 shadow-lg dark:bg-shop-dark dark:text-shop-bg">
            افزودن محصول جدید
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
                      <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                        <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                          <tr>
                          <th scope="col" className=" px-4 py-4">
                              #
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              نام
                            </th>
                            <th scope="col" className=" px-4 py-4">
                            نویسنده
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              دسته بندی
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              فرمت
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              تصویر
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              قیمت
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              وضعیت
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              عملیات
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
                            <th scope="col" className=" px-4 py-4">
                              #
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              نام
                            </th>
                            <th scope="col" className=" px-4 py-4">
                            نویسنده
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              دسته بندی
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              فرمت
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              تصویر
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              قیمت
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              وضعیت
                            </th>
                            <th scope="col" className=" px-4 py-4">
                              عملیات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {products &&
                            products.map((product, index) => {
                              return (
                                <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                                  <td className="whitespace-nowrap  px-4 py-4 font-medium">{index + 1}</td>
                                  <td className="whitespace-nowrap  px-4 py-4">{product.name}</td>
                                  <td className="whitespace-nowrap  px-4 py-4">{product.author}</td>
                                  <td className="whitespace-nowrap  px-4 py-4">{product.category?.name || "بدون دسته بندی"}</td>
                                  <td className="whitespace-nowrap  px-4 py-4">{product.types.map(tp => ` ${tp}`)}</td>
                                  <td className="whitespace-nowrap  px-4 py-4">
                                    <Image src={product.imageUrls?.[0] || "/uploads/logo2.webp"} width={100} height={100} alt={product.name || "product image"} />
                                  </td>
                                  <td className="whitespace-nowrap  px-4 py-4">{product.price.toLocaleString("fa-IR")} تومان</td>
                                  <td className="whitespace-nowrap  px-4 py-4">{product.active ? "فعال" : "غیرفعال"}</td>
                                  <td className="whitespace-nowrap  px-4 py-4">
                                    <div className="flex justify-center gap-x-2">
                                      <Link href={`/admin/products/${product._id}`}>
                                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                          <path
                                            d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M15.1655 4.60254L19.7315 9.16854"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </Link>
                                      <button onClick={() => handleDelete(product._id)}>
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
    </AuthWrapper>
  );
};

export default Products;
