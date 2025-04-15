"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/home/Header";
import Benefits from "../../components/home/Benefits";
import Footer from "../../components/home/Footer";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function BlogDetail() {
  const [blogPost, setBlogPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const params = useParams();
  const blogId = params?.id;

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const res = await fetch(`/api/blogPosts/${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        });
        if (!res.ok) throw new Error("خطا در گرفتن مقاله");
        const fetchedBlogPost = await res.json();
        setBlogPost(fetchedBlogPost);

        const relatedRes = await fetch(`/api/blogPosts?exclude=${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        });
        if (!relatedRes.ok) throw new Error("خطا در گرفتن مقالات پیشنهادی");
        const fetchedRelatedPosts = await relatedRes.json();
        setRelatedPosts(fetchedRelatedPosts);
      } catch (err) {
        setError(err.message);
      }
    };

    if (blogId) {
      fetchBlogPost();
    }
  }, [blogId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?productId=${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        });
        if (!res.ok) throw new Error("خطا در گرفتن دیدگاه‌ها");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setError("برای ثبت دیدگاه باید وارد حساب کاربری خود شوید.");
      return;
    }

    if (!newComment.trim()) {
      setError("لطفاً متن دیدگاه را وارد کنید.");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          text: newComment,
          user: session.user.id,
          product: blogId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const newCommentData = await res.json();
      setComments([newCommentData, ...comments]);
      setNewComment("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center p-4 text-red-500">مقاله یافت نشد</div>
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
            {blogPost.imageUrl ? (
              <Image
                src={blogPost.imageUrl}
                alt={blogPost.title}
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
            <h1 className="text-2xl font-bold text-dark mb-3">
              {blogPost.title}
            </h1>
            <div className="space-y-1 mb-3 text-sm">
              <p className="text-gray-600">
                تاریخ انتشار:{" "}
                <span className="text-dark">
                  {new Date(blogPost.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </p>
            </div>
            <p className="text-gray-600 mb-3">{blogPost.description}</p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-all shadow-md hover:shadow-lg">
              ادامه مطلب
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-dark mb-4">متن مقاله</h2>
          <p className="text-gray-600 leading-relaxed">
            {blogPost.description || "متن کامل مقاله در دسترس نیست."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-dark mb-4">
            دیدگاه‌های کاربران
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {comments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 pb-4"
                >
                  <p className="text-gray-600">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    توسط: {comment.user?.email || "کاربر ناشناس"} -{" "}
                    {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-4">
              هنوز دیدگاهی برای این مقاله ثبت نشده است.
            </p>
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

        {relatedPosts && relatedPosts.length >= 2 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-dark mb-4">
              مقالات پیشنهادی
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <Link href={`/blogs/${relatedPost._id}`}>
                    <div className="relative w-full h-48">
                      {relatedPost.imageUrl ? (
                        <Image
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                          <span className="text-gray-500">
                            تصویر موجود نیست
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/blogs/${relatedPost._id}`}>
                      <h2 className="text-lg font-semibold text-dark mb-2 hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {relatedPost.description}
                    </p>
                    <Link
                      href={`/blogs/${relatedPost._id}`}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-all text-center block"
                    >
                      ادامه مطلب
                    </Link>
                  </div>
                </div>
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
