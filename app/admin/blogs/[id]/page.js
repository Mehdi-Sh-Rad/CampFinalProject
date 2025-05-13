"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Link from "next/link";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const UpdateBlogPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBlogPostData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blogPosts/${id}`);
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setCurrentImage(data.imageUrl);
      } catch (error) {
        setError("مشکلی در دریافت مقاله پیش آمده است");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPostData();
  }, [id]);

  const validateForm = () => {
    if (!title || title.trim() === "") {
      setFormError("عنوان مقاله الزامی می‌باشد");
      return false;
    } else if (title.length < 3 || title.length > 100) {
      setFormError("عنوان باید بین ۳ تا ۱۰۰ کاراکتر باشد");
      return false;
    }

    if (!description || description.trim() === "") {
      setFormError("توضیحات مقاله الزامی می‌باشد");
      return false;
    } else if (description.length < 10 || description.length > 5000) {
      setFormError("توضیحات باید بین ۱۰ تا ۵۰۰۰ کاراکتر باشد");
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
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`/api/blogPosts/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در ویرایش مقاله پیش آمده است");
      router.push("/admin/blogs");
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
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">
            ویرایش مقاله
          </h1>
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
                  <svg
                    className="dark:text-shop-red"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 10.5378C8 9.43327 8.89543 8.53784 10 8.53784H11.3333C12.4379 8.53784 13.3333 9.43327 13.3333 10.5378V19.8285C13.3333 20.9331 14.2288 21.8285 15.3333 21.8285H16C16 21.8285 12.7624 23.323 10.6667 22.9361C10.1372 22.8384 9.52234 22.5913 9.01654 22.3553C8.37357 22.0553 8 21.3927 8 20.6832V10.5378Z"
                      fill="currentColor"
                    />
                    <path
                      d="M13 3.5C13 2.11929 11.8807 1 10.5 1C9.11929 1 8 2.11929 8 3.5C8 4.88071 9.11929 6 10.5 6C11.8807 6 13 4.88071 13 3.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  {error}
                </h3>
              )}
              {formError && <h3 className="text-red-500 mb-4">{formError}</h3>}
              <form className="py-4" onSubmit={handleSubmit}>
                <div className="flex flex-col items-start gap-y-4 w-full">
                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">
                      عنوان
                    </label>
                    <input
                      name="title"
                      autoComplete="title"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="عنوان"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-gray-700 dark:text-gray-300">
                      توضیحات
                    </label>
                    <textarea
                      name="description"
                      autoComplete="description"
                      className="focus:outline-none border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 border-gray-200 rounded px-4 py-2 w-full focus:ring-2 focus:ring-shop-red transition-all duration-300"
                      placeholder="توضیحات"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="5"
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
                      className="block cursor-pointer rounded border border-gray-200 bg-gray-100 px-4 py-2 text-center text-gray-700 dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 transition-all duration-300"
                    >
                      📂 تغییر تصویر
                    </label>
                    <span
                      id="file-name"
                      className="mt-2 block text-sm text-gray-500 dark:text-gray-400"
                    >
                      {image ? image.name : currentImage || "بدون تصویر"}
                    </span>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-green-500 text-white ml-3 py-2 px-4 rounded"
                    >
                      ویرایش
                    </button>
                    <Link
                      href={"/admin/blogs"}
                      className="bg-red-700 text-white py-2 px-4 rounded"
                    >
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

export default UpdateBlogPost;