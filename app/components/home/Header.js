"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaBook,
  FaStar,
  FaFlag,
  FaGraduationCap,
  FaFeatherAlt,
  FaAward,
  FaSignOutAlt,
  FaUserCog,
  FaUser,
  FaNewspaper,
} from "react-icons/fa";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { cart } = useCart();

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAdminClick = () => {
    if (status === "authenticated") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/auth/login";
    }
  };

  return (
    <header className="bg-background shadow-md">
      {/* هدر اصلی */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center border-b border-gray-200">
        {/* لوگو (سمت راست) */}
        <Link href="/">
          <Image
            src="/PersianLogo.png"
            alt="لوگوی بوکینو"
            width={200}
            height={60}
            className="object-contain"
          />
        </Link>

        {/* نوار جستجو (وسط) */}
        <div className="flex-1 mx-4 relative max-w-lg">
          <input
            type="text"
            placeholder="جستجوی کتاب‌ها..."
            className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-0 bg-white text-dark shadow-sm transition-all duration-300"
          />
          <FaSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark"
            size={20}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/cart"
                className="btn btn-link position-relative text-dark header-cart-link"
              >
                <FaShoppingCart size={22} className="text-dark" />
              </Link>
              <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
              سبد
              </span>
              {totalItems > 0 && (
                    <span
                      style={{ top: "80%" }}
                      className="bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center absolute -right-2 -top-2 text-xs font-bold"
                    >
                      {totalItems}
                    </span>
                  )}
            </div>
            
            <div className="relative group">
              <Link
                href={"/user"}
                className="text-dark hover:text-secondary flex items-center gap-2"
              >
                <FaUser size={22} className="text-dark" />
              </Link>
              <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                کاربر
              </span>
            </div>
            <div className="relative group">
              <button
                onClick={handleAdminClick}
                className="text-dark hover:text-secondary flex items-center gap-2"
              >
                <FaUserCog size={28} className="text-dark" />
              </button>
              <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                ادمین
              </span>
            </div>
            {status === "authenticated" ? (
              <div className="relative group">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-dark hover:text-secondary flex items-center gap-2"
                >
                  <FaSignOutAlt size={24} className="text-red-500" />
                </button>
                <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                  خروج
                </span>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary text-white px-4 py-1 rounded-lg hover:bg-secondary"
              >
                ورود/ثبت‌نام
              </Link>
            )}
          </div>
          <button className="md:hidden text-dark" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* منوی دایره‌ای (دسته‌بندی‌ها) */}
      <nav className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <li className="flex flex-col items-center">
              <Link
                href="/categories"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaBook size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">همه دسته‌ها</span>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="#"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaStar size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">پرفروش‌ها</span>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="#"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaFlag size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">زبان اصلی</span>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="#"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaGraduationCap size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">دانشگاهی</span>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="#"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaFeatherAlt size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">ادبیات داستانی</span>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="#"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaAward size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">جوایز ادبی</span>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="/blogs"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                <FaNewspaper size={20} />
              </Link>
              <span className="mt-2 text-sm text-dark">مقالات</span>
            </li>
          </ul>
        </div>
      </nav>

      {/* منوی موبایل */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-4 text-dark">
            {status === "authenticated" ? (
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full bg-primary text-white px-4 py-1 rounded-lg hover:bg-secondary flex items-center gap-2 justify-center"
                >
                  <FaSignOutAlt size={20} className="text-red-500" /> خروج
                </button>
                <hr className="border-t border-gray-200" />
              </li>
            ) : (
              <li>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 hover:text-secondary py-2"
                >
                  <FaUser /> ورود / ثبت نام
                </Link>
                <hr className="border-t border-gray-200" />
              </li>
            )}
            <li>
              <Link
                href="#"
                className="flex items-center gap-2 hover:text-secondary py-2"
              >
                <FaShoppingCart /> سبد خرید
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <button
                onClick={handleAdminClick}
                className="block hover:text-secondary py-2"
              >
                پنل ادمین
              </button>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="/categories" className="block hover:text-secondary py-2">
                همه دسته‌ها
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="#" className="block hover:text-secondary py-2">
                پرفروش‌ها
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="#" className="block hover:text-secondary py-2">
                زبان اصلی
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="#" className="block hover:text-secondary py-2">
                دانشگاهی
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="#" className="block hover:text-secondary py-2">
                ادبیات داستانی
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="#" className="block hover:text-secondary py-2">
                جوایز ادبی
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <Link href="/blogs" className="block hover:text-secondary py-2">
                مقالات
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}