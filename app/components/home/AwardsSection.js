import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

export default function AwardsSection({ awards, totalAwards, id }) {
  return (
    <section id={id} className="p-4 md:p-8 bg-background my-12">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-dark">
        جوایز و پرفروش‌ها
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {awards.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Link
        href="/products/awards"
        className="block mt-4 text-primary hover:text-secondary text-center text-sm"
      >
        مشاهده همه ({totalAwards} کتاب)
      </Link>
    </section>
  );
}