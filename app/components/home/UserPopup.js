"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaUserCog } from "react-icons/fa";

export default function UserPopup() {
  const { data: session, status } = useSession();

  const handleAdminClick = () => {
    if (status === "authenticated") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-[160px] min-w-[160px] max-w-[90%] overflow-y-auto overflow-x-hidden">
      <div className="p-6">
        <Link
          href="/user"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 transition rounded"
        >
          <FaUser size={16} className="text-dark"  />
          <span className="text-base text-dark whitespace-nowrap">پنل کاربر</span>
        </Link>
        {session?.user?.isAdmin && (
          <button
            onClick={handleAdminClick}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 transition rounded w-full text-left"
          >
            <FaUserCog size={20} className="text-dark" />
            <span className="text-base text-dark whitespace-nowrap">پنل ادمین</span>
          </button>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 p-2 hover:bg-gray-100 transition rounded w-full text-left"
        >
          <FaSignOutAlt size={20} className="text-red-500" />
          <span className="text-base text-dark whitespace-nowrap">خروج</span>
        </button>
      </div>
    </div>
  );
}