"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const LogoutButton = ({ className , children }) => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button className={className} onClick={handleLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
