"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function NoAuthWrapper({ children }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image className={`transition-all duration-500 animate-pulse-scale`} src="/logo-min.png" height={100} width={100} alt="لوگو فروشگاه" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return <>{children}</>;
  }
  return null;
}
