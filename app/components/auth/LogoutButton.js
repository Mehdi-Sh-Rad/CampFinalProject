"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const LogoutButton = ({ className }) => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button className={className} onClick={handleLogout}>
      خروج
    </button>
  );
};

export default LogoutButton;
