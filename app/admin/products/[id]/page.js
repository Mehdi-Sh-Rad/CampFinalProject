"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [currentFile, setCurrentFile] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [tags, setTags] = useState("");
  const [types, setTypes] = useState("");
  const [active, setActive] = useState("");
  const [category, setCategory] = useState("");
  const [free, setFree] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch(`/api/products/${id}`);
        const productData = await productResponse.json();
        setName(productData.name);
        setDescription(productData.description);
        setCurrentFile(productData.fileUrl);
        setCurrentImage(productData.imageUrl);
        setPrice(productData.price);
        setDiscountPrice(productData.discountPrice);
        setTags(productData.tags);
        setTypes(productData.types);
        setActive(productData.active);
        setFree(productData.free);
        setCategory(productData.category);

        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        setError("مشکلی در دریافت محصول پیش آمده است");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی میباشد");
      return false;
    } else if (description.length < 3 || description.length > 500) {
      setFormError("توضیحات محصول باید بین ۳ تا ۵۰۰ باشد");
      return false;
    }

    if (price <= 0) {
      setFormError("قیمت محصول باید یک مقدار مثبت باشد");
      return false;
    }
    if (discountPrice && discountPrice < 0) {
      setFormError("قیمت تخفیفی محصول باید یک مقدار مثبت باشد");
      return false;
    }
    if (discountPrice && discountPrice > price) {
      setFormError("قیمت تخفیفی باید کمتر از قیمت محصول باشد");
      return false;
    }
    if (!category) {
      setFormError("دسته بندی محصول باید باشد");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("discountPrice", discountPrice);
      formData.append("tags", tags);
      formData.append("types", types);
      formData.append("active", active);
      formData.append("free", free);

      if (image) {
        formData.append("image", image);
      }
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در ویرایش محصول پیش آمده است");
      router.push("/admin/products");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold  text-xl md:text-3xl">ویرایش محصول </h1>
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
                <h3 className="text-shop-red dark:text-gray-200 flex gap-x-2 items-center border border-shop-red/30 rounded py-1 px-2">
                  <svg className="dark:text-shop-red" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 10.5378C8 9.43327 8.89543 8.53784 10 8.53784H11.3333C12.4379 8.53784 13.3333 9.43327 13.3333 10.5378V19.8285C13.3333 20.9331 14.2288 21.8285 15.3333 21.8285H16C16 21.8285 12.7624 23.323 10.6667 22.9361C10.1372 22.8384 9.52234 22.5913 9.01654 22.3553C8.37357 22.0553 8 21.3927 8 20.6832V10.5378Z"
                      fill="currentColor"></path>
                    <path
                      d="M13 3.5C13 2.11929 11.8807 1 10.5 1C9.11929 1 8 2.11929 8 3.5C8 4.88071 9.11929 6 10.5 6C11.8807 6 13 4.88071 13 3.5Z"
                      fill="currentColor"></path>
                  </svg>
                  {error}
                </h3>
              )}
              {formError && <h3>{formError}</h3>}
              <form className="py-4" onSubmit={handleSubmit}>
                <div className="flex flex-col items-start gap-y-4 w-full">
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">نام</label>
                    <input
                      name="name"
                      autoComplete="name"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="نام"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">توضیحات</label>
                    <input
                      name="description"
                      autoComplete="description"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="توضیحات"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="relative w-full">
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      autoComplete="image"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />

                    <label
                      htmlFor="image-upload"
                      className="block cursor-pointer rounded border border-gray-200 bg-gray-100 px-4 py-2 text-center text-gray-700 dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 transition-all duration-300">
                      📂 تغییر تصویر
                    </label>
                    <span id="file-name" className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
                      {image ? image.name : currentImage}
                    </span>
                  </div>
                  <div className="relative w-full">
                    <input 
                    id="file-upload" 
                    name="file" type="file" 
                    accept="file/*" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="hidden" 
                    />
                    <label
                      htmlFor="file-upload"
                      className="block cursor-pointer rounded border border-gray-200 bg-gray-100 px-4 py-2 text-center text-gray-700 dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 transition-all duration-300">
                      📂 تغییر فایل
                    </label>
                    <span id="file-name" className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
                      {file ? file.name : currentFile}
                    </span>
                  </div>
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">قیمت</label>
                    <input
                      name="price"
                      autoComplete="price"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="قیمت"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">قیمت تخفیفی</label>
                    <input
                      name="discountPrice"
                      autoComplete="discountPrice"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="قیمت تخفیفی"
                      type="number"
                      value={discountPrice || ""}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300"> برچسب ها</label>
                    <input
                      name="tags"
                      autoComplete="tags"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="برچسب ها را با کاما از هم جدا کنید"
                      type="text"
                      value={tags || ""}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">فرمت فایل ها</label>
                    <input
                      name="types"
                      autoComplete="types"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="در صورت داشتن چندین فرمت آنها را با کاما از هم جدا کنید"
                      type="text"
                      value={types || ""}
                      onChange={(e) => setTypes(e.target.value)}
                    />
                  </div>
                  <label htmlFor="custom-switch" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="custom-switch" type="checkbox" className="sr-only" checked={active || ""} onChange={(e) => setActive(e.target.checked)} />
                      <div className={`block w-10 h-5 rounded-full ${active ? "bg-blue-600" : "bg-gray-400"} transition-colors duration-300`}></div>
                      <div
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${active ? "transform translate-x-5" : ""
                          }`}></div>
                    </div>
                    <span className="ms-2 text-sm dark:text-white">{active ? "فعال" : "غیرفعال"}</span>
                  </label>
                  <label htmlFor="free-checkbox" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="free-checkbox" type="checkbox" className="sr-only" checked={free || ""} onChange={(e) => setFree(e.target.checked)} />
                      <div className={`block w-10 h-5 rounded-full ${free ? "bg-blue-600" : "bg-gray-400"} transition-colors duration-300`}></div>
                      <div
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${free ? "transform translate-x-5" : ""
                          }`}></div>
                    </div>
                    <span className="ms-2 text-sm dark:text-white">{free ? "رایگان" : "غیررایگان"}</span>
                  </label>
                  <select
                    name="category"
                    autoComplete="category"
                    className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="دسته بندی"
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">انتخاب دسته بندی</option>
                    {categories.map((cat) => {
                      return (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      );
                    })}
                  </select>
                  <div>
                  <button type="submit" className="bg-green-500 text-white ml-3 py-2 px-4 rounded">
                    ویرایش
                  </button>
                  <Link href={"/admin/products"} className="bg-red-700 text-white py-2 px-4 rounded">
                    انصراف
                  </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default UpdateProduct;
