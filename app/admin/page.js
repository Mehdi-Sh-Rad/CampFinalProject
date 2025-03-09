import React from "react";
import Image from "next/image";

const AdminDashboard = () => {
  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">پنل ادمین</h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">پنل مدیریت برای مدیریت محتوای سایت، مشاهده آمار و انجام تنظیمات مختلف.</span>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header.png"}
          alt="هدر"
          width={1663}
          height={277}
        />
      </div>
      <div className="container py-4 px-10">
        <h1>صفحه اصلی</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
