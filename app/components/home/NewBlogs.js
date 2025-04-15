import Link from "next/link";

export default function NewBlogs({ blogPosts }) {
  return (
    <section className="p-4 md:p-8 bg-background my-12">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-dark">تازه‌های مقالات</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {blogPosts.map((blogPost) => (
          <Link href={`/blogs/${blogPost._id}`} key={blogPost._id}>
            <div
              className="h-64 bg-white border border-purple-200 shadow-sm flex flex-col items-center justify-center text-dark rounded-lg p-4 transition-all duration-500 hover:border-secondary hover:shadow-md hover:-translate-y-2 hover:scale-105"
            >
              {blogPost.imageUrl ? (
                <img
                  src={blogPost.imageUrl}
                  alt={blogPost.title}
                  className="w-28 h-36 object-cover mb-2"
                  onError={(e) => (e.target.style.display = "none")} 
                />
              ) : (
                <div className="w-28 h-36 bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-gray-500">تصویر موجود نیست</span>
                </div>
              )}
              <p className="text-sm">{blogPost.title}</p>
              <p className="text-xs text-gray-600">
                {new Date(blogPost.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/blogs" className="block mt-4 text-primary hover:text-secondary text-center text-sm">
        مشاهده همه ({blogPosts.length} مقاله)
      </Link>
    </section>
  );
}