import UserContent from "../components/ui/UserContent";
import { SidebarProvider } from "../context/SidebarContext";

export const metadata = {
  title: "پنل کاربری",
  icons: {
    icon: "/logo-min-white.png",
    shortcut: "/logo-min-white.png",
    apple: "/logo-min-white.png",
  },
};

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <UserContent>{children}</UserContent>
    </SidebarProvider>
  );
}

