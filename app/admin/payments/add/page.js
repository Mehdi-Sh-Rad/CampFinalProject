"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AddPayment = () => {
  const [orderCode, setOrderCode] = useState("");
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Fetch users on component mount
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("مشکلی در دریافت لیست کاربران رخ داده است"));
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError("مشکلی در دریافت محصولات رخ داده است"));
  }, []);

  // Generate unique order code
  useEffect(() => {
    generateOrderCode();
  }, []);

  const generateOrderCode = () => {
    const characters = "0123456789";
    let result = "P-";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setOrderCode(result);
  };

  // Validate form inputs
  const validateForm = () => {
    if (!orderCode) {
      setFormError("کد پیگیری سفارش اختصاص پیدا نکرده است");
      return false;
    }
    if (!user) {
      setFormError("انتخاب کاربر الزامی است");
      return false;
    }
    if (!product) {
      setFormError("انتخاب محصول الزامی است");
      return false;
    }
    const priceNum = parseFloat(totalPrice);
    if (!totalPrice || isNaN(priceNum) || priceNum <= 0) {
      setFormError("قیمت نهایی فاکتور باید عدد مثبت باشد");
      return false;
    }

    let discountNum;
    if (totalDiscount && totalDiscount.trim() !== "") {
      discountNum = parseFloat(totalDiscount);
      if (isNaN(discountNum) || discountNum < 0) {
        setFormError("قیمت تخفیفی باید عدد مثبت باشد");
        return false;
      }
      if (discountNum >= priceNum) {
        setFormError("قیمت تخفیفی باید کمتر از قیمت نهایی باشد");
        return false;
      }
    }

    if (typeof status !== "boolean") {
      setFormError("وضعیت پرداخت نامعتبر است");
      return false;
    }
    console.log("Validated form data:", {
      orderCode,
      user,
      product,
      totalPrice,
      priceNum,
      totalDiscount,
      discountNum,
      status,
    });

    setFormError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);

      const payload = {
        orderCode,
        user,
        product,
        totalPrice: parseFloat(totalPrice),
        totalDiscount: totalDiscount && totalDiscount.trim() !== "" ? parseFloat(totalDiscount) : undefined,
        status,
      };
      console.log("Sending to backend:", payload);

      console.log("Checking payload:", {
        hasOrderCode: !!orderCode,
        hasUser: !!user,
        hasProduct: !!product,
        hasTotalPrice: !isNaN(parseFloat(totalPrice)),
      });

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          user,
          product,
          totalPrice: parseFloat(totalPrice),
          totalDiscount: totalDiscount && totalDiscount.trim() !== "" ? parseFloat(totalDiscount) : undefined,
          status,
        }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        if (response.status === 400) {
          const message = await response.json();
          setFormError(message.message);
        } else {
          throw new Error("مشکلی در ساخت کد تخفیف پیش آمده است");
        }
      } else {
        router.push("/admin/payments");
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">افزودن رکورد پرداخت جدید</h1>
          <Image
            className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
            src="/uploads/top-header.png"
            alt="هدر"
            width={1663}
            height={277}
          />
        </div>
        <div className="container py-4 px-10 -mt-10 z-30 relative">
          <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
            {formError && <div className="text-red-500 text-center">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">کدپیگیری سفارش</label>
                <input
                  type="text"
                  value={orderCode}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="کد خودکار تولید می‌شود"
                />
              </div>
              <select
                name="user"
                autoComplete="user"
                className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                placeholder="انتخاب محصول"
                type="text"
                required
                value={user}
                onChange={(e) => setUser(e.target.value)}>
                <option value="">انتخاب کاربر ثبت کننده سفارش</option>
                {users.map((usr) => {
                  return (
                    <option key={usr._id} value={usr._id}>
                      {usr.name}
                    </option>
                  );
                })}
              </select>
              <select
                name="product"
                autoComplete="product"
                className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                placeholder="انتخاب محصول"
                type="text"
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}>
                <option value="">انتخاب محصول مورد نظر</option>
                {products.map((cat) => {
                  return (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  );
                })}
              </select>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">قیمت نهایی فاکتور</label>
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300">قیمت با تخفیف</label>
                <input
                  type="number"
                  value={totalDiscount}
                  onChange={(e) => setTotalDiscount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} className="w-4 h-4 m-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">تایید</span>
              </div>
              <div>
                <button type="submit" className="bg-green-500 text-white ml-3 py-2 px-4 rounded">
                  ذخیره
                </button>
                <Link href={"/admin/payments"} className="bg-red-700 text-white py-2 px-4 rounded">
                  انصراف
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AddPayment;
