"use client";
import { useSidebar } from "../context/SidebarContext";
import Sidebar from "./ui/SidebarUser";
import Header from "./ui/Header";

export default function UserContent({ children }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <main className="flex w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className={`transition-all  duration-500 ${isSidebarOpen ? "w-9/12" : "w-[calc(100%-80px)]"} flex-grow`}>
        <Header />
        {children}
      </div>
    </main>
  );
}
