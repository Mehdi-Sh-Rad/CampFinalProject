"use client";
import Link from "next/link";
import { useSidebar } from "@/app/context/SidebarContext";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import LogoutButton from "../auth/LogoutButton";

const Sidebar = () => {
  const pathName = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

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
        <Link className={`flex justify-center items-center`} href={"/admin"}>
          <Image
            className={`transition-all duration-500 ${!isSidebarOpen ? "hidden opacity-0" : "opacity-100"}`}
            src={"/uploads/logo.svg"}
            height={40}
            width={195}
            alt="لوگو فروشگاه"
          />
          <Image
            className={`transition-all duration-500 ${isSidebarOpen ? "hidden opacity-0" : "opacity-100"}`}
            src={"/uploads/logo2.webp"}
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
              className={`flex ${pathName == "/admin" ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] dark:hover:text-white transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName == "/admin" ? "text-white" : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"}
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
                className={`${pathName == "/admin" ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"} ${!isSidebarOpen ? "hidden" : ""
                  }`}>
                پیشخــــوان
              </span>
            </li>
          </Link>
          <Link className=" " href={"/admin/categories"}>
            <li
              className={`flex ${pathName.startsWith("/admin/categories") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e]  transition-all group duration-300"
                }  ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/categories") ? "text-white" : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"}
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
                className={`${pathName.startsWith("/admin/categories") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                دســــته بنـــــدی ها
              </span>
            </li>
          </Link>

          <Link className=" " href={"/admin/products"}>
            <li
              className={`flex ${pathName.startsWith("/admin/products") ? "bg-shop-red" : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"} items-center rounded`}>
              <svg
                className={pathName.startsWith("/admin/products") ? "text-white" : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"}
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
                className={`${pathName.startsWith("/admin/products") ? "text-white font-bold" : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}>
                محـصــــولات
              </span>
            </li>
          </Link>

          <Link className=" " href={"/admin/discounts"}>
            <li
              className={`flex ${pathName.startsWith("/admin/discounts")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"
                } items-center rounded`}
            >
              <svg
                className={
                  pathName.startsWith("/admin/discounts")
                    ? "text-white"
                    : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"
                }
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
                className={`${pathName.startsWith("/admin/discounts")
                  ? "text-white font-bold"
                  : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                کد تخفیف
              </span>
            </li>
          </Link>

          <Link className=" " href={"/admin/comments"}>
            <li
              className={`flex ${pathName.startsWith("/admin/comments")
                ? "bg-shop-red"
                : "hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300"
                } ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"
                } items-center rounded`}
            >
              <svg
                className={
                  pathName.startsWith("/admin/comments")
                    ? "text-white"
                    : "text-shop-gray transition-all duration-300 group-hover:text-shop-red"
                }
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
                className={`${pathName.startsWith("/admin/comments")
                  ? "text-white font-bold"
                  : "text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red"
                  } ${!isSidebarOpen && "hidden"}`}
              >
              مدیریت نظرات
              </span>
            </li>
          </Link>

          <LogoutButton
            className={`flex
                hover:bg-shop-red-light/40 dark:hover:bg-[#0c112e] transition-all group duration-300
               ${!isSidebarOpen ? "justify-center py-2 " : "gap-x-2  px-4 py-2"
              } items-center rounded text-shop-gray font-bold transition-all duration-300 group-hover:text-shop-red`}>
            <svg
              className="text-shop-gray transition-all duration-300 group-hover:text-shop-red"
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
