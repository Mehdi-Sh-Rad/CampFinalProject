import AdminContent from "../components/ui/AdminContent";
import { SidebarProvider } from "../context/SidebarContext";

export const metadata = {
  title: "پنل ادمین",
  icons: {
    icon: "/logo-min-white.png",
    shortcut: "/logo-min-white.png",
    apple: "/logo-min-white.png",
  },
};

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}

