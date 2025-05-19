"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowUp } from "react-icons/fa";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";
import EmptyCart from "../components/carts/EmptyCart";
import OrderSuccess from "../components/carts/OrderSuccess";
import Loading from "../loading";
import { getWallet } from "../lib/fetch/Wallets";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payableAmount, setPayableAmount] = useState(0);
  const [discount, setDiscount] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [wallets, setWallets] = useState([]);
  const [orderCode, setOrderCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Calculate total price and apply discount
  const totalPrice =
    cart?.items?.reduce(
      (total, item) => total + (item.product.finalPrice ?? 0) * item.quantity,
      0
    ) || 0;

  useEffect(() => {
    if (totalPrice > 0) {
      setPayableAmount(totalPrice - appliedDiscount);
    } else {
      setPayableAmount(0);
    }
  }, [totalPrice, appliedDiscount]);

  // Fetch discounts
  useEffect(() => {
    const fetchDiscount = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/discounts");
        if (!response.ok) throw new Error("مشکل در دریافت کدهای تخفیف");
        const data = await response.json();
        setDiscount(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscount();
  }, []);

  // Fetch wallets
  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      try {
        const data = await getWallet();
        if (!data) throw new Error("مشکل در دریافت کیف‌پول‌ها");
        setWallets(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  useEffect(() => {
    generateOrderCode();
  }, []);

  //Generate discount code
  const generateOrderCode = () => {
    const characters = "0123456789";
    let result = "P-";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setOrderCode(result);
  };

  //Handle discount process
  const handleApplyDiscount = async () => {
    setLoading(true);
    setDiscountError("");
    try {
      if (!discountCode) {
        setDiscountError("لطفا کد تخفیف را وارد کنید");
        return;
      }
      if (discountCode.length < 5) {
        setDiscountError("کد تخفیف نامعتبر است");
        return;
      }

      const discountItem = discount.find((item) => item.code === discountCode);
      if (discountItem) {
        if (discountItem.percentage > 100 || discountItem.percentage < 0) {
          setDiscountError("درصد تخفیف نامعتبر است");
          return;
        }
        setDiscountPercent(discountItem.percentage);
        setAppliedDiscount((totalPrice * discountItem.percentage) / 100);
      } else {
        setAppliedDiscount(0);
        setDiscountError("کد تخفیف نامعتبر است");
      }
    } finally {
      setLoading(false);
    }
  };

  //Handle remove discount
  const handleRemoveDiscount = async (id) => {
    setLoading(true);
    setDiscountError("");
    try {
      if (!id) {
        setDiscountError("کد تخفیف نامعتبر است");
        return;
      }
      await fetch(`/api/discounts?id=${id}`, { method: "DELETE" });
      setAppliedDiscount(0);
      setDiscountPercent(null);
      setDiscountCode("");
    } catch (error) {
      setDiscountError(error.message || "مشکلی در حذف کد تخفیف پیش آمده است");
    } finally {
      setLoading(false);
    }
  };

  //Handle payment process
  const handlePayment = async () => {
    if (payableAmount <= 0) {
      setError("مبلغ خرید نامعتبر است");
      return;
    }
    if (!orderCode) {
      setError("کد پیگیری سفارش اختصاص پیدا نکرده است");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          items: cart.items,
          totalDiscount: appliedDiscount,
          totalPrice: payableAmount,
          status: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "مشکلی در ثبت پرداخت پیش آمده است");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Handle wallet withdraw process
  const handleWalletWithdraw = async (e) => {
    e.preventDefault();
    if (payableAmount <= 0) {
      setError("مبلغ خرید نامعتبر است");
      return;
    }
    try {
      setLoading(true);
      if (wallets[0]?.balance < payableAmount) {
        setError("موجودی کیف پول شما کافی نیست");
        return;
      }

      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableAmount,
          type: "debit",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "مشکلی در برداشت از کیف پول پیش آمده است"
        );
      }

      await handleOrderSubmit();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Handle order submit process
  const handleOrderSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          status: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "مشکلی در ثبت سفارش پیش آمده است");
      }

      await handlePayment();
      clearCart();
      if (discountCode) {
        const discountItem = discount.find(
          (item) => item.code === discountCode
        );
        if (discountItem) await handleRemoveDiscount(discountItem._id);
      }
      setShowOrderSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //Show order success page
  if (showOrderSuccess) {
    return <OrderSuccess orderCode />;
  }

  //Handle loading state
  if (loading) {
    return (
      <div className="bg-[#F0EBFF] min-h-screen">
        <Header />
        <Loading />
        <Footer />
      </div>
    );
  }

  //Show empty cart page
  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-[#F0EBFF] min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-4">
          <section className="container">
            <section className="row">
              <section className="col">
                <section className="content-header">
                  <h4 className="text-center bg-[#4BC0D9]/10 py-3 rounded-lg text-lg font-semibold text-[#1B1F3B]">
                    انتخاب نوع پرداخت
                  </h4>
                </section>
                {(error || discountError) && (
                  <section className="alert text-red-500 bg-red-50 p-4 rounded-lg mb-4 text-center">
                    {error || discountError}
                  </section>
                )}
                <section className="content-wrapper bg-white p-4 rounded-lg shadow-sm mb-4">
                  <section
                    className="payment-alert flex items-center p-2 bg-[#4BC0D9]/10 rounded-lg"
                    role="alert"
                  >
                    <i className="fa fa-info-circle text-[#4BC0D9] mr-2"></i>
                    <section className="text-[#1B1F3B] text-sm">
                      کد تخفیف خود را در این بخش وارد کنید.
                    </section>
                  </section>
                  <section className="row">
                    <section className="col-md-5">
                      <section className="input-group input-group-sm flex flex-col sm:flex-row gap-2 items-center justify-center">
                        <input
                          type="text"
                          className="w-52 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                          placeholder="کد تخفیف را وارد کنید"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                        />
                        <button
                          className="w-28 bg-[#7B61FF] hover:bg-[#6A50E6] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          type="button"
                          onClick={handleApplyDiscount}
                          disabled={loading}
                        >
                          اعمال کد
                        </button>
                      </section>
                    </section>
                    {discountPercent && (
                      <section className="col-md-5 mt-2 sm:mt-0 text-center">
                        <section className="text-green-500 flex items-center justify-center text-sm">
                          <i className="fa fa-check-circle mr-2"></i>
                          <section>
                            تخفیف {discountPercent}% برای شما اعمال شد
                          </section>
                        </section>
                      </section>
                    )}
                  </section>
                </section>
                {cart.items.map((item) => (
                  <section
                    className="cart-item flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border-b border-gray-200 mb-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    key={item.product._id}
                  >
                    <section className="flex-1">
                      <p className="text-base sm:text-lg font-semibold text-[#1B1F3B]">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        تعداد: {item.quantity}
                      </p>
                    </section>
                    <section className="mt-2 sm:mt-0">
                      <p className="text-base sm:text-lg font-bold text-[#1B1F3B]">
                        {item.product.finalPrice
                          ? `${(
                              item.product.finalPrice * item.quantity
                            ).toLocaleString()} تومان`
                          : "رایگان"}
                      </p>
                    </section>
                  </section>
                ))}
                <br />
                <section className="content-wrapper bg-white p-6 rounded-lg shadow-sm mt-5">
                  <section className="flex justify-between items-center mb-3">
                    <p className="text-gray-600 text-sm sm:text-base">
                      قیمت کالاها
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {totalPrice.toLocaleString()} تومان
                    </p>
                  </section>
                  <section className="border-b border-gray-200 mb-3"></section>
                  <section className="flex justify-between items-center mb-3">
                    <p className="text-gray-600 text-sm sm:text-base">
                      تخفیف اعمال شده
                    </p>
                    <p className="text-red-500 text-sm sm:text-base">
                      {appliedDiscount.toLocaleString()} تومان
                    </p>
                  </section>
                  <section className="border-b border-gray-200 mb-3"></section>
                  <section className="flex justify-between items-center text-lg font-bold text-[#1B1F3B] mb-5">
                    <p>مبلغ قابل پرداخت</p>
                    <p>{payableAmount.toLocaleString()} تومان</p>
                  </section>
                  <section className="border-b border-gray-200 mb-3">
                    {wallets.map((wal) => (
                      <span
                        key={wal._id}
                        className="block bg-[#4BC0D9]/10 rounded-lg p-2 text-sm text-[#1B1F3B]"
                      >
                        موجودی فعلی کیف پول شما:{" "}
                        {wal.balance.toLocaleString("fa-IR")} تومان
                      </span>
                    ))}
                  </section>
                  <br />
                  {totalPrice > 0 ? (
                    <section className="mt-5 flex flex-col items-center space-y-3">
                      <button
                        className="w-40 bg-[#7B61FF] hover:bg-[#6A50E6] text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                        onClick={handleWalletWithdraw}
                        disabled={loading}
                      >
                        پرداخت از کیف پول
                      </button>
                      <button
                        className="w-40 bg-[#4BC0D9] hover:bg-[#3AA8C1] text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                        onClick={handleOrderSubmit}
                        disabled={loading}
                      >
                        درگاه پرداخت
                      </button>
                      <Link
                        href="/cart"
                        className="w-40 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors duration-200"
                      >
                        بازگشت به سبد خرید
                      </Link>
                      <Link
                        href="/"
                        className="w-40 bg-[#1B1F3B] hover:bg-[#14162E] text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors duration-200"
                      >
                        بازگشت به فروشگاه
                      </Link>
                    </section>
                  ) : (
                    <section className="mt-5 flex flex-col items-center space-y-3">
                      <button
                        className="w-40 bg-[#7B61FF] hover:bg-[#6A50E6] text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                        onClick={handleOrderSubmit}
                        disabled={loading}
                      >
                        نهایی کردن سفارش
                      </button>
                      <Link
                        href="/"
                        className="w-40 bg-[#1B1F3B] hover:bg-[#14162E] text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors duration-200"
                      >
                        بازگشت به فروشگاه
                      </Link>
                    </section>
                  )}
                </section>
              </section>
            </section>
          </section>
        </section>
      </main>
      <Benefits id="benefits" />
      <Footer />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-[#7B61FF] text-white p-3 rounded-full shadow-lg hover:bg-[#6A50E6] transition-all duration-300"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}