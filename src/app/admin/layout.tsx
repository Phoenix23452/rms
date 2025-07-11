import { ReactNode } from "react";
import AdminMobileShell from "@/components/admin/AdminMobileShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminMobileShell>{children}</AdminMobileShell>

      <div className="hidden md:flex min-h-screen bg-gray-50 relative">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6">{children}</div>
        </main>
      </div>
    </>
  );
}
