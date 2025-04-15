"use client";
import Image from "next/image";
import AuthWrapper from "../components/auth/auth";
import React, { useEffect, useState } from "react";


const UserDashboard = () => {

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [tickets, setTickets] = useState([]);
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth");

        if (!response.ok) throw new Error("مشکل در دریافت لیست کاربران ");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/comments");

        if (!response.ok) throw new Error("مشکل در دریافت لیست نظرات ");
        const data = await response.json();
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tickets");

        if (!response.ok) throw new Error("مشکل در دریافت اطلاعات تیکت ها ");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">
            پنل کاربری
          </h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">
            در این قسمت می توانید نسبت به ویرایش اطلاعات ، مشاهده و پیگیری سفارشات خود استفاده نمایید
          </span>
          <Image
            className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
            src={"/uploads/top-header.png"}
            alt="هدر"
            width={1663}
            height={277}
          />
        </div>
        <div className="container py-4 px-10">
          <h1 className="mb-10">صفحه اصلی</h1>
          {loading && <p>در حال بارگذاری...</p>}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default UserDashboard;