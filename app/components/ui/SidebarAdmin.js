"use client";
import Link from "next/link";
import { useSidebar } from "@/app/context/SidebarContext";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import LogoutButton from "../auth/LogoutButton";
import { useTheme } from "@/app/context/ThemeContext";

const Sidebar = () => {
  const pathName = usePathname();
  const {isDarkMode} = useTheme();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={` px-4 py-4 w-full dark:bg-shop-dark min-h-[100vh] relative bg-white shadow-md transition-all duration-500 ease-in-out ${
        !isSidebarOpen ? "max-w-[76px]" : "max-w-[260px]"
      }`}>
      <button className="absolute -left-3 top-8 bg-shop-red rounded-full text-white" onClick={toggleSidebar}>
        <svg
          className={`transition-transform duration-500 ${!isSidebarOpen && "rotate-180"}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24">
          <path d="M19.75 11.7256L4.75 11.7256" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.7002 5.70124L19.7502 11.7252L13.7002 17.7502" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex justify-center items-center border-b border-b-[#E9ECEF] py-4">
        <Link className={`flex justify-center items-center`} href={"/admin"}>
          <Image
            className={`transition-all duration-500 ${!isSidebarOpen ? "hidden opacity-0" : "opacity-100"}`}
            src={isDarkMode ? "/logo-panel-white.png" : "/logo-panel.png"}
            height={40}
            width={195}
            alt="لوگو فروشگاه"
          />
          <Image
            className={`transition-all duration-500 ${isSidebarOpen ? "hidden opacity-0" : "opacity-100"}`}
            src={isDarkMode ? "/logo-min-white.png" : "/logo-min.png"}
            height={35}
            width={35}
            alt="لوگو فروشگاه"
          />
        </Link>
      </div>
      <nav className=" py-6">
        <ul className="flex flex-col gap-y-0.5">
          <Link className="" href={"/admin"}>
            <li
              className={`flex ${
                pathName == "/admin"
                  ? "bg-shop-red"
                  : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] dark:hover:text-white transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName == "/admin" ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  opacity="0.4"
                  d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z"
                  fill="currentColor"></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z"
                  fill="currentColor"></path>
              </svg>

              <span
                className={`${pathName == "/admin" ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"} ${
                  !isSidebarOpen ? "hidden" : ""
                }`}>
                پیشخــــوان
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  پیشخوان{" "}
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/categories"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/categories")
                  ? "bg-shop-red"
                  : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e]  transition-all group relative duration-300"
              }  ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/categories") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  opacity="0.4"
                  d="M10.0833 15.958H3.50777C2.67555 15.958 2 16.6217 2 17.4393C2 18.2559 2.67555 18.9207 3.50777 18.9207H10.0833C10.9155 18.9207 11.5911 18.2559 11.5911 17.4393C11.5911 16.6217 10.9155 15.958 10.0833 15.958Z"
                  fill="currentColor"></path>
                <path
                  opacity="0.4"
                  d="M22.0001 6.37867C22.0001 5.56214 21.3246 4.89844 20.4934 4.89844H13.9179C13.0857 4.89844 12.4102 5.56214 12.4102 6.37867C12.4102 7.1963 13.0857 7.86 13.9179 7.86H20.4934C21.3246 7.86 22.0001 7.1963 22.0001 6.37867Z"
                  fill="currentColor"></path>
                <path
                  d="M8.87774 6.37856C8.87774 8.24523 7.33886 9.75821 5.43887 9.75821C3.53999 9.75821 2 8.24523 2 6.37856C2 4.51298 3.53999 3 5.43887 3C7.33886 3 8.87774 4.51298 8.87774 6.37856Z"
                  fill="currentColor"></path>
                <path
                  d="M21.9998 17.3992C21.9998 19.2648 20.4609 20.7777 18.5609 20.7777C16.6621 20.7777 15.1221 19.2648 15.1221 17.3992C15.1221 15.5325 16.6621 14.0195 18.5609 14.0195C20.4609 14.0195 21.9998 15.5325 21.9998 17.3992Z"
                  fill="currentColor"></path>
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/categories") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                دســــته بنـــــدی ها
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  دسته بندی ها
                </span>
              )}
            </li>
          </Link>

          <Link className=" " href={"/admin/products"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/products") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/products") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.9133 16.3147L20.1444 10.1201C19.676 7.90964 18.3503 7 17.0865 7H6.93171C5.65022 7 4.28034 7.84597 3.88264 10.1201L3.1049 16.3147C2.46858 20.8629 4.81062 22 7.86853 22H16.1585C19.2075 22 21.4789 20.3535 20.9133 16.3147ZM9.097 12.1486C8.60889 12.1486 8.21321 11.7413 8.21321 11.2389C8.21321 10.7366 8.60889 10.3293 9.097 10.3293C9.5851 10.3293 9.98079 10.7366 9.98079 11.2389C9.98079 11.7413 9.5851 12.1486 9.097 12.1486ZM14.002 11.2389C14.002 11.7413 14.3977 12.1486 14.8858 12.1486C15.3739 12.1486 15.7696 11.7413 15.7696 11.2389C15.7696 10.7366 15.3739 10.3293 14.8858 10.3293C14.3977 10.3293 14.002 10.7366 14.002 11.2389Z"
                  fill="currentColor"></path>
                <path
                  opacity="0.4"
                  d="M16.9739 6.77432C16.977 6.85189 16.9621 6.92913 16.9303 7H15.4932C15.4654 6.92794 15.4506 6.85153 15.4497 6.77432C15.4497 4.85682 13.8899 3.30238 11.9657 3.30238C10.0416 3.30238 8.48184 4.85682 8.48184 6.77432C8.49502 6.84898 8.49502 6.92535 8.48184 7H7.00989C6.9967 6.92535 6.9967 6.84898 7.00989 6.77432C7.12172 4.10591 9.32499 2 12.0049 2C14.6849 2 16.8882 4.10591 17 6.77432H16.9739Z"
                  fill="currentColor"></path>
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/products") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                محـصــــولات
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  محصولات
                </span>
              )}
            </li>
          </Link>

          <Link className="" href={"/admin/discounts"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/discounts") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/discounts") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="20">
                <circle cx="6" cy="6" r="3" fill="currentColor" />
                <circle cx="18" cy="18" r="3" fill="currentColor" />
                <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/discounts") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                کدهای تخفیف
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  کدهای تخفیف
                </span>
              )}
            </li>
          </Link>

          <Link className=" " href={"/admin/comments"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/comments") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/comments") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  opacity="0.4"
                  d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83V17.16C3 20.26 4.77 22 7.81 22H16.191C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2Z"
                  fill="currentColor"></path>{" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.07996 6.6499V6.6599C7.64896 6.6599 7.29996 7.0099 7.29996 7.4399C7.29996 7.8699 7.64896 8.2199 8.07996 8.2199H11.069C11.5 8.2199 11.85 7.8699 11.85 7.4289C11.85 6.9999 11.5 6.6499 11.069 6.6499H8.07996ZM15.92 12.7399H8.07996C7.64896 12.7399 7.29996 12.3899 7.29996 11.9599C7.29996 11.5299 7.64896 11.1789 8.07996 11.1789H15.92C16.35 11.1789 16.7 11.5299 16.7 11.9599C16.7 12.3899 16.35 12.7399 15.92 12.7399ZM15.92 17.3099H8.07996C7.77996 17.3499 7.48996 17.1999 7.32996 16.9499C7.16996 16.6899 7.16996 16.3599 7.32996 16.1099C7.48996 15.8499 7.77996 15.7099 8.07996 15.7399H15.92C16.319 15.7799 16.62 16.1199 16.62 16.5299C16.62 16.9289 16.319 17.2699 15.92 17.3099Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/comments") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                مدیریت نظرات
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت نظرات
                </span>
              )}
            </li>
          </Link>

          <Link className=" " href={"/admin/productQuestions"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/productQuestions")
                  ? "bg-shop-red"
                  : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/productQuestions") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  opacity="0.4"
                  d="M16.6643 21.9897H7.33488C5.88835 22.0796 4.46781 21.5781 3.3989 20.6011C2.4219 19.5312 1.92041 18.1107 2.01032 16.6652V7.33482C1.92041 5.88932 2.4209 4.46878 3.3979 3.39889C4.46781 2.42189 5.88835 1.92041 7.33488 2.01032H16.6643C18.1089 1.92041 19.5284 2.4209 20.5973 3.39789C21.5733 4.46878 22.0758 5.88832 21.9899 7.33482V16.6652C22.0788 18.1107 21.5783 19.5312 20.6013 20.6011C19.5314 21.5781 18.1109 22.0796 16.6643 21.9897Z"
                  fill="currentColor"></path>{" "}
                <path
                  d="M17.0545 10.3976L10.5018 16.9829C10.161 17.3146 9.7131 17.5 9.24574 17.5H6.95762C6.83105 17.5 6.71421 17.4512 6.62658 17.3634C6.53895 17.2756 6.5 17.1585 6.5 17.0317L6.55842 14.7195C6.56816 14.261 6.75315 13.8317 7.07446 13.5098L11.7189 8.8561C11.7967 8.77805 11.9331 8.77805 12.011 8.8561L13.6399 10.4785C13.747 10.5849 13.9028 10.6541 14.0683 10.6541C14.4286 10.6541 14.7109 10.3615 14.7109 10.0102C14.7109 9.83463 14.6428 9.67854 14.5357 9.56146C14.5065 9.52244 12.9554 7.97805 12.9554 7.97805C12.858 7.88049 12.858 7.71463 12.9554 7.61707L13.6078 6.95366C14.2114 6.34878 15.1851 6.34878 15.7888 6.95366L17.0545 8.22195C17.6485 8.81707 17.6485 9.79268 17.0545 10.3976Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/productQuestions")
                    ? "text-white font-bold"
                    : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                سوالات محصول
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  سوالات محصول
                </span>
              )}
            </li>
          </Link>

          <Link className=" " href={"/admin/frequentQuestions"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/frequentQuestions")
                  ? "bg-shop-red"
                  : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/frequentQuestions") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  opacity="0.4"
                  d="M16.34 1.99976H7.67C4.28 1.99976 2 4.37976 2 7.91976V16.0898C2 19.6198 4.28 21.9998 7.67 21.9998H16.34C19.73 21.9998 22 19.6198 22 16.0898V7.91976C22 4.37976 19.73 1.99976 16.34 1.99976Z"
                  fill="currentColor"></path>{" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1246 8.18921C11.1246 8.67121 11.5156 9.06421 11.9946 9.06421C12.4876 9.06421 12.8796 8.67121 12.8796 8.18921C12.8796 7.70721 12.4876 7.31421 12.0046 7.31421C11.5196 7.31421 11.1246 7.70721 11.1246 8.18921ZM12.8696 11.362C12.8696 10.88 12.4766 10.487 11.9946 10.487C11.5126 10.487 11.1196 10.88 11.1196 11.362V15.782C11.1196 16.264 11.5126 16.657 11.9946 16.657C12.4766 16.657 12.8696 16.264 12.8696 15.782V11.362Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/frequentQuestions")
                    ? "text-white font-bold"
                    : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                سوالات متداول
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  سوالات متداول
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/payments"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/payments") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/payments") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  opacity="0.4"
                  d="M16.3405 1.99976H7.67049C4.28049 1.99976 2.00049 4.37976 2.00049 7.91976V16.0898C2.00049 19.6198 4.28049 21.9998 7.67049 21.9998H16.3405C19.7305 21.9998 22.0005 19.6198 22.0005 16.0898V7.91976C22.0005 4.37976 19.7305 1.99976 16.3405 1.99976Z"
                  fill="currentColor"></path>{" "}
                <path
                  d="M10.8134 15.248C10.5894 15.248 10.3654 15.163 10.1944 14.992L7.82144 12.619C7.47944 12.277 7.47944 11.723 7.82144 11.382C8.16344 11.04 8.71644 11.039 9.05844 11.381L10.8134 13.136L14.9414 9.00796C15.2834 8.66596 15.8364 8.66596 16.1784 9.00796C16.5204 9.34996 16.5204 9.90396 16.1784 10.246L11.4324 14.992C11.2614 15.163 11.0374 15.248 10.8134 15.248Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/payments") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                مدیریت پرداخت ها
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت پرداخت ها
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/tickets"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/tickets") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/tickets") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67942 6.9293 2.16342 7.5063 2.02442 8.2383C1.88242 8.9843 2.37842 9.9323 3.02642 10.3283L8.05742 13.4003C8.57342 13.7163 9.23942 13.6373 9.66642 13.2093L15.4274 7.4483C15.7174 7.1473 16.1974 7.1473 16.4874 7.4483C16.7774 7.7373 16.7774 8.2083 16.4874 8.5083L10.7164 14.2693C10.2884 14.6973 10.2084 15.3613 10.5234 15.8783L13.5974 20.9283C13.9574 21.5273 14.5774 21.8683 15.2574 21.8683C15.3374 21.8683 15.4274 21.8683 15.5074 21.8573C16.2874 21.7583 16.9074 21.2273 17.1374 20.4773L21.9074 4.5083C22.1174 3.8283 21.9274 3.0883 21.4274 2.5783Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.01049 16.8079C2.81849 16.8079 2.62649 16.7349 2.48049 16.5879C2.18749 16.2949 2.18749 15.8209 2.48049 15.5279L3.84549 14.1619C4.13849 13.8699 4.61349 13.8699 4.90649 14.1619C5.19849 14.4549 5.19849 14.9299 4.90649 15.2229L3.54049 16.5879C3.39449 16.7349 3.20249 16.8079 3.01049 16.8079ZM6.77169 18.0003C6.57969 18.0003 6.38769 17.9273 6.24169 17.7803C5.94869 17.4873 5.94869 17.0133 6.24169 16.7203L7.60669 15.3543C7.89969 15.0623 8.37469 15.0623 8.66769 15.3543C8.95969 15.6473 8.95969 16.1223 8.66769 16.4153L7.30169 17.7803C7.15569 17.9273 6.96369 18.0003 6.77169 18.0003ZM7.02539 21.5683C7.17139 21.7153 7.36339 21.7883 7.55539 21.7883C7.74739 21.7883 7.93939 21.7153 8.08539 21.5683L9.45139 20.2033C9.74339 19.9103 9.74339 19.4353 9.45139 19.1423C9.15839 18.8503 8.68339 18.8503 8.39039 19.1423L7.02539 20.5083C6.73239 20.8013 6.73239 21.2753 7.02539 21.5683Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/tickets") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                مدیریت تیکت ها
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت تیکت ها
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/users"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/users") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/users") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z"
                  fill="currentColor"></path>{" "}
                <path
                  d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z"
                  fill="currentColor"></path>{" "}
                <path
                  d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/users") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                مدیریت کاربران
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت کاربران
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/wallets"}>
            <li
              className={`flex ${
                pathName.startsWith("/admin/wallets") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/wallets") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z"
                  fill="currentColor"></path>{" "}
                <path
                  d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z"
                  fill="currentColor"></path>{" "}
                <path
                  opacity="0.4"
                  d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z"
                  fill="currentColor"></path>{" "}
                <path
                  d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/admin/users") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                مدیریت کیف پول کاربران
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت کیف پول کاربران
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/"}>
            <li
              className={`flex ${
                pathName.startsWith("/homepage") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
              } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {" "}
                <path
                  d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z"
                  fill="currentColor"></path>{" "}
              </svg>
              <span
                className={`${
                  pathName.startsWith("/homepage") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                } ${!isSidebarOpen && "hidden"}`}>
                بازگشت به صفحه اصلی
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  بازگشت به صفحه اصلی
                </span>
              )}
            </li>
          </Link>

          <LogoutButton
            className={`flex
                hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300
               ${
                 !isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"
               } items-center rounded text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red`}>
            <svg
              className="text-gray-600 transition-all duration-300 group-hover:text-shop-red"
              width="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              {" "}
              <path
                opacity="0.4"
                d="M2 6.447C2 3.996 4.03024 2 6.52453 2H11.4856C13.9748 2 16 3.99 16 6.437V17.553C16 20.005 13.9698 22 11.4744 22H6.51537C4.02515 22 2 20.01 2 17.563V16.623V6.447Z"
                fill="currentColor"></path>{" "}
              <path
                d="M21.7787 11.4548L18.9329 8.5458C18.6388 8.2458 18.1655 8.2458 17.8723 8.5478C17.5802 8.8498 17.5811 9.3368 17.8743 9.6368L19.4335 11.2298H17.9386H9.54826C9.13434 11.2298 8.79834 11.5748 8.79834 11.9998C8.79834 12.4258 9.13434 12.7698 9.54826 12.7698H19.4335L17.8743 14.3628C17.5811 14.6628 17.5802 15.1498 17.8723 15.4518C18.0194 15.6028 18.2113 15.6788 18.4041 15.6788C18.595 15.6788 18.7868 15.6028 18.9329 15.4538L21.7787 12.5458C21.9199 12.4008 21.9998 12.2048 21.9998 11.9998C21.9998 11.7958 21.9199 11.5998 21.7787 11.4548Z"
                fill="currentColor"></path>{" "}
            </svg>
            <span
              className={`text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red
                } ${!isSidebarOpen && "hidden"}`}>
              خروج
            </span>
            {!isSidebarOpen && (
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                خروج
              </span>
            )}
          </LogoutButton>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
