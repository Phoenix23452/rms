
import React from "react";
import { Card } from "@/components/ui/card";

interface MenuSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const MenuSidebar = ({ activeSection, setActiveSection }: MenuSidebarProps) => {
  return (
    <Card className="p-4 mb-4">
      <h2 className="font-bold text-lg mb-2">All Details</h2>
      <div className="space-y-2">
        <div 
          className={`${activeSection === "menu" ? "bg-gray-100" : ""} p-2 rounded flex items-center cursor-pointer`}
          onClick={() => setActiveSection("menu")}
        >
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2">M</span>
          <span>Menu</span>
        </div>
        <div 
          className={`${activeSection === "deals" ? "bg-gray-100" : ""} p-2 rounded flex items-center cursor-pointer`}
          onClick={() => setActiveSection("deals")}
        >
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2">D</span>
          <span>Deals</span>
        </div>
        <div 
          className={`${activeSection === "reviews" ? "bg-gray-100" : ""} p-2 rounded flex items-center cursor-pointer`}
          onClick={() => setActiveSection("reviews")}
        >
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2">R</span>
          <span>Reviews</span>
        </div>
      </div>
    </Card>
  );
};
