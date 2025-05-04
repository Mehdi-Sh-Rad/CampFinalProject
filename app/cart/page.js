"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import "../styles/cart.css";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "../components/home/Footer";
import { FaTrashAlt } from "react-icons/fa";
import EmptyCart from "../components/carts/EmptyCart";
import Loading from "../loading";


export default function Cart() {
  const { cart, removeFromCart, loading, error , clearError } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [loadingItem, setLoadingItem] = useState(null);


  useEffect(() => {
    if (cart && cart.items) {
      const calculatedTotalPrice = cart.items.reduce(
        (total, item) => total + (item.product.discountPrice || 0) * item.quantity,
        0
      );
      setTotalPrice(calculatedTotalPrice);
    }
  }, [cart.items]);

  // Clear cart error when the component is rendered
  useEffect(() => {
    clearError();
  }, []);

  return (
    <main className="main-body">
      {loading ? (<Loading />
      ) : (!cart || cart.items.length === 0) ? (
        <EmptyCart />
      ) : (
        <section className="mb-4">
          <section className="container">
            <section className="mb-4">
              <Header />
              <section className="row">
                <h4 className="text-center border bg-blue-100 py-3">سبد خرید</h4>
              </section>
              <section className="col">
                {error && <span className="text-red-400">{error}</span>}
                {cart.items.map((item) => {
                  return (
                    <section
                      className="cart-item d-flex justify-content-between align-items-center bg-white p-3 rounded-2 mb-3"
                      key={item.product?._id || item._id}
                    >
                      <section className="cart-product-image d-flex justify-content-center align-items-center">
                        {item.product?.imageUrls ? (
                          <Image
                            src={item.product?.imageUrls[0]}
                            className="rounded-2"
                            width={80}
                            height={80}
                            alt={item.product?.name}
                          />
                        ) : (
                          <span>تصویر موجود نیست</span>
                        )}
                      </section>
                      <section className="align-self-start w-1/3">
                        <p className="my-2">
                          {item.product?.name || "محصول نا مشخص"}
                        </p>
                        <section>
                          <button
                            className="m-5"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromCart(item.product?._id);
                            }}
                          >
                            <FaTrashAlt className="text-red-500 text-2xl" />
                          </button>
                        </section>
                      </section>
                      <section className="align-self-end flex-shrink-1">
                        <section className="text-nowrap fw-bold">
                          {item.product.discountPrice ? (
                            <p className="fw-bold">
                              {item.product.discountPrice?.toLocaleString()} تومان
                            </p>
                          ) : (
                            <p className="text-green-500 text-xl ms-3">رایگان</p>
                          )}
                        </section>
                      </section>
                    </section>
                  );
                })}

                <section className="row mt-4">
                  <section className="col-md-3">
                    <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">
                          قیمت کالاها ({cart.items.length})
                        </p>
                        <p className="text-muted">
                          {cart.items
                            .reduce(
                              (total, item) =>
                                total + (item.product.discountPrice || 0) * item.quantity,
                              0
                            )
                            .toLocaleString()}
                          تومان
                        </p>
                      </section>
                      <br />
                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">جمع سبد خرید</p>
                        <p className="fw-bolder">
                          {totalPrice.toLocaleString()}
                          تومان
                        </p>
                      </section>
                      <br />
                      <section className="py-6 mx-auto">
                   
                          <div>
                            <Link
                              href="/checkout"
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded d-block me-5"
                            >
                              تکمیل فرآیند خرید
                            </Link>
                            <Link
                              href="/"
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
                            >
                              بازگشت به فروشگاه
                            </Link>
                          </div>
                     
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      )}
    </main>
  );
}