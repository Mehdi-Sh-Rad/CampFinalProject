"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [tempDiscountPrice, setTempDiscountPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState(["pdf", "docx", "ppt", "png", "jpeg"]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [active, setActive] = useState("");
  const [category, setCategory] = useState("");
  const [free, setFree] = useState(false);
  const [award, setAward] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Fetch product and categories data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch(`/api/products/${id}`);
        const productData = await productResponse.json();
        if (!productResponse.ok) {
          setError(productData.message || "خطا در دریافت داده");
          setLoading(false);
          return;
        }
        setName(productData.name);
        setAuthor(productData.author);
        setDescription(productData.description);
        setFiles(productData.fileUrls);
        setImages(productData.imageUrls);
        setPrice(productData.price);
        setDiscountPrice(productData.discountPrice || "");
        setTempDiscountPrice(productData.discountPrice || "");
        setTags(Array.isArray(productData.tags) ? productData.tags : []); // Ensure tags is an array
        setSelectedTypes(productData.types);
        setActive(productData.active);
        setFree(productData.free);
        setAward(productData.award);
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

  // Automatically set free to true if price is 0
  useEffect(() => {
    if (parseFloat(price) === 0) {
      setFree(true);
    }
  }, [price]);

  // Toggle free checkbox
  const handleFreeToggle = () => {
    if (!free) {
      // switching to free
      setTempDiscountPrice(discountPrice);
      setDiscountPrice("");
      setPrice("0");
      setFree(true);
    } else {
      // switching off free
      setDiscountPrice(tempDiscountPrice);
      setFree(false);
    }
  };

  const handleAddFile = () => {
    setFiles([...files, null]); // Add a new empty file slot
  };

  const handleAddImage = () => {
    setImages([...images, null]); // Add a new empty image slot
  };

  const handleAddTag = () => {
    setTags([...tags, ""]); // Add a new empty tag slot
  };

  // Update file at specific index
  const handleFileChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
    console.log(files);
  };

  // Update image at specific index
  const handleImageChange = (index, image) => {
    console.log(images);
    const updatedImages = [...images];
    updatedImages[index] = image;
    setImages(updatedImages);
  };

  // Update tag at specific index
  const handleTagChange = (index, tag) => {
    const updatedTags = [...tags];
    updatedTags[index] = tag; // Update the specific tag
    setTags(updatedTags); // Update the state
  };

  // Validate form inputs
  const validateForm = () => {
    if (!files || files.length === 0 || files.every((file) => !file)) {
      setFormError("انتخاب حداقل یک فایل محصول الزامی است");
      return false;
    }
    if (!images || images.length === 0 || images.every((image) => !image)) {
      setFormError("انتخاب حداقل یک تصویر محصول الزامی است");
      return false;
    }
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    const nameRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,30}$/;
    if (!nameRegex.test(name)) {
      setError("نام میتواند شامل حروف ، اعداد و فاصله باشد");
    }

    if (!author || author.trim() === "") {
      setFormError("نام نویسنده الزامی است");
      return false;
    } else if (author.length < 3 || author.length > 50) {
      setFormError("نام نویسنده باید بین ۳ تا 5۰ کاراکتر باشد");
      return false;
    }

    const authorRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,50}$/;
    if (!authorRegex.test(author)) {
      setError("نام نویسنده میتواند شامل حروف ، اعداد و فاصله باشد");
    }

    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی میباشد");
      return false;
    } else if (description.length < 3 || description.length > 500) {
      setFormError("توضیحات محصول باید بین ۳ تا 500 باشد");
      return false;
    }

    const descriptionRegex = /^[a-zA-Z0-9\s\u0600-\u06FF]{3,500}$/;
    if (!descriptionRegex.test(description)) {
      setError("توضیحات محصول میتواند شامل حروف ، اعداد و فاصله باشد");
    }

    if (!category) {
      setFormError("دسته بندی محصول باید باشد");
      return false;
    }
    if (!tags || tags.length === 0 || tags.every((tag) => tag.trim() === "")) {
      setFormError("انتخاب حداقل یک برچسب برای محصول الزامی است");
      return false;
    }
    if (!free && (!price || parseFloat(price) <= 0)) {
      setFormError("قیمت محصول باید یک مقدار مثبت باشد یا گزینه رایگان را انتخاب کنید");
      return false;
    }
    if (discountPrice && parseFloat(discountPrice) >= parseFloat(price)) {
      setFormError("قیمت تخفیفی باید کمتر از قیمت اصلی باشد");
      return false;
    }

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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("author", author);
      formData.append("description", description);
      formData.append("price", free ? "0" : price);
      formData.append("discountPrice", free ? "" : discountPrice);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("types", selectedTypes);
      formData.append("active", active);
      formData.append("free", free);
      formData.append("award", award);

      // Append all files
      files.forEach((file) => {
        if (file) formData.append("files", file);
      });

      // Append all images
      images.forEach((image) => {
        if (image) formData.append("images", image);
      });

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh] bg-shop-bg dark:bg-[#171a26]">
        <div className="bg-white dark:bg-shop-dark rounded-lg p-6 shadow-xl shadow-[#112692]/5 flex flex-col items-center gap-y-4">
          <Image src="/logo-min.png" width={50} height={50} alt="logo" />
          <h3 className="text-shop-red dark:text-gray-200 flex gap-x-2 items-center border border-shop-red/30 rounded py-2 px-4">
            <svg className="dark:text-shop-red" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 10.5378C8 9.43327 8.89543 8.53784 10 8.53784H11.3333C12.4379 8.53784 13.3333 9.43327 13.3333 10.5378V19.8285C13.3333 20.9331 14.2288 21.8285 15.3333 21.8285H16C16 21.8285 12.7624 23.323 10.6667 22.9361C10.1372 22.8384 9.52234 22.5913 9.01654 22.3553C8.37357 22.0553 8 21.3927 8 20.6832V10.5378Z"
                fill="currentColor"
              />
              <path d="M13 3.5C13 2.11929 11.8807 1 10.5 1C9.11929 1 8 2.11929 8 3.5C8 4.88071 9.11929 6 10.5 6C11.8807 6 13 4.88071 13 3.5Z" fill="currentColor" />
            </svg>
            {error}
          </h3>
          <button
            onClick={() => router.back()}
            className="bg-shop-red text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-shop-red transition-all duration-300">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold  text-xl md:text-3xl">ویرایش محصول </h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">از این قسمت محصول انتخاب شده را ویرایش کنید.</span>
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
                  <div className="space-y-2">
                    <label className="text-gray-700 dark:text-gray-300">تصاویر :</label>
                    {images.map((image, index) => (
                      <div key={index} className="space-y-2 pb-5">
                        {/* Display the image name or preview */}
                        {typeof image === "string" ? (
                          <p className="text-gray-500 dark:text-gray-300">{image}</p> // Show the previously selected image name or URL
                        ) : (
                          image && (
                            <p className="text-gray-500 dark:text-gray-300">{image.name}</p> // Show the name of the newly selected file
                          )
                        )}
                        <div className="flex items-center gap-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                            className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded px-4 py-2 w-full"
                          />
                          <button type="button" className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => setImages(images.filter((_, i) => i !== index))}>
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="bg-blue-500 text-white mx-3 px-4 py-2 rounded" onClick={handleAddImage}>
                      افزودن تصویر
                    </button>
                  </div>

                  {/* Multiple Files */}
                  <div className="space-y-2">
                    <label className="text-gray-700 dark:text-gray-300">فایل ها :</label>
                    {files.map((file, index) => (
                      <div key={index} className="space-y-2 pb-5">
                        {/* Display the file name or preview */}
                        {typeof file === "string" ? (
                          <p className="text-gray-500 dark:text-gray-300">{file}</p> // Show the previously selected file name or URL
                        ) : (
                          file && (
                            <p className="text-gray-500 dark:text-gray-300">{file.name}</p> // Show the name of the newly selected file
                          )
                        )}
                        <div className="flex items-center gap-x-2">
                          <input
                            type="file"
                            accept="file/*"
                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                            className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded px-4 py-2 w-full"
                          />
                          <button type="button" className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="bg-blue-500 text-white mx-3 px-4 py-2 rounded" onClick={handleAddFile}>
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
                      value={free ? "0" : price}
                      disabled={free}
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
                      value={free ? "" : discountPrice}
                      disabled={free}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>

                  {/* Multiple tags */}
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">تگ ها : </label>
                    {/* <option value="" disabled> تگ های انتخاب شده: {tags.map(tg => ` ${tg}  `)}</option> */}
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-x-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                              setTimeout(() => {
                                // Focus on the newly added input field
                                const nextInput = document.querySelector(`input[name="tag-${tags.length}"]`);
                                if (nextInput) nextInput.focus();
                              }, 0);
                            }
                          }}
                          name={`tag-${index}`} // Add a unique name for each input
                          className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded px-4 py-2 w-full"
                        />
                        <button type="button" className="bg-green-500 text-white px-2 py-1 rounded" onClick={handleAddTag}>
                          +
                        </button>
                        <button type="button" className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => setTags(tags.filter((_, i) => i !== index))}>
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
                    multiple
                    value={selectedTypes}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                      setSelectedTypes(selectedOptions); // Update state with selected options
                    }}>
                    <option value="" disabled>
                      {" "}
                      فرمت های انتخاب شده: {selectedTypes.map((typ) => ` ${typ} `)}
                    </option>
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
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                          active ? "transform translate-x-5" : ""
                        }`}></div>
                    </div>
                    <span className="ms-2 text-sm dark:text-white">{active ? "فعال" : "غیرفعال"}</span>
                  </label>

                  <label htmlFor="award-switch" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="award-switch" type="checkbox" className="sr-only" checked={award} onChange={(e) => setAward(e.target.checked)} />
                      <div className={`block w-10 h-5 rounded-full ${award ? "bg-blue-600" : "bg-gray-400"} transition-colors duration-300`}></div>
                      <div
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                          award ? "transform translate-x-5" : ""
                        }`}></div>
                    </div>
                    <span className="ms-2 text-sm dark:text-white">{award ? "جایزه دار" : "غیر جایزه دار"}</span>
                  </label>

                  <label htmlFor="free-checkbox" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input id="free-checkbox" type="checkbox" className="sr-only" checked={free} onChange={handleFreeToggle} />
                      <div className={`block w-10 h-5 rounded-full ${free ? "bg-blue-600" : "bg-gray-400"} transition-colors duration-300`}></div>
                      <div
                        className={`dot absolute left-0 top-0 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                          free ? "transform translate-x-5" : ""
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
