import UserContent from "../components/UserContent";
import { SidebarProvider } from "../context/SidebarContext";

export const metadata = {
  title: "پنل ادمین",
  description: "پنل ادمین فروشگاه",
};

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <UserContent>{children}</UserContent>
    </SidebarProvider>
  );
}

