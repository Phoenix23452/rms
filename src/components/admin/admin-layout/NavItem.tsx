"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

export const NavItem = ({
  to,
  icon: Icon,
  label,
  end = false,
  onClick,
}: NavItemProps) => {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      href={to}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-2 w-full",
        isActive
          ? "bg-primary text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
};
