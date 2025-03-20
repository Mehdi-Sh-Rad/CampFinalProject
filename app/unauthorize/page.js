import Link from "next/link";
import React from "react";

const Unauthorize = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-full bg-white dark:bg-shop-dark gap-y-6">
      <div className="flex flex-col items-center justify-center ">
        <span className="text-[7rem] font-bold text-shop-red dark:text-shop-bg">403</span>
        <h1 className="text-shop-dark font-bold dark:text-shop-red-light -mt-10">متاسفانه شما به این بخش دسترسی ندارید</h1>
      </div>

      <Link href={"/"} className="px-4 py-2 rounded-md font-bold bg-shop-red text-white dark:text-white dark:bg-shop-red">
        صفحه اصلی
      </Link>
    </div>
  );
};

export default Unauthorize;
