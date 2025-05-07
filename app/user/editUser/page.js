"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditUserInfo = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const [otpSentEmail, setOtpSentEmail] = useState(false);
  const [otpSentPhone, setOtpSentPhone] = useState(false);

  const router = useRouter();

  // Fetch category data by ID on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");

        if (!response.ok) throw new Error("مشکل در دریافت اطلاعات کاربر");
        const data = await response.json();
        setUser(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setImage(data.image || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Validate form input
  const validateForm = () => {
    if (name.trim() === "") {
      setFormError("نام الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    // if (phone.trim() === "") {
    //   setFormError("شماره تلفن الزامی میباشد");
    //   return false;
    // } else if (phone.length < 11 || phone.length > 13) {
    //   setFormError("شماره تلفن باید بین ۱۱ تا ۱۳ باشد");
    //   return false;
    // } else if (!/^\d+$/.test(phone)) {
    //   setFormError("شماره تلفن باید فقط شامل اعداد باشد");
    //   return false;
    // }

    // if (email.trim() === "") {
    //   setFormError("ایمیل الزامی میباشد");
    //   return false;
    // } else if (!/\S+@\S+\.\S+/.test(email)) {
    //   setFormError("ایمیل نامعتبر است");
    //   return false;
    // }

    setFormError("");
    return true;
  };

  // Validate new email
  const validateNewEmail = () => {
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (newEmail.trim() === "") {
      setFormError("ایمیل جدید الزامی است");
      return false;
    } else if (!emailRegex.test(newEmail)) {
      setFormError("ایمیل جدید نامعتبر است");
      return false;
    }
    setFormError("");
    return true;
  };

  // Validate new phone
  const validateNewPhone = () => {
    const phoneRegex = /^09[0-9]{9}$/;
    if (newPhone.trim() === "") {
      setFormError("شماره تلفن جدید الزامی است");
      return false;
    } else if (!phoneRegex.test(newPhone)) {
      setFormError("شماره تلفن جدید باید فقط شامل اعداد باشد");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleImageChange = (image) => {
    if (!image) {
      setImage("");
      return;
    }
    setImage(image);
  };

  // Handle sending OTP for email
  const handleSendOtpEmail = async () => {
    if (!validateNewEmail()) return;

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          newEmail: newEmail,
          type: "change-email",
          recaptchaToken: "no-recaptcha",
        }),
      });
      const data = await response.json();
      if (response.status === 429) {
        setOtpSentEmail(true);
        setFormError(`کد قبلی هنوز معتبر است، ${data.timeLeft} ثانیه باقی مانده`);
        return;
      }
      if (!response.ok) {
        setFormError(data.message || "خطا در ارسال کد تأیید");
        return;
      }
      setOtpSentEmail(true);
      setFormError("");
    } catch (error) {
      setFormError(error.message);
    }
  };

  // Handle sending OTP for phone
  const handleSendOtpPhone = async () => {
    if (!validateNewPhone()) return;

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          newPhone: newPhone,
          type: "change-phone",
          recaptchaToken: "no-recaptcha",
        }),
      });
      const data = await response.json();
      if (response.status === 429) {
        setOtpSentPhone(true);
        setFormError(`کد قبلی هنوز معتبر است، ${data.timeLeft} ثانیه باقی مانده`);
        return;
      }
      if (!response.ok) {
        setFormError(data.message || "خطا در ارسال کد تأیید");
        return;
      }
      setOtpSentPhone(true);
      setFormError("");
    } catch (error) {
      setFormError(error.message);
    }
  };

  // Handle verifying OTP for email
  const handleVerifyOtpEmail = async () => {
    if (!otpEmail || otpEmail.length !== 6 || !/^\d+$/.test(otpEmail)) {
      setFormError("کد تأیید باید ۶ رقم باشد");
      return;
    }
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: otpEmail,
          type: "change-email",
          recaptchaToken: "no-recaptcha",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.message || "خطا در تأیید کد");
        return;
      }
      setOtpSentEmail(false);
      setNewEmail("");
      setOtpEmail("");
      setEmail(data.email || email);
      setFormError("");
      router.push("/user");
    } catch (error) {
      setFormError(error.message);
    }
  };

  // Handle verifying OTP for phone
  const handleVerifyOtpPhone = async () => {
    if (!otpPhone || otpPhone.length !== 6 || !/^\d+$/.test(otpPhone)) {
      setFormError("کد تأیید باید ۶ رقم باشد");
      return;
    }
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          code: otpPhone,
          type: "change-phone",
          recaptchaToken: "no-recaptcha",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.message || "خطا در تأیید کد");
        return;
      }
      setOtpSentPhone(false);
      setNewPhone("");
      setOtpPhone("");
      setPhone(data.phone || phone);
      setFormError("");
      router.push("/user");
    } catch (error) {
      setFormError(error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      //   formData.append("phone", phone);
      //   formData.append("email", email);

      if (image) {
        formData.append("image", image); // Append the selected file
      }
      const response = await fetch("/api/users", {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }
      if (!response.ok) throw new Error("مشکلی در به‌روزرسانی اطلاعات کاربر پیش آمده است");
      router.push("/user");
    } catch (error) {
      setError(error.message);
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
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">ویرایش اطلاعات کاربری</h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت اطلاعات خود را ویرایش کنید.</span>
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
                  name="name"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`${loading ? "در حال بارگذاری..." : ""}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />

                {/* <input
                  name="phone"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`${loading ? "در حال بارگذاری..." : ""}`}
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                /> */}

                <div className="w-full">
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">ایمیل فعلی</label>
                  <p className="text-gray-700 dark:text-gray-200">{email}</p>
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">ایمیل جدید</label>
                  <input
                    className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="ایمیل جدید"
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={loading || otpSentEmail}
                  />
                  {!otpSentEmail ? (
                    <button type="button" className="bg-blue-500 text-white py-1 px-3 mt-2 rounded" onClick={handleSendOtpEmail} disabled={loading || !newEmail}>
                      ارسال کد تأیید
                    </button>
                  ) : (
                    <div className="mt-2">
                      <input
                        className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                        placeholder="کد تأیید"
                        type="text"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        disabled={loading}
                      />
                      <button type="button" className="bg-green-500 text-white py-1 px-3 mt-2 rounded" onClick={handleVerifyOtpEmail} disabled={loading || !otpEmail}>
                        تأیید کد
                      </button>
                    </div>
                  )}
                </div>

                {/* <input
                  name="email"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  placeholder={`${loading ? "در حال بارگذاری..." : ""}`}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                /> */}

                <div className="w-full">
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">شماره موبایل فعلی</label>
                  <p className="text-gray-700 dark:text-gray-200">{phone}</p>
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">شماره موبایل جدید</label>
                  <input
                    className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="شماره موبایل جدید"
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    disabled={loading || otpSentPhone}
                  />
                  {!otpSentPhone ? (
                    <button type="button" className="bg-blue-500 text-white py-1 px-3 mt-2 rounded" onClick={handleSendOtpPhone} disabled={loading || !newPhone}>
                      ارسال کد تأیید
                    </button>
                  ) : (
                    <div className="mt-2">
                      <input
                        className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                        placeholder="کد تأیید"
                        type="text"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        disabled={loading}
                      />
                      <button type="button" className="bg-green-500 text-white py-1 px-3 mt-2 rounded" onClick={handleVerifyOtpPhone} disabled={loading || !otpPhone}>
                        تأیید کد
                      </button>
                    </div>
                  )}
                </div>

                <input
                  name="image"
                  className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  disabled={loading}
                />
                <div>
                  <button type="submit" className="bg-green-500 text-white py-2 px-4 me-3 rounded">
                    {loading ? "در حال بارگذاری..." : "ذخیره تغییرات"}
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

export default EditUserInfo;
