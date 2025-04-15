import Link from "next/link";

export default function Categories({ categories }) {
  return (
    <section className="p-4 md:p-8 bg-background my-12">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-dark">دسته‌بندی‌ها</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link href={`/products?category=${category._id}`} key={category._id}>
            <div
              className="bg-white border border-purple-200 shadow-sm flex flex-col items-center justify-center text-dark rounded-lg p-4 transition-all duration-500 hover:border-secondary hover:shadow-md hover:-translate-y-2 hover:scale-105"
            >
              <p className="text-sm">{category.name}</p>
              <p className="text-xs text-gray-600">{category.description || "توضیحات دسته‌بندی"}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/categories" className="block mt-4 text-primary hover:text-secondary text-center text-sm">
        مشاهده همه ({categories.length} دسته‌بندی)
      </Link>
    </section>
  );
}