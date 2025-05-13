import Link from "next/link";
import Image from "next/image";

export default function OrderSuccess() {
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

      <main className="min-h-screen bg-[#F0EBFF] flex flex-col items-center justify-center py-10 px-4">
        <div className="relative w-64 h-64 mb-8 animate-fadeIn">
          <Image
            src="/images/order-success.png"
            alt="سفارش موفق"
            fill
            className="object-contain"
          />
        </div>

        <h4 className="text-3xl sm:text-4xl font-bold text-[#1B1F3B] mb-4 animate-fadeIn">
          سفارش شما ثبت شد!
        </h4>
        <p className="text-gray-600 mb-8 text-center max-w-md text-lg sm:text-xl animate-fadeIn">
          ممنون از خرید شما! سفارش شما با موفقیت ثبت شد. می‌توانید جزئیات سفارش خود را مشاهده کنید یا به فروشگاه برگردید.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center animate-fadeIn">
          <Link
            href="/user"
            className="bg-[#7B61FF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#6A50E6] hover:shadow-lg transition-all duration-300 text-base sm:text-lg"
          >
            مشاهده جزئیات سفارش
          </Link>
          <Link
            href="/"
            className="bg-[#4BC0D9] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#3AA8C1] hover:shadow-lg transition-all duration-300 text-base sm:text-lg"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </main>
    </>
  );
}