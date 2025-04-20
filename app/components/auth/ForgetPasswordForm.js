"use client";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import React, { useState } from "react";

// Component for password reset link request
const ForgetPasswordForm = () => {
  // State for form input and UI control
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch reCAPTCHA token for specified action
  const getRecaptchaToken = async (action) => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
          .then((token) => resolve(token))
          .catch((err) => reject(err));
      });
    });
  };

  // Handle sending password reset link
  const handleSendLink = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (!email || !emailRegex.test(email)) {
      setError("ایمیل معتبر نیست");
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken("forgetPassword");
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "خطایی از سمت سرور رخ داده است");
      } else {
        setSuccess("لینک بازیابی رمزعبور به ایمیل شما ارسال شد");
      }
    } catch (error) {
      setError("خطا در ارسال اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load reCAPTCHA script */}
      <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
      <div className="dark:bg-[#1a0b24] bg-slate-50 py-10 min-h-[100vh] flex flex-col items-center justify-center">
        <div id="wrapper" className="flex justify-center items-center flex-col gap-y-4 ">
          <div className="bg-white dark:bg-[#2e1f38] rounded-3xl w-80 md:w-96 px-6 py-6 shadow-sm flex flex-col items-center gap-y-4 justify-center">
            <Image src={"/logo-min.png"} width={50} height={50} alt="logo" />
            {error && <h3 className="text-white bg-shop-red py-2 px-4 w-full rounded-lg">{error}</h3>}
            {success && <h3 className="text-white bg-green-400 py-3 px-4 rounded-lg">{success}</h3>}

            {/* Password reset form */}
            <form className="flex flex-col gap-y-4 w-full" onSubmit={handleSendLink}>
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-2 items-center">
                  <svg fill="none" className="text-[#292d32] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.9395 3C18.2805 3 19.5705 3.53 20.5195 4.481C21.4695 5.43 22.0005 6.71 22.0005 8.05V15.95C22.0005 18.74 19.7305 21 16.9395 21H7.06049C4.26949 21 2.00049 18.74 2.00049 15.95V8.05C2.00049 5.26 4.25949 3 7.06049 3H16.9395ZM18.5305 9.54L18.6105 9.46C18.8495 9.17 18.8495 8.75 18.5995 8.46C18.4605 8.311 18.2695 8.22 18.0705 8.2C17.8605 8.189 17.6605 8.26 17.5095 8.4L13.0005 12C12.4205 12.481 11.5895 12.481 11.0005 12L6.50049 8.4C6.18949 8.17 5.75949 8.2 5.50049 8.47C5.23049 8.74 5.20049 9.17 5.42949 9.47L5.56049 9.6L10.1105 13.15C10.6705 13.59 11.3495 13.83 12.0605 13.83C12.7695 13.83 13.4605 13.59 14.0195 13.15L18.5305 9.54Z"
                      fill="currentColor"></path>
                  </svg>
                  <h3 className="text-[#292d32] dark:text-white font-bold">ایمیل</h3>
                </div>
                <input
                  name="email"
                  autoComplete="email"
                  className="focus:outline-none bg-[#f8f8f8] dark:bg-[#24152e] dark:text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder="ایمیل خود را وارد کنید"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-shop-red text-white rounded-lg font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-shop-red transition-all duration-300">
                {loading ? "در حال ارسال ..." : "ارسال لینک بازیابی رمزعبور"}
              </button>
            </form>
          </div>
          <Link
            className="mt-4 py-4 px-4 w-80 md:w-96 flex font-semibold text-sm justify-center bg-white dark:bg-[#2e1f38] dark:text-white rounded-xl shadow-sm"
            href={"/auth/login"}>
            حساب کاربری دارید؟ وارد شوید
          </Link>
          <Link
            className=" py-4 px-4 w-80 md:w-96 flex font-semibold text-sm justify-center bg-white dark:bg-[#2e1f38] dark:text-white rounded-xl shadow-sm"
            href={"/auth/register"}>
            حساب کاربری ندارید؟ ثبت نام کنید
          </Link>
          <Link className="py-4 px-4 w-80 md:w-96 flex font-semibold text-sm justify-center bg-white dark:bg-[#2e1f38] dark:text-white rounded-xl shadow-sm" href={"/"}>
            بازگشت
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordForm;
