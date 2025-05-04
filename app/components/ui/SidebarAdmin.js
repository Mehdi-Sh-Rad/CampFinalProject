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
  const { isDarkMode } = useTheme();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={` px-4 py-4 w-full dark:bg-shop-dark min-h-[100vh] relative bg-white shadow-md transition-all duration-500 ease-in-out ${!isSidebarOpen ? "max-w-[76px]" : "max-w-[260px]"
        }`}
    >
      <button className="absolute -left-3 top-8 bg-shop-red rounded-full text-white" onClick={toggleSidebar}>
        <svg
          className={`transition-transform duration-500 ${!isSidebarOpen && "rotate-180"}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path d="M19.75 11.7256L4.75 11.7256" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.7002 5.70124L19.7502 11.7252L13.7002 17.7502" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex justify-center items-center border-b border-b-[#E9ECEF] py-4">
        <Link className={`flex justify-center items-center`} href={"/"}>
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
              className={`flex ${pathName == "/admin"
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] dark:hover:text-white transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName == "/admin" ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName == "/admin" ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"} ${!isSidebarOpen ? "hidden" : ""}`}
              >
                پیشخــــوان
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  پیشخوان
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/categories"}>
            <li
              className={`flex ${pathName.startsWith("/admin/categories")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e]  transition-all group relative duration-300"
                }  ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/categories") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M10.0833 15.958H3.50777C2.67555 15.958 2 16.6217 2 17.4393C2 18.2559 2.67555 18.9207 3.50777 18.9207H10.0833C10.9155 18.9207 11.5911 18.2559 11.5911 17.4393C11.5911 16.6217 10.9155 15.958 10.0833 15.958Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M22.0001 6.37867C22.0001 5.56214 21.3246 4.89844 20.4934 4.89844H13.9179C13.0857 4.89844 12.4102 5.56214 12.4102 6.37867C12.4102 7.1963 13.0857 7.86 13.9179 7.86H20.4934C21.3246 7.86 22.0001 7.1963 22.0001 6.37867Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8.87774 6.37856C8.87774 8.24523 7.33886 9.75821 5.43887 9.75821C3.53999 9.75821 2 8.24523 2 6.37856C2 4.51298 3.53999 3 5.43887 3C7.33886 3 8.87774 4.51298 8.87774 6.37856Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M21.9998 17.3992C21.9998 19.2648 20.4609 20.7777 18.5609 20.7777C16.6621 20.7777 15.1221 19.2648 15.1221 17.3992C15.1221 15.5325 16.6621 14.0195 18.5609 14.0195C20.4609 14.0195 21.9998 15.5325 21.9998 17.3992Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/categories") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
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
              className={`flex ${pathName.startsWith("/admin/products") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/products") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.9133 16.3147L20.1444 10.1201C19.676 7.90964 18.3503 7 17.0865 7H6.93171C5.65022 7 4.28034 7.84597 3.88264 10.1201L3.1049 16.3147C2.46858 20.8629 4.81062 22 7.86853 22H16.1585C19.2075 22 21.4789 20.3535 20.9133 16.3147ZM9.097 12.1486C8.60889 12.1486 8.21321 11.7413 8.21321 11.2389C8.21321 10.7366 8.60889 10.3293 9.097 10.3293C9.5851 10.3293 9.98079 10.7366 9.98079 11.2389C9.98079 11.7413 9.5851 12.1486 9.097 12.1486ZM14.002 11.2389C14.002 11.7413 14.3977 12.1486 14.8858 12.1486C15.3739 12.1486 15.7696 11.7413 15.7696 11.2389C15.7696 10.7366 15.3739 10.3293 14.8858 10.3293C14.3977 10.3293 14.002 10.7366 14.002 11.2389Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M16.9739 6.77432C16.977 6.85189 16.9621 6.92913 16.9303 7H15.4932C15.4654 6.92794 15.4506 6.85153 15.4497 6.77432C15.4497 4.85682 13.8899 3.30238 11.9657 3.30238C10.0416 3.30238 8.48184 4.85682 8.48184 6.77432C8.49502 6.84898 8.49502 6.92535 8.48184 7H7.00989C6.9967 6.92535 6.9967 6.84898 7.00989 6.77432C7.12172 4.10591 9.32499 2 12.0049 2C14.6849 2 16.8882 4.10591 17 6.77432H16.9739Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/products") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
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
              className={`flex ${pathName.startsWith("/admin/discounts")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/discounts") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
              >
                <circle cx="6" cy="6" r="3" fill="currentColor" />
                <circle cx="18" cy="18" r="3" fill="currentColor" />
                <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                className={`${pathName.startsWith("/admin/discounts") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
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
              className={`flex ${pathName.startsWith("/admin/comments") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/admin/comments") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
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
              className={`flex ${pathName.startsWith("/admin/productQuestions")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={
                  pathName.startsWith("/user/productQuestions")
                    ? "text-white"
                    : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"
                }
                width="30"
                viewBox="0 0 21 21"
              >
                <path d="M17.659,3.681H8.468c-0.211,0-0.383,0.172-0.383,0.383v2.681H2.341c-0.21,0-0.383,0.172-0.383,0.383v6.126c0,0.211,0.172,0.383,0.383,0.383h1.532v2.298c0,0.566,0.554,
              0.368,0.653,0.27l2.569-2.567h4.437c0.21,0,0.383-0.172,0.383-0.383v-2.681h1.013l2.546,2.567c0.242,0.249,0.652,0.065,0.652-0.27v-2.298h1.533c0.211,0,0.383-0.172,0.383-0.382V4.063C18.042,
              3.853,17.87,3.681,17.659,3.681 M11.148,12.87H6.937c-0.102,0-0.199,0.04-0.27,0.113l-2.028,2.025v-1.756c0-0.211-0.172-0.383-0.383-0.383H2.724V7.51h5.361v2.68c0,0.21,0.172,0.382,0.383,
              0.382h2.68V12.87z M17.276,9.807h-1.533c-0.211,0-0.383,0.172-0.383,0.383v1.755L13.356,9.92c-0.07-0.073-0.169-0.113-0.27-0.113H8.851v-5.36h8.425V9.807z">
                </path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/productQuestions")
                  ? "text-white font-bold"
                  : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                سوالات محصول
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  سوالات محصول
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/tickets"}>
            <li
              className={`flex ${pathName.startsWith("/admin/tickets") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/admin/tickets") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
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
              className={`flex ${pathName.startsWith("/admin/users") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/users") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/users") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                مدیریت کاربران
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت کاربران
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/orders"}>
            <li
              className={`flex ${pathName.startsWith("/admin/orders") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/orders") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M16.3405 1.99976H7.67049C4.28049 1.99976 2.00049 4.37976 2.00049 7.91976V16.0898C2.00049 19.6198 4.28049 21.9998 7.67049 21.9998H16.3405C19.7305 21.9998 22.0005 19.6198 22.0005 16.0898V7.91976C22.0005 4.37976 19.7305 1.99976 16.3405 1.99976Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M11.1246 8.18921C11.1246 8.67121 11.5156 9.06421 11.9946 9.06421C12.4876 9.06421 12.8796 8.67121 12.8796 8.18921C12.8796 7.70721 12.4876 7.31421 12.0046 7.31421C11.5196 7.31421 11.1246 7.70721 11.1246 8.18921ZM12.8796 11.362C12.8796 10.88 12.4766 10.487 11.9946 10.487C11.5126 10.487 11.1196 10.88 11.1196 11.362V15.782C11.1196 16.264 11.5126 16.657 11.9946 16.657C12.4766 16.657 12.8796 16.264 12.8796 15.782V11.362Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/orders") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                مدیریت سفارشات
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت سفارشات
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/payments"}>
            <li
              className={`flex ${pathName.startsWith("/admin/payments") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/admin/payments") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                مدیریت پرداخت ها
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت پرداخت ها
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/wallets"}>
            <li
              className={`flex ${pathName.startsWith("/admin/wallets") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/admin/users") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                مدیریت کیف پول کاربران
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت کیف پول کاربران
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/admin/frequentQuestions"}>
            <li
              className={`flex ${pathName.startsWith("/admin/frequentQuestions")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/frequentQuestions") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M16.34 1.99976H7.67C4.28 1.99976 2 4.37976 2 7.91976V16.0898C2 19.6198 4.28 21.9998 7.67 21.9998H16.34C19.73 21.9998 22 19.6198 22 16.0898V7.91976C22 4.37976 19.73 1.99976 16.34 1.99976Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1246 8.18921C11.1246 8.67121 11.5156 9.06421 11.9946 9.06421C12.4876 9.06421 12.8796 8.67121 12.8796 8.18921C12.8796 7.70721 12.4876 7.31421 12.0046 7.31421C11.5196 7.31421 11.1246 7.70721 11.1246 8.18921ZM12.8696 11.362C12.8696 10.88 12.4766 10.487 11.9946 10.487C11.5126 10.487 11.1196 10.88 11.1196 11.362V15.782C11.1196 16.264 11.5126 16.657 11.9946 16.657C12.4766 16.657 12.8696 16.264 12.8696 15.782V11.362Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/frequentQuestions")
                  ? "text-white font-bold"
                  : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                سوالات متداول
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  سوالات متداول
                </span>
              )}
            </li>
          </Link>
          {/* لینک جدید برای مدیریت لوگو و بنرها */}
          <Link className=" " href={"/admin/siteSetting"}>
            <li
              className={`flex ${pathName.startsWith("/admin/siteSetting") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg
                className={pathName.startsWith("/admin/siteSetting") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.25 7H16.75C17.9926 7 19 8.00736 19 9.25V14.75C19 15.9926 17.9926 17 16.75 17H7.25C6.00736 17 5 15.9926 5 14.75V9.25C5 8.00736 6.00736 7 7.25 7ZM7.75 10C7.33579 10 7 10.3358 7 10.75C7 11.1642 7.33579 11.5 7.75 11.5H9.25C9.66421 11.5 10 11.1642 10 10.75C10 10.3358 9.66421 10 9.25 10H7.75ZM15.25 14.5H7.75C7.33579 14.5 7 14.1642 7 13.75C7 13.3358 7.33579 13 7.75 13H15.25C15.6642 13 16 13.3358 16 13.75C16 14.1642 15.6642 14.5 15.25 14.5Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/admin/siteSetting") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                مدیریت تنظیمات سایت
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                مدیریت تنظیمات سایت
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/"}>
            <li
              className={`flex ${pathName.startsWith("/homepage") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group relative duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}
            >
              <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span
                className={`${pathName.startsWith("/homepage") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
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
               ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red`}
          >
            <svg
              className="text-gray-600 transition-all duration-300 group-hover:text-shop-red"
              width="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M2 6.447C2 3.996 4.03024 2 6.52453 2H11.4856C13.9748 2 16 3.99 16 6.437V17.553C16 20.005 13.9698 22 11.4744 22H6.51537C4.02515 22 2 20.01 2 17.563V16.623V6.447Z"
                fill="currentColor"
              ></path>
              <path
                d="M21.7787 11.4548L18.9329 8.5458C18.6388 8.2458 18.1655 8.2458 17.8723 8.5478C17.5802 8.8498 17.5811 9.3368 17.8743 9.6368L19.4335 11.2298H17.9386H9.54826C9.13434 11.2298 8.79834 11.5748 8.79834 11.9998C8.79834 12.4258 9.13434 12.7698 9.54826 12.7698H19.4335L17.8743 14.3628C17.5811 14.6628 17.5802 15.1498 17.8723 15.4518C18.0194 15.6028 18.2113 15.6788 18.4041 15.6788C18.595 15.6788 18.7868 15.6028 18.9329 15.4538L21.7787 12.5458C21.9199 12.4008 21.9998 12.2048 21.9998 11.9998C21.9998 11.7958 21.9199 11.5998 21.7787 11.4548Z"
                fill="currentColor"
              ></path>
            </svg>
            <span
              className={`text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red} ${!isSidebarOpen && "hidden"}`}
            >
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