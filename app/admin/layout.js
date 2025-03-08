import AdminContent from "../components/AdminContent";
import { SidebarProvider } from "../context/SidebarContext";

export const metadata = {
  title: "پنل ادمین",
  description: "پنل ادمین فروشگاه",
};

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}
