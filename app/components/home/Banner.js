"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Banner({ banners }) {
  return (
    <section className="text-center p-4 md:p-8 relative my-12">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full custom-swiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full"
              style={{
                backgroundImage: `url(${banner.image || "https://via.placeholder.com/1200x400?text=Placeholder+Image"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "400px",
              }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-background bg-opacity-80 p-4 md:p-6 rounded-md shadow-md">
                  <h2 className="text-xl md:text-3xl font-bold mb-2 text-dark">{banner.title}</h2>
                  <p className="text-base md:text-lg mb-2 text-gray-600">{banner.subtitle}</p>
                  <p className="text-lg md:text-xl mb-4 text-red-500 font-handwritten">{banner.extra}</p>
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">
                    مشاهده تخفیف‌ها
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .custom-swiper .swiper-pagination-bullet {
          background: #d1d5db !important;
          opacity: 0.7 !important;
        }
        .custom-swiper .swiper-pagination-bullet-active {
          background: #7B61FF !important;
          opacity: 1 !important;
        }
        .custom-swiper .swiper-button-next,
        .custom-swiper .swiper-button-prev {
          color: #7B61FF !important;
        }
        .custom-swiper .swiper-button-next:hover,
        .custom-swiper .swiper-button-prev:hover {
          color: #4BC0D9 !important;
        }
      `}</style>
    </section>
  );
}