
import React from 'react';
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
  Warehouse
} from 'lucide-react';
import { MobileListItem } from './MobileListItem';

interface MobileSectionsListProps {
  onItemClick?: () => void;
}

export const MobileSectionsList = ({ onItemClick }: MobileSectionsListProps) => {
  const adminSections = [
    { 
      to: "/admin", 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      description: "Overview and analytics",
      end: true 
    },
    { 
      to: "/admin/orders", 
      icon: ShoppingBag, 
      label: "Orders", 
      description: "Manage customer orders",
      badge: "12" 
    },
    { 
      to: "/admin/products", 
      icon: Package, 
      label: "Products", 
      description: "Menu items and catalog" 
    },
    { 
      to: "/admin/categories", 
      icon: Package, 
      label: "Categories", 
      description: "Product categories" 
    },
    { 
      to: "/admin/customers", 
      icon: Users, 
      label: "Customers", 
      description: "Customer management" 
    },
    { 
      to: "/admin/riders", 
      icon: Bike, 
      label: "Riders", 
      description: "Delivery team" 
    },
    { 
      to: "/admin/inventory", 
      icon: Warehouse, 
      label: "Inventory", 
      description: "Stock management" 
    },
    { 
      to: "/admin/pos", 
      icon: Calculator, 
      label: "POS System", 
      description: "Point of sale" 
    },
    { 
      to: "/admin/staff", 
      icon: UserCheck, 
      label: "Staff", 
      description: "Employee management" 
    },
    { 
      to: "/admin/reservations", 
      icon: Calendar, 
      label: "Reservations", 
      description: "Table bookings" 
    },
    { 
      to: "/admin/reports", 
      icon: BarChart3, 
      label: "Reports", 
      description: "Analytics and insights" 
    },
    { 
      to: "/admin/settings", 
      icon: Settings, 
      label: "Settings", 
      description: "App configuration" 
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white">
        {adminSections.map((section) => (
          <MobileListItem
            key={section.to}
            to={section.to}
            icon={section.icon}
            label={section.label}
            description={section.description}
            badge={section.badge}
            end={section.end}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};
