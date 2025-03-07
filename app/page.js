import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="container bg-info">
      <h1 className=" text-white text-center pt-5 mb-2"> کتاب فروشی آنلاین </h1>
      <div className="d-flex">
        <Link href='/register' className="no-underline px-3 py-2 bg-white rounded m-1">ثبت نام</Link>
        <Link href='/admin' className="no-underline px-3 py-2 bg-white rounded m-1">ورود به پنل ادمین</Link>
      </div>
    </div>
  );
};

export default Home;
