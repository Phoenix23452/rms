"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Bike,
  BarChart3,
  Settings,
  Calculator,
  UserCheck,
  Calendar,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Package, label: "Categories" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/riders", icon: Bike, label: "Riders" },
  { to: "/admin/inventory", icon: Warehouse, label: "Inventory" },
  { to: "/admin/pos", icon: Calculator, label: "POS System" },
  { to: "/admin/staff", icon: UserCheck, label: "Staff" },
  { to: "/admin/reservations", icon: Calendar, label: "Reservations" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      <nav className="mt-6 space-y-2 pb-20 px-3">
        {sidebarItems.map(({ to, icon: Icon, label, end }) => (
          <Link
            key={to}
            href={to}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
              isActive(to, end)
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
