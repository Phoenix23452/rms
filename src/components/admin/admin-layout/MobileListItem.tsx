"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronRight } from "lucide-react";

interface MobileListItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  badge?: string | number;
  end?: boolean;
  onClick?: () => void;
}

export const MobileListItem = ({
  to,
  icon: Icon,
  label,
  description,
  badge,
  end = false,
  onClick,
}: MobileListItemProps) => {
  const pathname = usePathname();

  const isActive = end ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      href={to}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-4 bg-white border-b border-gray-100 transition-colors active:bg-gray-50",
        isActive && "bg-primary/5 border-primary/20",
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3",
          isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600",
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              "text-base font-medium truncate",
              isActive ? "text-primary" : "text-gray-900",
            )}
          >
            {label}
          </h3>
          {badge && (
            <span
              className={cn(
                "ml-2 px-2 py-1 text-xs font-medium rounded-full",
                isActive
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700",
              )}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-500 truncate mt-1">{description}</p>
        )}
      </div>

      <ChevronRight
        className={cn(
          "w-5 h-5 ml-2 flex-shrink-0",
          isActive ? "text-primary" : "text-gray-400",
        )}
      />
    </Link>
  );
};
