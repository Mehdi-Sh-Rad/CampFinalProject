"use client";
import Image from "next/image";
import AuthWrapper from "../components/auth/auth";
import React, { useEffect, useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { secureHeapUsed } from "crypto";



const UserDashboard = () => {

  const [user, setUser] = useState("");
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
    const fetchCurrentUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");

        if (!response.ok) throw new Error("مشکل در دریافت لیست کاربران ");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
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

  const formatToPersianDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const persianDate = new DateObject({
      date: date,
      calendar: persian,
      locale: persian_fa,
    });
    return persianDate.format("YYYY/MM/DD");
  };

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
          {loading && <p>در حال بارگذاری...</p>}
          {<section>
            {user.image && (
              <div className="mt-4 flex justify-center">
                <img src={user.image} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover" />
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {user && (
              <div>
                <div className="bg-white dark:bg-[#171a26] p-6 rounded-lg shadow-md">
                  <p className="pb-3"><strong>نام:</strong> {user.name}</p>
                  <p className="pb-3"><strong>ایمیل:</strong> {user.email}</p>
                  <p className="pb-3"><strong>تلفن:</strong> {user.phone}</p>
                  <p className="pb-2"><strong>تاریخ ثبت نام:</strong> {formatToPersianDate(user.createdAt)}</p>
                </div>
              </div>
            )}
          </section>}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default UserDashboard;