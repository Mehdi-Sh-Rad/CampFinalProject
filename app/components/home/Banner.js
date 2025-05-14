"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

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
            <a
              href={banner.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Image
                src={banner.image || "https://via.placeholder.com/1200x400?text=Placeholder+Image"}
                alt={banner.description || "بنر"}
                width={1200}
                height={200}
                className="w-full object-cover banner-image"
              />
            </a>
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
        .banner-image {
          min-height: 200px !important;
          height: 200px !important;
          object-fit: cover !important;
        }
      `}</style>
    </section>
  );
}