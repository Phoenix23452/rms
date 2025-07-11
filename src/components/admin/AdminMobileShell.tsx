"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";
import { MobileSectionsList } from "@/components/admin/admin-layout/MobileSectionsList";
import { MobileNavItem } from "@/components/admin/admin-layout/MobileNavItem";

export default function AdminMobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mobileNavItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { to: "/admin/products", icon: Package, label: "Products" },
    { to: "/admin/reports", icon: BarChart3, label: "Reports" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="md:hidden block min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b h-16">
        <div className="flex justify-between items-center h-full px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <Button variant="ghost" size="sm">
            <Bell className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Slide Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform">
            <div className="flex items-center justify-between p-4 border-b bg-primary text-white">
              <h2 className="text-xl font-bold">Admin Sections</h2>
              <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1">
              <MobileSectionsList onItemClick={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="pt-16 pb-20 px-4">{children}</main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t h-16 grid grid-cols-5">
        {mobileNavItems.map((item) => (
          <MobileNavItem key={item.to} {...item} />
        ))}
      </footer>
    </div>
  );
}
