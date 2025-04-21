"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useState } from "react";
import "../styles/cart.css";
import Header from "../components/home/Header";
import Benefits from "../components/home/Benefits";
import Footer from "react-multi-date-picker/plugins/range_picker_footer";
import { FaTrashAlt } from "react-icons/fa";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, error } = useCart();
  const [loadingItem, setLoadingItem] = useState(null);

  if (!cart || cart.items.length === 0)
    return (
      <main className="main-body">
        <section className="container-xxl text-center py-5">
          <h4>سبد خرید شما خالی هست</h4>
          <Link href="/" className="btn btn-primary mt-3">
            بازگشت به فروشگاه
          </Link>
        </section>
      </main>
    );

  return (
    <main className="main-body" >
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
                        <section className="cart-product-number d-inline-block w-25">
                          <button
                            className="cart-number-down"
                            type="button"
                            disabled={
                              item.quantity <= 1 ||
                              loadingItem === item.product?._id
                            }
                            onClick={async () => {
                              setLoadingItem(item.product?._id);
                              await decreaseQuantity(item.product?._id);
                              setLoadingItem(null);
                            }}
                          >
                            {loadingItem === item.product?._id
                              ? "..."
                              : "-"}
                          </button>
                          <input
                            className="w-1/3"
                            name="quantity"
                            type="number"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="cart-number-up"
                            type="button"
                            onClick={async () => {
                              setLoadingItem(item.product?._id);
                              await increaseQuantity(item.product?._id);
                              setLoadingItem(null);
                            }}
                          >
                            {loadingItem === item.product?._id
                              ? "..."
                              : "+"}
                          </button>
                        </section>
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
                        {item.product?.price?.toLocaleString()}
                        تومان
                      </section>
                    </section>
                  </section>
                );
              })}

              <section className="row mt-4">
                <section className="col-md-9 mb-3">
                </section>
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
                              total + (item.product.price || 0) * item.quantity,
                            0
                          )
                          .toLocaleString()}
                        تومان
                      </p>
                    </section>

                    <section className="border-bottom mb-3"></section>
                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">جمع سبد خرید</p>
                      <p className="fw-bolder">
                        {cart.items
                          .reduce(
                            (total, item) =>
                              total + (item.product.price || 0) * item.quantity,
                            0
                          )
                          .toLocaleString()}
                        تومان
                      </p>
                    </section>
                    <section className="py-6 mx-auto">
                      <Link href="/checkout" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded d-block me-5">
                        تکمیل فرآیند خرید
                      </Link>
                      <Link href="/" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
                        بازگشت به فروشگاه
                      </Link>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </main>


  )
}
