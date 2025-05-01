import Link from "next/link";
import Image from "next/image";

export default function EmptyCart() {
  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s ease-in-out forwards;
        }
      `}</style>

      <main className="min-h-screen bg-background flex flex-col items-center justify-center py-10 px-4">
        <div className="relative w-64 h-64 mb-8 animate-fadeIn">
          <Image
            src="/images/empty-cart.png"
            alt="سبد خرید خالی"
            fill
            className="object-contain"
          />
        </div>

        <h4 className="text-3xl sm:text-4xl font-bold text-dark mb-4 animate-fadeIn">
          سبد خرید خالی!
        </h4>
        <p className="text-gray-600 mb-8 text-center max-w-md text-lg sm:text-xl animate-fadeIn">
          هیچ محصولی در سبد خرید شما نیست. با گشت‌وگذار در بین محصولات، سبد خود
          رو پر کنید و خرید آنلاین رو تجربه کنید.
        </p>

        <Link
          href="/"
          className="bg-primary text-white px-8 py-4 rounded-lg shadow-md hover:bg-secondary hover:shadow-lg transition-all duration-300 text-lg animate-fadeIn"
        >
          بازگشت به فروشگاه
        </Link>
      </main>
    </>
  );
}