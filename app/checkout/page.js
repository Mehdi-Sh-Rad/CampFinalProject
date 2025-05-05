"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/home/Header";
import Footer from "react-multi-date-picker/plugins/range_picker_footer";
import error from "../error";
import EmptyCart from "../components/carts/EmptyCart";
import Loading from "../loading";

export default function Checkout() {
  const { cart, clearCart, loading: cartLoading } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payableAmount, setPayableAmount] = useState(0);
  const [discount, setDiscount] = useState(null);
  const [discountPrecent, setDiscountPrecent] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [wallets, setWallets] = useState([]);
  const [orderCode, setOrderCode] = useState("");
  const [payment, setPayment] = useState([]);
  const [appliedDsicount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");


  useEffect(() => {
    if (cart && cart.discountPrice > 0) {
      setAppliedDiscount(cart.discountPrice);
      setIsDiscountApplied(true);
    }
  }, [cart]);
  useEffect(() => {
    const fetchDiscount = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/discounts");

        if (!response.ok) throw new Error("مشکل در دریافت کدهای تخفیف");
        const data = await response.json();
        setDiscount(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscount();
  }, []);


  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/wallets");
        if (!response.ok) throw new Error("مشکل در دریافت کدهای تخفیف");
        const data = await response.json();
        setWallets(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const totalPrice = cart.items.reduce(
    (total, item) => total + ((item.product.finalPrice ?? 0) * item.quantity),
    0
  );

  useEffect(() => {
    if (totalPrice > 0) {
      setPayableAmount(totalPrice - appliedDsicount);
    }
  }, [totalPrice, appliedDsicount]);

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
        setDiscountPrecent(discountItem.percentage);

        if (discountItem.percentage > 100) {
          setDiscountError("درصد تخفیف نامعتبر است");
          return;
        }
        if (discountItem.percentage < 0) {
          setDiscountError("درصد تخفیف نامعتبر است");
          return;
        }
        setAppliedDiscount(
          (totalPrice * discountItem.percentage) / 100
        );
        setDiscountError("");
      } else {
        setAppliedDiscount(0);
        setDiscountError("کد تخفیف نامعتبر است");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = async (id) => {
    setLoading(true);
    setDiscountError("");
    if (!id) {
      setDiscountError("لطفا کد تخفیف را وارد کنید");
      return;
    }
    if (id.length < 5) {
      setDiscountError("کد تخفیف نامعتبر است");
      return;
    }
    if (discountCode) {
      setAppliedDiscount(0);
      setDiscountError("");
    } else {
      setAppliedDiscount(0);
      setDiscountError("کد تخفیف نامعتبر است");
      return;
    }
    try {
      await fetch(`/api/discounts?id=${id}`, { method: "DELETE" });

    } catch (error) {
      setDiscountError(error.message || "مشکلی در حذف کد تخفیف پیش آمده است");
    } finally {
      setLoading(false);
    }
  };

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


  const handlePayment = async () => {

    if (payableAmount === 0 || payableAmount === NaN) {
      setError("مبلغ خرید صفر می‌باشد");
      return false;
    };
    if (!orderCode) {
      setError("کد پیگیری سفارش اختصاص پیدا نکرده است");
      return false;
    };
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          items: cart.items,
          totalDiscount: appliedDsicount,
          totalPrice: payableAmount,
          status: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "مشکلی در برداشت از کیف پول پیش آمده است");
      }

    } catch (error) {
      alert(error.message || "مشکلی در ثبت اطلاعات پرداخت پیش آمده است");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletWithraw = async (e) => {
    e.preventDefault();

    if (payableAmount === 0) {
      setError("مبلغ خرید صفر می‌باشد");
      return false;
    }
    try {
      setLoading(true);
      setError("");

      if (payableAmount > wallets[0].balance) {
        setError("موجودی کیف پول شما کافی نیست");
        return false;
      }

      // Update wallet balance locally
      wallets.map((wal) => (wal.balance = wal.balance - payableAmount));
      setWallets(wallets);

      // Send the wallet withdrawal request
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableAmount,
          type: "debit",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Take back the wallet balance locally
        wallets.map((wal) => (wal.balance = wal.balance + payableAmount));
        setWallets(wallets);
        throw new Error(data.message || "مشکلی در برداشت از کیف پول پیش آمده است");
      }

      handleOrderSubmit();

    } catch (error) {
      alert(error.message || "مشکلی در ثبت سفارش پیش آمده است");
    } finally {
      setLoading(false);
    }
  };


  async function handleOrderSubmit() {
    setLoading(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderCode
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "مشکلی در ثبت سفارش پیش آمده است");
      }

      alert("سفارش شما با موفقیت ثبت شد");
      handlePayment();
      clearCart();
      router.push("/");
      if (discountCode) {
        handleRemoveDiscount(discount.find((item) => item.code === discountCode)._id);
      }
    } catch (error) {
      alert(error.message || "مشکلی در ثبت سفارش پیش آمده است");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      {cartLoading ? (<Loading />)
        :
        (!cart || cart.items.length === 0) ? (
          <EmptyCart />)
          :
          (<main className="main-body">
            <section className="mb-4">
              <section className="container">
                <section className="row">
                  <Header />
                  <section className="col">
                    <section className="content-header">
                      <h4 className="text-center border py-3 bg-blue-100">انتخاب نوع پرداخت</h4>
                    </section>
                    <section className="content-wrapper bg-white p-1 rounded-2 mb-2">
                      {loading && loading}
                      {error && <section className="alert text-red-500">{error}</section>}
                      {discountError && (
                        <section className="alert text-red-500">{discountError}</section>
                      )}

                      <section
                        className="payment-alert alert alert-primary d-flex align-items-center p-2"
                        role="alert"
                      >
                        <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                        <section>کد تخفیف خود را در این بخش وارد کنید.</section>
                      </section>

                      <section className="row">
                        <section className="col-md-5">
                          <section className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control border rounded mx-2"
                              placeholder="کد تخفیف را وارد کنید"
                              onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button className="btn bg-gray-400 px-2 rounded" type="button" onClick={handleApplyDiscount}>
                              اعمال کد
                            </button>

                          </section>
                        </section>
                        {discountPrecent && (<section className="col-md-5">
                          <section className=" text-green-500">
                            <i className="fa fa-check-circle flex-shrink-0 me-2"></i>
                            <section>تخفیف %{discountPrecent} برای شما اعمال شد</section>
                          </section>
                        </section>)}
                      </section>
                    </section>
                    {cart.items.map((item) => {
                      return (
                        <section
                          className="cart-item d-md-flex py-3 border-bottom"
                          key={item.product._id}
                        >
                          <section className="align-self-start w-100">
                            <p className="fw-bold">{item.product.name}</p>
                            {item.product.finalPrice ? (
                              <p className="fw-bold">
                                {item.product.finalPrice?.toLocaleString()} تومان
                              </p>
                            ) : (
                              <p className="text-green-500">رایگان</p>
                            )}
                          </section>
                        </section>
                      );
                    })}
                    <br />
                    <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price mt-5">
                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">قیمت کالاها</p>
                        <p className="text-muted">
                          {totalPrice.toLocaleString()} تومان
                        </p>
                      </section>

                      <section className="border-bottom mb-3"></section>

                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">تخفیف اعمال شده</p>
                        <p className="text-red-500">{appliedDsicount.toLocaleString()} تومان</p>
                      </section>

                      <section className="border-bottom mb-3"></section>

                      <section className="d-flex justify-content-between align-items-center text-xl pb-5 mt-8">
                        <p className="text-muted">مبلغ قابل پرداخت</p>
                        <p className="fw-bold">{payableAmount.toLocaleString()} تومان</p>
                      </section>
                      <section className="border-bottom mb-3">
                        {wallets.map((wal, indx) => (
                          <span key={wal._id} className="bg-slate-200 rounded-xl mt-9"> موجودی فعلی کیف پول شما: {wal.balance.toLocaleString("fa-IR")} تومان </span>
                        ))}
                      </section>
                      <br />
                      {totalPrice > 0 ?
                        (<section className="mt-5">

                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded d-block me-5"
                            onClick={handleWalletWithraw}
                            disabled={loading}
                          >
                            {loading ? "درحال پردازش ..." : "پرداخت از کیف پول"}
                          </button>
                          <button
                            className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded d-block me-5"
                            onClick={handleOrderSubmit}
                            disabled={loading}
                          >
                            {loading ? "درحال پردازش ..." : "درگاه پرداخت "}
                          </button>
                          <Link
                            href="/cart"
                            className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3 me-5"
                          >
                            بازگشت به سبد خرید
                          </Link>
                          <Link
                            href="/"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
                          >
                            بازگشت به فروشگاه
                          </Link>
                        </section>) : (
                          <div>
                            <button
                              className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded d-block me-5"
                              onClick={handleOrderSubmit}
                              disabled={loading}
                            >
                              {loading ? "درحال پردازش ..." : " نهایی کردن سفارش رایگان "}
                            </button>
                            <Link
                              href="/"
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
                            >
                              بازگشت به فروشگاه
                            </Link>
                          </div>
                        )}
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </main>)}
    </section>
  );
}
