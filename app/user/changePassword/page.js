"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const changePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();


  // Validate form input
  const validateForm = () => {
    if (currentPassword.trim() === "") {
      setFormError("رمز فعلی خود را وارد کنید");
      return false;
    }
    if (newPassword.trim() === "") {
      setFormError("رمز جدید خود را وارد کنید");
      return false;
    }

    if (confirmNewPassword.trim() === "") {
      setFormError("تکرار رمز جدید خود را وارد کنید");
      return false;
    }

    if (newPassword.length < 8) {
      setFormError("رمز انتخابی باید بیش از 8 کاراکتر باشد");
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError("رمز جدید و تکرار آن باهم یکسان نیستند");
      return false;
    }

    setFormError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
        const response = await fetch("/api/auth/change-password" , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({currentPassword , newPassword }),
        })

        const data = await response.json();

        if(!response.ok){
            setFormError(data.message || "خطایی رخ داده است")
        }
        else {
            signOut();
        }

    } catch (error) {
      setError(error.message);
    }finally{
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100vh] bg-shop-bg dark:bg-[#171a26]">
        <h3 className="text-white">در حال بارگذاری...</h3>
      </div>
    );
  }

  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">تغییر رمز عبور</h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت رمز عبور خود را ویرایش کنید.</span>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header.png"}
          alt="هدر"
          width={1663}
          height={277}
        />
      </div>
      <div className="container py-4 px-10 -mt-10 z-50 relative">
        <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
          <div className="max-w-[400px] bg-white dark:bg-shop-dark">
            {error && <h3 className="text-red-500 dark:text-gray-200 flex gap-x-2 items-center py-1 px-2">{error}</h3>}
            {formError && <h3>{formError}</h3>}
            <form className="py-4" onSubmit={handleSubmit}>
              <div className="flex flex-col items-start gap-y-4 w-full">
                <input
                  name="currentPassword"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`رمز عبور فعلی`}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                />
                <input
                  name="currentPassword"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`رمز عبور جدید`}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
                <input
                  name="currentPassword"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`تکرار رمز عبور جدید`}
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={loading}
                />

                <div>
                  <button type="submit" className="bg-green-500 text-white py-2 px-4 me-3 rounded">
                    ذخیره تغییرات
                  </button>
                  <Link href={"/user"} className="bg-red-500 text-white py-2 px-6 rounded">
                    انصراف
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default changePassword;
