"use client";

import { set } from "mongoose";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const EditUserInfo = () => {
    const [user, setUser] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(true);

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

        if (phone.trim() === "") {
            setFormError("شماره تلفن الزامی میباشد");
            return false;
        } else if (phone.length < 11 || phone.length > 13) {
            setFormError("شماره تلفن باید بین ۱۱ تا ۱۳ باشد");
            return false;
        } else if (!/^\d+$/.test(phone)) {
            setFormError("شماره تلفن باید فقط شامل اعداد باشد");
            return false;
        }

        if (email.trim() === "") {
            setFormError("ایمیل الزامی میباشد");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError("ایمیل نامعتبر است");
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("email", email);

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
                <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">ویرایش دسته بندی </h1>
                <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت دسته بندی محصول را ویرایش کنید.</span>
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
                        {error && (
                            <h3 className="text-red-500 dark:text-gray-200 flex gap-x-2 items-center py-1 px-2">
                                {error}
                            </h3>
                        )}
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
                                <input
                                    name="phone"
                                    className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                                    placeholder={`${loading ? "در حال بارگذاری..." : ""}`}
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={loading}
                                />
                                <input
                                    name="email"
                                    className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                                    placeholder={`${loading ? "در حال بارگذاری..." : ""}`}
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
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
                                    <button href={"/user"} className="bg-red-500 text-white py-2 px-6 rounded">
                                        انصراف
                                    </button>
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
