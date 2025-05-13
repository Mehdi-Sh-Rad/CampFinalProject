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
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function ProductDetail() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, error } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [productError, setProductError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const params = useParams();
  const productId = params?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("خطا در گرفتن محصول");
        const fetchedProduct = await res.json();
        setProduct(fetchedProduct);
        if (fetchedProduct.imageUrls && fetchedProduct.imageUrls.length > 0) {
          setSelectedImage(fetchedProduct.imageUrls[0]);
          setSelectedImageIndex(0);
        }

        const relatedRes = await fetch(
          `/api/products?category=${fetchedProduct.category}&exclude=${productId}`
        );
        if (!relatedRes.ok) throw new Error("خطا در گرفتن محصولات پیشنهادی");
        const fetchedRelatedProducts = await relatedRes.json();
        setRelatedProducts(fetchedRelatedProducts);
      } catch (err) {
        setProductError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comments?productId=${productId}`);
        if (!res.ok) throw new Error("خطا در گرفتن دیدگاه‌ها");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setProductError(err.message);
      } finally {
        setLoading(false);
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

  useEffect(() => {
    if (!product) return;

    const key = `viewed_${product._id}`;
    const last = localStorage.getItem(key);
    const now = Date.now();

    if (!last || now - parseInt(last, 10) > 1000 * 60 * 60 * 24) {
      fetch("/api/products/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      }).catch(console.error);

      localStorage.setItem(key, now.toString());
    }
  }, [product]);

  const handlePrevImage = () => {
    if (!product || !product.imageUrls || product.imageUrls.length <= 1) return;
    const newIndex = (selectedImageIndex - 1 + product.imageUrls.length) % product.imageUrls.length;
    setSelectedImageIndex(newIndex);
    setSelectedImage(product.imageUrls[newIndex]);
  };

  const handleNextImage = () => {
    if (!product || !product.imageUrls || product.imageUrls.length <= 1) return;
    const newIndex = (selectedImageIndex + 1) % product.imageUrls.length;
    setSelectedImageIndex(newIndex);
    setSelectedImage(product.imageUrls[newIndex]);
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
          <div className="md:w-1/3 w-full flex flex-col items-center">
            {selectedImage ? (
              <div className="flex items-center justify-center mb-4">
                {/* دکمه فلش چپ کنار تصویر بزرگ */}
                {product.imageUrls && product.imageUrls.length > 1 && (
                  <button
                    className="flex-shrink-0 text-[#7B61FF] hover:text-[#6A50E6] p-1 rounded-full transition-all mr-4 shadow-md hover:shadow-lg"
                    onClick={handlePrevImage} // فلش چپ برای تصویر قبلی
                  >
                    <FaArrowRight size={24} />
                  </button>
                )}

                {/* تصویر بزرگ */}
                <div
                  className="relative w-[200px] h-[280px] sm:w-[250px] sm:h-[350px] cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-contain rounded-md shadow-md"
                  />
                </div>

                {/* دکمه فلش راست کنار تصویر بزرگ */}
                {product.imageUrls && product.imageUrls.length > 1 && (
                  <button
                    className="flex-shrink-0 text-[#7B61FF] hover:text-[#6A50E6] p-1 rounded-full transition-all ml-4 shadow-md hover:shadow-lg"
                    onClick={handleNextImage} // فلش راست برای تصویر بعدی
                  >
                    <FaArrowLeft size={24} />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-[200px] h-[280px] sm:w-[250px] sm:h-[350px] bg-gray-200 flex items-center justify-center rounded-md mb-4">
                <span className="text-gray-500">تصویر موجود نیست</span>
              </div>
            )}

            {/* گالری تصاویر کوچک */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 w-full">
                {product.imageUrls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 cursor-pointer rounded-md border-2 ${
                      selectedImage === imageUrl ? "border-primary" : "border-gray-300"
                    } flex-shrink-0`}
                    onClick={() => {
                      setSelectedImage(imageUrl);
                      setSelectedImageIndex(index);
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - تصویر ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold text-dark mb-3">{product.name}</h1>
            <div className="space-y-1 mb-3 text-sm">
              <p className="text-gray-600">
                نویسنده: <span className="text-dark">{product.author}</span>
              </p>
              <p className="text-gray-600">
                دسته‌بندی:{" "}
                <Link href="#" className="text-primary hover:underline">
                  {product.category?.name || "نامشخص"}
                </Link>
              </p>
              {product.types && product.types.length > 0 && (
                <p className="text-gray-600">
                  نوع: <span className="text-dark">{product.types.join(", ")}</span>
                </p>
              )}
              {product.tags && product.tags.length > 0 && (
                <p className="text-gray-600">
                  تگ‌ها: <span className="text-dark">{product.tags.join(", ")}</span>
                </p>
              )}
              <p className="text-gray-600">
                رایگان: <span className="text-dark">{product.free ? "بله" : "خیر"}</span>
              </p>
            </div>
            {product.discountPrice ? (
              <section>
                <p className="text-xl line-through font-semibold text-gray-500 mb-2">
                  {product.price.toLocaleString()} تومان
                </p>
                <p className="text-sm text-red-500 mb-10">
                  قیمت با تخفیف: {product.discountPrice.toLocaleString()} تومان
                </p>
              </section>
            ) : (
              <p className="text-xl font-semibold text-dark mb-6">
                {product.price.toLocaleString()} تومان
              </p>
            )}
            <AddToCartButton productId={product._id} />
          </div>
        </div>

        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsLightboxOpen(false);
              }
            }}
          >
            <div className="relative flex items-center justify-center w-full max-w-4xl h-[80vh] p-4">
              {/* دکمه فلش چپ (کنار تصویر) */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <button
                  className="flex-shrink-0 text-white text-2xl bg-[#7B61FF] hover:bg-[#6A50E6] p-1 rounded-full transition-all mr-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage(); // فلش چپ برای تصویر قبلی
                  }}
                >
                  <FaArrowRight />
                </button>
              )}

              {/* تصویر بزرگ */}
              <div className="relative w-full max-w-3xl h-full">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
                {/* شماره تصویر */}
                {product.imageUrls && product.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1B1F3B] text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {product.imageUrls.length}
                  </div>
                )}
              </div>

              {/* دکمه فلش راست (کنار تصویر) */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <button
                  className="flex-shrink-0 text-white text-2xl bg-[#7B61FF] hover:bg-[#6A50E6] p-1 rounded-full transition-all ml-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage(); // فلش راست برای تصویر بعدی
                  }}
                >
                  <FaArrowLeft />
                </button>
              )}

              {/* دکمه بستن */}
              <button
                className="absolute top-4 right-4 text-white text-3xl"
                onClick={() => setIsLightboxOpen(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-dark mb-4">توضیحات کتاب</h2>
          <p className="text-gray-600 leading-relaxed">
            {product.description || "توضیحاتی برای این کتاب موجود نیست."}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-dark mb-4">دیدگاه‌های کاربران</h2>
          {productError && <p className="text-red-500 mb-4">{productError}</p>}
          {comments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {comments.map((comment) =>
                comment.status && (
                  <div key={comment._id} className="border-b border-gray-200 pb-4">
                    <p className="text-gray-600">{comment.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      توسط: {comment.user?.name || "کاربر ناشناس"} -{" "}
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                )
              )}
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
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
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