"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [active, setActive] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState(["pdf", "docx", "ppt", "png", "jpeg"]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [tags, setTags] = useState([""]);
  const [free, setFree] = useState(false);
  const [award, setAward] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setError("مشکلی در دریافت دسته بندی ها رخ داده است"));
  }, []);

  const handleAddFile = () => {
    setFiles([...files, null]); // Add a new empty file slot
  };

  const handleAddImage = () => {
    setImages([...images, null]); // Add a new empty image slot
  };

  const handleAddTag = () => {
    setTags([...tags, ""]); // Add a new empty tag slot
  };

  const handleFileChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
  };

  const handleImageChange = (index, image) => {
    const updatedImages = [...images];
    updatedImages[index] = image;
    setImages(updatedImages);
  };

  const handleTagChange = (index, tag) => {
    const updatedTags = [...tags];
    updatedTags[index] = tag;
    setTags(updatedTags);
  }

  const validateForm = () => {
    if (!files) {
      setFormError("انتخاب فایل محصول الزامی میباشد");
      return false;
    }
    if (!images) {
      setFormError("انتخاب تصویر محصول الزامی میباشد");
      return false;
    }
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
    if (!category) {
      setFormError("دسته بندی محصول باید باشد");
      return false;
    }
    if (!tags) {
      setFormError(" انتخاب حداقل یک برچسب برای محصول الزامی است");
      return false;
    }
    if (price <= 0) {
      setFormError(" قیمت محصول باید یک مقدار مثبت باشد در غیر اینصورت گزینه رایگان را تیک بزنید");
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
      formData.append("author", author);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("active", active ? "true" : "false");
      formData.append("category", category);
      formData.append("types", selectedTypes);
      formData.append("tags", tags.filter(tag => tag.trim() !== "")); // Filter out empty tags
      formData.append("free", free);
      formData.append("award", award);

      // Append all files
      files.forEach((file, index) => {
        if (file) formData.append("files", file);
      });

      // Append all images
      images.forEach((image, index) => {
        if (image) formData.append("images", image);
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }
      if (!response.ok) throw new Error("مشکلی در ساخت محصول پیش آمده است");
      router.push("/admin/products");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold  text-xl md:text-3xl">اضافه کردن محصول جدید</h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت محصول جدید اضافه کنید.</span>
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
                    <label className="text-gray-700 dark:text-gray-300">نویسنده</label>
                    <input
                      name="author"
                      autoComplete="author"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="نویسنده"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
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

                  {/* Multiple Images */}
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">تصاویر :</label>
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center gap-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(index, e.target.files[0])}
                          className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded px-4 py-2 w-full"
                        />
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-blue-500 text-white mx-3 px-4 py-2 rounded"
                      onClick={handleAddImage}
                    >
                      افزودن تصویر
                    </button>
                  </div>

                  {/* Multiple Files */}
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">فایل ها: </label>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-x-2">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                          className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded px-4 py-2 w-full"
                        />
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-blue-500 text-white mx-2 px-4 py-2 rounded"
                      onClick={handleAddFile}
                    >
                      افزودن فایل
                    </button>
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
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>

                  {/* Multiple tags */}
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">تگ ها : </label>

                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-x-2">
                        <input
                          type="text"
                          value={tag || ""}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                              setTimeout(() => {
                                // Focus on the newly added input field
                                const nextInput = document.querySelector(
                                  `input[name="tag-${tags.length}"]`
                                );
                                if (nextInput) nextInput.focus();
                              }, 0);
                            }
                          }}
                          name={`tag-${index}`} // Add a unique name for each input
                          className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded px-4 py-2 w-full"
                        />
                        <button
                          type="button"
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          onClick={handleAddTag}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>

                  <select
                    name="types"
                    autoComplete="types"
                    className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                    placeholder="دسته بندی"
                    type="text"
                    required
                    multiple
                    value={selectedTypes}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                      setSelectedTypes(selectedOptions); // Update state with selected options
                    }}
                    >
                    <option value="">انتخاب فرمت فایل ها </option>
                    {types.map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>

                  <label htmlFor="custom-switch" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="custom-switch" type="checkbox" className="sr-only" checked={active} onChange={(e) => setActive(e.target.checked)} />
                      <div className={`block w-10 h-5 rounded-full ${active ? "bg-blue-600" : "bg-gray-400"} transition-colors duration-300`}></div>
                      <div
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${active ? "transform translate-x-5" : ""
                          }`}></div>
                    </div>
                    <span className="ms-2 text-sm dark:text-white">{active ? "فعال" : "غیرفعال"}</span>
                  </label>

                  <label htmlFor="award-switch" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="award-switch" type="checkbox" className="sr-only" checked={award} onChange={(e) => setAward(e.target.checked)} />
                      <div className={`block w-10 h-5 rounded-full ${award ? "bg-blue-600" : "bg-gray-400"} transition-colors duration-300`}></div>
                      <div
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${award ? "transform translate-x-5" : ""
                          }`}></div>
                    </div>
                    <span className="ms-2 text-sm dark:text-white">{award ? "جایزه دار" : "غیر جایزه دار"}</span>
                  </label>

                  <label htmlFor="free-checkbox" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="free-checkbox" type="checkbox" className="sr-only" checked={free} onChange={(e) => setFree(e.target.checked)} />
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
                      افزودن
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

export default AddProduct;
