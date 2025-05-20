"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login page if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Redirect to home page if authenticated
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image className={`transition-all duration-500 animate-pulse-scale`} src="/logo-min.png" height={100} width={100} alt="لوگو فروشگاه" />
      </div>
    );
  }
  if (status === "authenticated") {
    return <>{children}</>;
  }
  return null;
}
