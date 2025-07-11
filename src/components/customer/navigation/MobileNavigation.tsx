"use client";
import React from "react";
import { Home, Menu, ShoppingCart, User, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNavigation = () => {
  const path = usePathname();

  // Get cart from localStorage if it exists
  const getCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (!cart) return 0;

    try {
      const parsedCart = JSON.parse(cart);
      return Array.isArray(parsedCart)
        ? parsedCart.reduce((total, item) => total + (item.quantity || 0), 0)
        : 0;
    } catch (error) {
      return 0;
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg h-16 flex items-center justify-around safe-area-bottom">
      <Link
        href="/"
        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${path === "/" ? "text-primary bg-primary/10" : "text-gray-600"}`}
      >
        <Home className="h-5 w-5 mb-1" />
        <span className="text-xs font-medium">Home</span>
      </Link>
      <Link
        href="/menu"
        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${path === "/menu" ? "text-primary bg-primary/10" : "text-gray-600"}`}
      >
        <Menu className="h-5 w-5 mb-1" />
        <span className="text-xs font-medium">Menu</span>
      </Link>
      <Link
        href="/cart"
        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${path === "/cart" ? "text-primary bg-primary/10" : "text-gray-600"}`}
      >
        <ShoppingCart className="h-5 w-5 mb-1" />
        {getCartCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {getCartCount()}
          </span>
        )}
        <span className="text-xs font-medium">Cart</span>
      </Link>
      <Link
        href="/contact"
        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${path === "/contact" ? "text-primary bg-primary/10" : "text-gray-600"}`}
      >
        <Phone className="h-5 w-5 mb-1" />
        <span className="text-xs font-medium">Contact</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${path === "/profile" ? "text-primary bg-primary/10" : "text-gray-600"}`}
      >
        <User className="h-5 w-5 mb-1" />
        <span className="text-xs font-medium">Profile</span>
      </Link>
    </div>
  );
};
