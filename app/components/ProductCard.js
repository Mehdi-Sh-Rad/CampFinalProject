import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./home/AddToCartButton";

export default function ProductCard({ product, showCategory = false, showButton = true }) {
  return (
    <div
      className="bg-white border border-purple-100 rounded-xl shadow-sm transition-all duration-500 hover:border-secondary hover:shadow-md hover:-translate-y-2 hover:scale-105"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative w-full h-36">
          {product.imageUrls ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          ) : (
            <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-t-lg">
              <span className="text-gray-500">تصویر موجود نیست</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 text-center">
        <Link href={`/products/${product._id}`}>
          <h2 className="text-sm font-semibold text-dark mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-xs text-gray-600 mb-1">{product.author}</p>
        {showCategory && (
          <p className="text-xs text-gray-600 mb-2">
            دسته‌بندی: {product.category ? product.category.name : "نامشخص"}
          </p>
        )}
        <div className="flex justify-center items-center gap-2 mb-2">
          <p
            className={`text-sm font-bold ${product.discountPrice ? "line-through text-gray-500" : "text-dark"
              }`}
          >
            {product.price.toLocaleString()} تومان
          </p>
          {product.discountPrice && (
            <p className="text-sm font-bold text-red-500">
              {product.discountPrice.toLocaleString()} تومان
            </p>
          )}
        </div>
        {showButton && (
          <AddToCartButton productId={product._id} />
        )}
      </div>
    </div>
  );
}