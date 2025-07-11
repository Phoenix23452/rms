"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

export const MobileNavItem = ({
  to,
  icon: Icon,
  label,
  end = false,
}: MobileNavItemProps) => {
  const pathname = usePathname();

  const isActive = end ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      href={to}
      className={cn(
        "flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors",
        isActive
          ? "text-primary bg-primary/10"
          : "text-gray-600 hover:text-gray-900",
      )}
    >
      <Icon
        className={cn(
          "h-6 w-6 mb-1",
          isActive ? "text-primary" : "text-gray-600",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
};
