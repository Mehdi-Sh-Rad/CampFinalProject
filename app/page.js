import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-info">
      <h1 className=" text-white text-center pt-5 mb-2"> کتاب فروشی آنلاین </h1>
      <div className="d-flex">
        <Link href='/auth' className="no-underline px-3 py-2 bg-white rounded m-1">ورود / ثبت نام</Link>
        <Link href='/admin' className="no-underline px-3 py-2 bg-white rounded m-1">پنل ادمین</Link>
      </div>
    </div>
  );
};

export default Home;