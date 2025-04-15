"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const { data: session, status } = useSession();
  const userName = session?.user?.name || "کاربر";
  const userAdmin = session?.user?.isAdmin;
  const userImage = session?.user?.image || "/uploads/profile.png";

  return (
    <div className={`border-b dark:bg-shop-dark dark:border-b-black border-b-slate-100 py-3 px-10 flex justify-between`}>
      <div className="w-1/2">
        <div className=" hidden md:flex max-w-[300px] w-full items-center border dark:border-gray-600 border-slate-200 rounded transition-all duration-300 focus-within:ring-1 focus-within:border-shop-red focus-within:ring-shop-red pr-4 gap-x-3">
          <svg className="text-shop-gray" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <circle cx="11.7669" cy="11.7666" r="8.98856" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.0186 18.4851L21.5426 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            name="search"
            className="focus:outline-none py-2 w-full dark:text-gray-200 dark:placeholder:text-gray-200 dark:bg-shop-dark"
            type="text"
            placeholder="جستجو..."
          />
        </div>
      </div>
      <div className="w-1/2 flex gap-x-2 justify-end">
        <button className={`${isDarkMode ? "text-white" : "text-shop-dark"}`} onClick={toggleDarkMode}>
          <svg className={`text-gray-500 ${isDarkMode && "hidden"}`} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 2C8.395 2 7.8066 2.05312 7.2348 2.15553C6.84951 2.22454 6.83164 2.75293 7.1873 2.9164C10.6208 4.49447 13 7.95185 13 12C13 16.0481 10.6208 19.5055 7.1873 21.0836C6.83164 21.2471 6.84951 21.7755 7.2348 21.8445C7.8066 21.9469 8.395 22 9 22C10.3132 22 11.6136 21.7413 12.8268 21.2388C14.0401 20.7362 15.1425 19.9997 16.0711 19.0711C16.9997 18.1425 17.7362 17.0401 18.2388 15.8268C18.7413 14.6136 19 13.3132 19 12C19 10.6868 18.7413 9.38642 18.2388 8.17317C17.7362 6.95991 16.9997 5.85752 16.0711 4.92893C15.1425 4.00035 14.0401 3.26375 12.8268 2.7612C11.6136 2.25866 10.3132 2 9 2Z"
              fill="currentColor"
            />
          </svg>
          <svg className={`text-gray-200 ${!isDarkMode && "hidden"}`} width="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"></path>
          </svg>
        </button>
        <svg className="text-gray-500 dark:text-gray-200 hidden md:flex" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z"
            fill="currentColor"></path>
          <path
            opacity="0.4"
            d="M14.0088 19.2283C13.5088 19.1215 10.4627 19.1215 9.96275 19.2283C9.53539 19.327 9.07324 19.5566 9.07324 20.0602C9.09809 20.5406 9.37935 20.9646 9.76895 21.2335L9.76795 21.2345C10.2718 21.6273 10.8632 21.877 11.4824 21.9667C11.8123 22.012 12.1482 22.01 12.4901 21.9667C13.1083 21.877 13.6997 21.6273 14.2036 21.2345L14.2026 21.2335C14.5922 20.9646 14.8734 20.5406 14.8983 20.0602C14.8983 19.5566 14.4361 19.327 14.0088 19.2283Z"
            fill="currentColor"></path>
        </svg>

        <svg className="text-gray-500 dark:text-gray-200 hidden md:flex" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.4"
            d="M22 15.94C22 18.73 19.76 20.99 16.97 21H16.96H7.05C4.27 21 2 18.75 2 15.96V15.95C2 15.95 2.006 11.524 2.014 9.298C2.015 8.88 2.495 8.646 2.822 8.906C5.198 10.791 9.447 14.228 9.5 14.273C10.21 14.842 11.11 15.163 12.03 15.163C12.95 15.163 13.85 14.842 14.56 14.262C14.613 14.227 18.767 10.893 21.179 8.977C21.507 8.716 21.989 8.95 21.99 9.367C22 11.576 22 15.94 22 15.94Z"
            fill="currentColor"></path>
          <path
            d="M21.4759 5.67351C20.6099 4.04151 18.9059 2.99951 17.0299 2.99951H7.04988C5.17388 2.99951 3.46988 4.04151 2.60388 5.67351C2.40988 6.03851 2.50188 6.49351 2.82488 6.75151L10.2499 12.6905C10.7699 13.1105 11.3999 13.3195 12.0299 13.3195C12.0339 13.3195 12.0369 13.3195 12.0399 13.3195C12.0429 13.3195 12.0469 13.3195 12.0499 13.3195C12.6799 13.3195 13.3099 13.1105 13.8299 12.6905L21.2549 6.75151C21.5779 6.49351 21.6699 6.03851 21.4759 5.67351Z"
            fill="currentColor"></path>
        </svg>
        <Link className="hidden md:flex" href={userAdmin ? "/admin" : "/user"}>
          <div className="flex items-center gap-x-2">
            <Image className="rounded-full" src={userImage} width={50} height={50} alt="پروفایل" />
            <span className="text-[#232d42] font-medium dark:text-[#8a92a6]">{userName}</span>
          </div>
        </Link>
        <svg
          onClick={() => setShowMenu(!showMenu)}
          className="text-shop-gray md:hidden relative"
          width="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.4"
            d="M16.34 1.99976H7.67C4.28 1.99976 2 4.37976 2 7.91976V16.0898C2 19.6198 4.28 21.9998 7.67 21.9998H16.34C19.73 21.9998 22 19.6198 22 16.0898V7.91976C22 4.37976 19.73 1.99976 16.34 1.99976Z"
            fill="currentColor"></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.52124 10.8035C6.86024 10.8035 6.32324 11.3405 6.32324 11.9995C6.32324 12.6595 6.86024 13.1975 7.52124 13.1975C8.18224 13.1975 8.71924 12.6595 8.71924 11.9995C8.71924 11.3405 8.18224 10.8035 7.52124 10.8035ZM12.0002 10.8035C11.3392 10.8035 10.8022 11.3405 10.8022 11.9995C10.8022 12.6595 11.3392 13.1975 12.0002 13.1975C12.6612 13.1975 13.1982 12.6595 13.1982 11.9995C13.1982 11.3405 12.6612 10.8035 12.0002 10.8035ZM15.2817 11.9995C15.2817 11.3405 15.8187 10.8035 16.4797 10.8035C17.1407 10.8035 17.6777 11.3405 17.6777 11.9995C17.6777 12.6595 17.1407 13.1975 16.4797 13.1975C15.8187 13.1975 15.2817 12.6595 15.2817 11.9995Z"
            fill="currentColor"></path>
        </svg>
        <div
          className={`absolute rounded top-16 bg-white z-20 left-4 overflow-hidden transition-all duration-300 py-2 px-4 shadow-sm  ${
            showMenu ? "flex items-center gap-x-2 opacity-100" : "hidden opacity-0"
          }`}>
          <svg className="text-gray-500" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z"
              fill="currentColor"></path>
            <path
              opacity="0.4"
              d="M14.0088 19.2283C13.5088 19.1215 10.4627 19.1215 9.96275 19.2283C9.53539 19.327 9.07324 19.5566 9.07324 20.0602C9.09809 20.5406 9.37935 20.9646 9.76895 21.2335L9.76795 21.2345C10.2718 21.6273 10.8632 21.877 11.4824 21.9667C11.8123 22.012 12.1482 22.01 12.4901 21.9667C13.1083 21.877 13.6997 21.6273 14.2036 21.2345L14.2026 21.2335C14.5922 20.9646 14.8734 20.5406 14.8983 20.0602C14.8983 19.5566 14.4361 19.327 14.0088 19.2283Z"
              fill="currentColor"></path>
          </svg>

          <svg className="text-gray-500" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              opacity="0.4"
              d="M22 15.94C22 18.73 19.76 20.99 16.97 21H16.96H7.05C4.27 21 2 18.75 2 15.96V15.95C2 15.95 2.006 11.524 2.014 9.298C2.015 8.88 2.495 8.646 2.822 8.906C5.198 10.791 9.447 14.228 9.5 14.273C10.21 14.842 11.11 15.163 12.03 15.163C12.95 15.163 13.85 14.842 14.56 14.262C14.613 14.227 18.767 10.893 21.179 8.977C21.507 8.716 21.989 8.95 21.99 9.367C22 11.576 22 15.94 22 15.94Z"
              fill="currentColor"></path>
            <path
              d="M21.4759 5.67351C20.6099 4.04151 18.9059 2.99951 17.0299 2.99951H7.04988C5.17388 2.99951 3.46988 4.04151 2.60388 5.67351C2.40988 6.03851 2.50188 6.49351 2.82488 6.75151L10.2499 12.6905C10.7699 13.1105 11.3999 13.3195 12.0299 13.3195C12.0339 13.3195 12.0369 13.3195 12.0399 13.3195C12.0429 13.3195 12.0469 13.3195 12.0499 13.3195C12.6799 13.3195 13.3099 13.1105 13.8299 12.6905L21.2549 6.75151C21.5779 6.49351 21.6699 6.03851 21.4759 5.67351Z"
              fill="currentColor"></path>
          </svg>
          <Link href={userAdmin ? "/user" : "/user"}>
            <div className="flex items-center gap-x-2">
              <Image className="rounded-full" src={userImage} width={50} height={50} alt="پروفایل" />
              <span className="text-[#232d42] font-medium">{userName}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
