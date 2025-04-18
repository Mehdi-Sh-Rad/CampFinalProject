"use client";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import React, { useState } from "react";

const RegisterForm = () => {
  // State for form inputs and UI control
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

   // Get reCAPTCHA token using site key
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

  // Handle sending OTP for registration
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form inputs
    if (!name || name.trim().length < 3 || name.trim().length > 30) {
      setError("نام باید بین 3 تا 30 کاراکتر باشد");
      return;
    }
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (!email || !emailRegex.test(email)) {
      setError("ایمیل معتبر نیست");
      return;
    }
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("شماره تماس معتبر نیست");
      return;
    }
    if (!password || password.length < 8) {
      setError("رمز عبور باید حداقل 8 کاراکتر باشد");
      return;
    }

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken("register");
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password, type: "register", recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setSuccess(`کد قبلی هنوز معتبر است. (${data.timeLeft} ثانیه باقی‌مانده)`);
          setStep(2);
        } else {
          setError(data.message || "خطایی از سمت سرور رخ داده است");
        }
      } else {
        setSuccess("کد تایید برای شما ارسال شد");
        setStep(2);
      }
    } catch (error) {
      setError("خطا در ارسال اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError("کد تایید باید 6 رقمی باشد");
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken("verify_otp");
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code: otp, name, email, password, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "خطایی سمت سرور رخ داده است");
      } else {
        setSuccess("شما با موفقیت ثبت نام شدید");
      }
    } catch (error) {
      setError("خطایی رخ داده است");
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
            <Image src={"/uploads/logo2.webp"} width={50} height={50} alt="logo" />
            {error && <h3 className="text-white bg-shop-red py-2 px-4 w-full rounded-lg">{error}</h3>}
            {success && <h3 className="text-white bg-green-400 py-3 px-4 rounded-lg">{success}</h3>}
            {/* Step 1: Registration form */}
            {step === 1 && (
              <form className="flex flex-col gap-y-4 w-full" onSubmit={handleSendOtp}>
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center">
                    <svg fill="none" className="text-[#292d32] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.294 7.29105C17.294 10.2281 14.9391 12.5831 12 12.5831C9.0619 12.5831 6.70601 10.2281 6.70601 7.29105C6.70601 4.35402 9.0619 2 12 2C14.9391 2 17.294 4.35402 17.294 7.29105ZM12 22C7.66237 22 4 21.295 4 18.575C4 15.8539 7.68538 15.1739 12 15.1739C16.3386 15.1739 20 15.8789 20 18.599C20 21.32 16.3146 22 12 22Z"
                        fill="currentColor"
                      />
                    </svg>
                    <h3 className="text-[#292d32] dark:text-white font-bold">نام</h3>
                  </div>

                  <input
                    name="name"
                    autoComplete="name"
                    className="focus:outline-none bg-[#f8f8f8] dark:bg-[#24152e] dark:text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="نام خود را وارد کنید"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                    placeholder="یک ایمیل معتبر وارد کنید"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center">
                    <svg fill="none" className="text-[#292d32] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.5317 12.4724C15.5208 16.4604 16.4258 11.8467 18.9656 14.3848C21.4143 16.8328 22.8216 17.3232 19.7192 20.4247C19.3306 20.737 16.8616 24.4943 8.1846 15.8197C-0.493478 7.144 3.26158 4.67244 3.57397 4.28395C6.68387 1.17385 7.16586 2.58938 9.61449 5.03733C12.1544 7.5765 7.54266 8.48441 11.5317 12.4724Z"
                        fill="currentColor"
                      />
                    </svg>
                    <h3 className="text-[#292d32] dark:text-white font-bold">موبایل</h3>
                  </div>
                  <input
                    name="phone"
                    autoComplete="phone"
                    className="focus:outline-none bg-[#f8f8f8] dark:bg-[#24152e] dark:text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="یک شماره همراه معتبر وارد کنید"
                    type="number"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center">
                    <svg fill="none" className="text-[#292d32] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.0105 14.6013C17.4245 14.6013 17.7605 14.2653 17.7605 13.8513V11.9993C17.7605 11.5853 17.4245 11.2493 17.0105 11.2493H11.3185C10.9945 10.1823 10.0125 9.39827 8.84051 9.39827C7.40651 9.39827 6.23951 10.5653 6.23951 11.9993C6.23951 13.4343 7.40651 14.6013 8.84051 14.6013C10.0125 14.6013 10.9945 13.8173 11.3185 12.7493H13.4305V13.8513C13.4305 14.2653 13.7665 14.6013 14.1805 14.6013C14.5945 14.6013 14.9305 14.2653 14.9305 13.8513V12.7493H16.2605V13.8513C16.2605 14.2653 16.5965 14.6013 17.0105 14.6013ZM7.66551 1.99927H16.3345C19.7225 1.99927 21.9995 4.37727 21.9995 7.91627V16.0833C21.9995 19.6223 19.7225 21.9993 16.3335 21.9993H7.66551C4.27651 21.9993 1.99951 19.6223 1.99951 16.0833V7.91627C1.99951 4.37727 4.27651 1.99927 7.66551 1.99927ZM7.73861 12.0002C7.73861 11.3922 8.23361 10.8982 8.84061 10.8982C9.44761 10.8982 9.94261 11.3922 9.94261 12.0002C9.94261 12.6072 9.44761 13.1012 8.84061 13.1012C8.23361 13.1012 7.73861 12.6072 7.73861 12.0002Z"
                        fill="currentColor"></path>
                    </svg>
                    <h3 className="text-[#292d32] dark:text-white font-bold">رمز عبور</h3>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      autoComplete="password"
                      className="focus:outline-none bg-[#f8f8f8] dark:bg-[#24152e] dark:text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="رمز عبور خود را وارد کنید"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                          <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center">
                    <svg fill="none" className="text-[#292d32] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.0105 14.6013C17.4245 14.6013 17.7605 14.2653 17.7605 13.8513V11.9993C17.7605 11.5853 17.4245 11.2493 17.0105 11.2493H11.3185C10.9945 10.1823 10.0125 9.39827 8.84051 9.39827C7.40651 9.39827 6.23951 10.5653 6.23951 11.9993C6.23951 13.4343 7.40651 14.6013 8.84051 14.6013C10.0125 14.6013 10.9945 13.8173 11.3185 12.7493H13.4305V13.8513C13.4305 14.2653 13.7665 14.6013 14.1805 14.6013C14.5945 14.6013 14.9305 14.2653 14.9305 13.8513V12.7493H16.2605V13.8513C16.2605 14.2653 16.5965 14.6013 17.0105 14.6013ZM7.66551 1.99927H16.3345C19.7225 1.99927 21.9995 4.37727 21.9995 7.91627V16.0833C21.9995 19.6223 19.7225 21.9993 16.3335 21.9993H7.66551C4.27651 21.9993 1.99951 19.6223 1.99951 16.0833V7.91627C1.99951 4.37727 4.27651 1.99927 7.66551 1.99927ZM7.73861 12.0002C7.73861 11.3922 8.23361 10.8982 8.84061 10.8982C9.44761 10.8982 9.94261 11.3922 9.94261 12.0002C9.94261 12.6072 9.44761 13.1012 8.84061 13.1012C8.23361 13.1012 7.73861 12.6072 7.73861 12.0002Z"
                        fill="currentColor"></path>
                    </svg>
                    <h3 className="text-[#292d32] dark:text-white font-bold">تایید رمز عبور</h3>
                  </div>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      autoComplete="confirmPassword"
                      className="focus:outline-none bg-[#f8f8f8] dark:bg-[#24152e] dark:text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="رمز عبور خود را مجددا وارد کنید"
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                          <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-shop-red text-white rounded-lg font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-shop-red transition-all duration-300">
                  {loading ? "در حال ارسال ..." : "ثبت نام"}
                </button>
              </form>
            )}
            {/* Step 2: OTP verification form */}
            {step === 2 && (
              <form className="flex flex-col gap-y-4 w-full" onSubmit={handleVerifyOtp}>
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.7281 21.9137C11.8388 21.9715 11.9627 22.0009 12.0865 22C12.2103 21.999 12.3331 21.9686 12.4449 21.9097L16.0128 20.0025C17.0245 19.4631 17.8168 18.8601 18.435 18.1579C19.779 16.6282 20.5129 14.6758 20.4998 12.6626L20.4575 6.02198C20.4535 5.25711 19.9511 4.57461 19.2082 4.32652L12.5707 2.09956C12.1711 1.96424 11.7331 1.96718 11.3405 2.10643L4.72824 4.41281C3.9893 4.67071 3.496 5.35811 3.50002 6.12397L3.54231 12.7597C3.5554 14.7758 4.31448 16.7194 5.68062 18.2335C6.3048 18.9258 7.10415 19.52 8.12699 20.0505L11.7281 21.9137ZM10.7836 14.1089C10.9326 14.2521 11.1259 14.3227 11.3192 14.3207C11.5125 14.3198 11.7047 14.2472 11.8517 14.1021L15.7508 10.2581C16.0438 9.96882 16.0408 9.50401 15.7448 9.21866C15.4478 8.9333 14.9696 8.93526 14.6766 9.22454L11.3081 12.5449L9.92885 11.2191C9.63186 10.9337 9.15467 10.9367 8.8607 11.226C8.56774 11.5152 8.57076 11.98 8.86775 12.2654L10.7836 14.1089Z"
                        fill="currentColor"
                      />
                    </svg>
                    <h3 className="text-[#292d32] dark:text-white font-bold">کد تایید</h3>
                  </div>

                  <input
                    name="code"
                    autoComplete="code"
                    className="focus:outline-none bg-[#f8f8f8] dark:bg-[#24152e] dark:text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="کد تایید را وارد کنید"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-shop-red text-white rounded-lg font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-shop-red transition-all duration-300">
                  {loading ? "در حال تایید ..." : "تایید"}
                </button>
              </form>
            )}
          </div>
          <Link
            className="mt-4 py-4 px-4 w-80 md:w-96 flex font-semibold text-sm justify-center bg-white dark:bg-[#2e1f38] dark:text-white rounded-xl shadow-sm"
            href={"/auth/login"}>
            حساب کاربری دارید؟ وارد شوید
          </Link>
          <Link
            className="py-4 px-4 w-80 md:w-96 flex font-semibold text-sm justify-center bg-white dark:bg-[#2e1f38] dark:text-white rounded-xl shadow-sm"
            href={"/auth/forget-password"}>
            رمزعبور خود را فراموش کرده اید؟
          </Link>
          <Link className="py-4 px-4 w-80 md:w-96 flex font-semibold text-sm justify-center bg-white dark:bg-[#2e1f38] dark:text-white rounded-xl shadow-sm" href={"/"}>
            بازگشت
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
