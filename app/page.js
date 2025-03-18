import React from "react";
import Link from "next/link";
import LogoutButton from "./components/auth/LogoutButton";

const Home = () => {
  return (
    <div className="bg-info">
      <h1 className="text-opacity-30 font-sans text-xl text-center pt-5 mb-2"> کتاب فروشی آنلاین </h1>
      <div className="d-flex">
        <Link href="/auth" className="no-underline px-5 py-2 rounded m-1 bg-slate-400">
          {" "}
          ورود / ثبت نام
        </Link>
        <Link href="/admin" className="no-underline px-3 py-2 rounded m-1 bg-slate-400">
          {" "}
          پنل ادمین
        </Link>
        <LogoutButton className="bg-shop-red text-white px-4 py-1 rounded-md" />
      </div>
    </div>
  );
};

export default Home;
