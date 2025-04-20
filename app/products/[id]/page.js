"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/home/Header";
import Benefits from "../../components/home/Benefits";
import Footer from "../../components/home/Footer";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProductCard from "@/app/components/ProductCard";
import { useCart } from "@/app/context/CartContext";
import AddToCartButton from "@/app/components/home/AddToCartButton";

export default function ProductDetail() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, error } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [productError, setProductError] = useState(null);
  const { data: session, status } = useSession();
  const params = useParams();
  const productId = params?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("خطا در گرفتن محصول");
        const fetchedProduct = await res.json();
        setProduct(fetchedProduct);

        const relatedRes = await fetch(`/api/products?category=${fetchedProduct.category}&exclude=${productId}`);
        if (!relatedRes.ok) throw new Error("خطا در گرفتن محصولات پیشنهادی");
        const fetchedRelatedProducts = await relatedRes.json();
        setRelatedProducts(fetchedRelatedProducts);
      } catch (err) {
        setProductError(err.message);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?productId=${productId}`);
        if (!res.ok) throw new Error("خطا در گرفتن دیدگاه‌ها");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setProductError(err.message);
      }
    };

    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setProductError("برای ثبت دیدگاه باید وارد حساب کاربری خود شوید.");
      return;
    }

    if (!newComment.trim()) {
      setProductError("لطفاً متن دیدگاه را وارد کنید.");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          user: session.user.id,
          product: productId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const newCommentData = await res.json();
      setComments([newCommentData, ...comments]);
      setNewComment("");
      setProductError(null);
    } catch (err) {
      setProductError(err.message);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center p-4 text-red-500">محصول یافت نشد</div>
        <Benefits />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow-xl mb-8 border border-gray-100">
          <div className="md:w-1/3 flex justify-center">
            {product.imageUrls ? (
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                width={250}
                height={350}
                className="w-auto h-auto object-contain rounded-md shadow-md"
              />
            ) : (
              <div className="w-[250px] h-[350px] bg-gray-200 flex items-center justify-center rounded-md">
                <span className="text-gray-500">تصویر موجود نیست</span>
              </div>
            )}
          </div>
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold text-dark mb-3">{product.name}</h1>
            <div className="space-y-1 mb-3 text-sm">
              <p className="text-gray-600">نویسنده: <span className="text-dark">{product.author}</span></p>
              <p className="text-gray-600">
                دسته‌بندی: <Link href="#" className="text-primary hover:underline">{product.category?.name || "نامشخص"}</Link>
              </p>
              {product.types && product.types.length > 0 && (
                <p className="text-gray-600">نوع: <span className="text-dark">{product.types.join(", ")}</span></p>
              )}
              {product.tags && product.tags.length > 0 && (
                <p className="text-gray-600">تگ‌ها: <span className="text-dark">{product.tags.join(", ")}</span></p>
              )}
              <p className="text-gray-600">رایگان: <span className="text-dark">{product.free ? "بله" : "خیر"}</span></p>
            </div>
            <p className="text-xl font-semibold text-dark mb-2">
              {product.price.toLocaleString()} تومان
            </p>
            {product.discountPrice && (
              <p className="text-sm text-red-500 mb-10">
                قیمت با تخفیف: {product.discountPrice.toLocaleString()} تومان
              </p>
            )}

            <AddToCartButton productId={product._id} />

          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-dark mb-4">توضیحات کتاب</h2>
          <p className="text-gray-600 leading-relaxed">{product.description || "توضیحاتی برای این کتاب موجود نیست."}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-dark mb-4">دیدگاه‌های کاربران</h2>
          {productError && <p className="text-red-500 mb-4">{productError}</p>}
          {comments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    توسط: {comment.user?.email || "کاربر ناشناس"} -{" "}
                    {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-4">هنوز دیدگاهی برای این کتاب ثبت نشده است.</p>
          )}
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
            <textarea
              placeholder="دیدگاه خود را بنویسید..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary text-dark"
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all self-end shadow-md hover:shadow-lg"
            >
              ارسال دیدگاه
            </button>
          </form>
        </div>
        {relatedProducts && relatedProducts.length >= 2 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-dark mb-4">کتاب‌های پیشنهادی</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Benefits />
      <Footer />
    </div>
  );
}