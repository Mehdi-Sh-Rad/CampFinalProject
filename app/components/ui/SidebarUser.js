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
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { isDarkMode } = useTheme();
  return (
    <aside
      className={` px-4 py-4 w-full dark:bg-shop-dark min-h-[100vh] relative bg-white shadow-md transition-all duration-500 ease-in-out ${!isSidebarOpen ? "max-w-[76px]" : "max-w-[260px]"
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
          <Link className="" href={"/user"}>
            <li
              className={`flex ${pathName == "/user" ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] dark:hover:text-white transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName == "/user" ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
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
                className={`${pathName == "/user" ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"} ${!isSidebarOpen ? "hidden" : ""
                  }`}>
                پیشخــــوان
              </span>
            </li>
          </Link>
          <Link className=" " href={"/user/editUser"}>
            <li
              className={`flex ${pathName.startsWith("/user/editUser") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e]  transition-all group duration-300"
                }  ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/user/editUser") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
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
                className={`${pathName.startsWith("/user/editUser") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                ویرایش اطلاعات کاربری
              </span>
            </li>
          </Link>

          <Link className=" " href={"/user/orders"}>
            <li
              className={`flex ${pathName.startsWith("/user/orders") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/user/orders") ? "text-white" : "text-gray-600 transition-all duration-300 group-hover:text-shop-red"}
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
                className={`${pathName.startsWith("/user/orders") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                سفارشات من
              </span>
            </li>
          </Link>

          <Link className=" " href={"/user/comments"}>
            <li
              className={`flex ${pathName.startsWith("/user/comments")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"
                } items-center rounded`}
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868
                0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896
                0 0 0-.63-.256Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/user/comments")
                  ? "text-white font-bold"
                  : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                نظرات من
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  نظرات من
                </span>
              )}
            </li>
          </Link>

          <Link className=" " href={"/user/productQuestions"}>
            <li
              className={`flex ${pathName.startsWith("/user/productQuestions") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={
                  pathName.startsWith("/user/productQuestions")
                    ? "text-white"
                    : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"
                }
                width="30"
                viewBox="0 0 21 21">
                <path d="M17.659,3.681H8.468c-0.211,0-0.383,0.172-0.383,0.383v2.681H2.341c-0.21,0-0.383,0.172-0.383,0.383v6.126c0,0.211,0.172,0.383,0.383,0.383h1.532v2.298c0,0.566,0.554,
              0.368,0.653,0.27l2.569-2.567h4.437c0.21,0,0.383-0.172,0.383-0.383v-2.681h1.013l2.546,2.567c0.242,0.249,0.652,0.065,0.652-0.27v-2.298h1.533c0.211,0,0.383-0.172,0.383-0.382V4.063C18.042,
              3.853,17.87,3.681,17.659,3.681 M11.148,12.87H6.937c-0.102,0-0.199,0.04-0.27,0.113l-2.028,2.025v-1.756c0-0.211-0.172-0.383-0.383-0.383H2.724V7.51h5.361v2.68c0,0.21,0.172,0.382,0.383,
              0.382h2.68V12.87z M17.276,9.807h-1.533c-0.211,0-0.383,0.172-0.383,0.383v1.755L13.356,9.92c-0.07-0.073-0.169-0.113-0.27-0.113H8.851v-5.36h8.425V9.807z">
                </path>
              </svg>
              <span
                className={`${pathName.startsWith("/user/productQuestions") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                سوالات من
              </span>
            </li>
          </Link>


          <Link className=" " href={"/user/wallets"}>
            <li
              className={`flex ${pathName.startsWith("/user/wallets") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/user/wallets") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                کیف پول
              </span>
              {!isSidebarOpen && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  مدیریت کیف پول کاربران
                </span>
              )}
            </li>
          </Link>
          <Link className=" " href={"/user/tickets"}>
            <li
              className={`flex ${pathName.startsWith("/user/tickets") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6
                6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z" />
              </svg>
              <span
                className={`${pathName.startsWith("/user/tickets") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                تیکت های من
              </span>
            </li>
          </Link>

          <Link className=" " href={"/auth/change-password"}>
            <li
              className={`flex ${pathName.startsWith("/auth/change-password") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                width="30"
                className="svg-icon"
                viewBox="0 0 20 20">
                <path d="M17.657,2.982H2.342c-0.234,0-0.425,0.191-0.425,0.426v10.21c0,0.234,0.191,0.426,0.425,0.426h3.404v2.553c0,0.397,0.48,0.547,0.725,0.302l2.889-2.854h8.298c0.234,0,
                0.426-0.191,0.426-0.426V3.408C18.083,3.174,17.892,2.982,17.657,2.982M17.232,13.192H9.185c-0.113,0-0.219,0.045-0.3,0.124l-2.289,2.262v-1.96c0-0.233-0.191-0.426-0.425-0.426H2.767V3.833h14.465V13.192z M10,
                7.237c-0.821,0-1.489,0.668-1.489,1.489c0,0.821,0.668,1.489,1.489,1.489c0.821,0,1.488-0.668,1.488-1.489C11.488,7.905,10.821,7.237,10,7.237 M10,9.364c-0.352,0-0.638-0.288-0.638-0.638c0-0.351,0.287-0.638,
                0.638-0.638c0.351,0,0.638,0.287,0.638,0.638C10.638,9.077,10.351,9.364,10,9.364 M14.254,7.237c-0.821,0-1.489,0.668-1.489,1.489c0,0.821,0.668,1.489,1.489,1.489s1.489-0.668,1.489-1.489C15.743,7.905,15.075,
                7.237,14.254,7.237 M14.254,9.364c-0.351,0-0.638-0.288-0.638-0.638c0-0.351,0.287-0.638,0.638-0.638c0.352,0,0.639,0.287,0.639,0.638C14.893,9.077,14.605,9.364,14.254,9.364 M5.746,7.237c-0.821,0-1.489,0.668-1.489,
                1.489c0,0.821,0.668,1.489,1.489,1.489c0.821,0,1.489-0.668,1.489-1.489C7.234,7.905,6.566,7.237,5.746,7.237 M5.746,9.364c-0.351,0-0.638-0.288-0.638-0.638c0-0.351,0.287-0.638,0.638-0.638c0.351,0,0.638,0.287,0.638,
                0.638C6.384,9.077,6.096,9.364,5.746,9.364"></path>
              </svg>
              <span
                className={`${pathName.startsWith("/auth/change-password") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                تغییر کلمه عبور
              </span>
            </li>
          </Link>

          <Link className=" " href={"/"}>
            <li
              className={`flex ${pathName.startsWith("/homepage") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
              </svg>
              <span
                className={`${pathName.startsWith("/homepage") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                بازگشت به صفحه اصلی
              </span>
            </li>
          </Link>

          <LogoutButton
            className={`flex
                hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300
               ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"
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
            </span>{" "}
          </LogoutButton>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
