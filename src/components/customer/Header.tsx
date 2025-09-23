"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext"; // disabled for now
import Link from "next/link";

const Header = () => {
  // 🔧 Dummy values for now
  const user = { email: "demo@user.com" };
  const [cartCount, setCartCount] = useState(0);
  const isAuthenticated = false; // change to true to simulate logged-in state
  const logout = async () => {
    console.log("Fake logout called");
  };

  // Debug authentication state
  useEffect(() => {
    console.log("Header auth state:", { isAuthenticated, user: user?.email });
  }, [isAuthenticated, user]);

  const getCartCount = () => {
    if (typeof window === "undefined") return 0; // ✅ SSR safety
    const cart = localStorage?.getItem("cart");
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
  // Load cart count on mount
  useEffect(() => {
    setCartCount(getCartCount());

    // Listen to custom cart update events
    const updateCart = () => setCartCount(getCartCount());
    window.addEventListener("cartUpdated", updateCart);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-2 px-4 md:p-0 flex h-16 items-center mx-auto">
        <div className="flex items-center gap-2 md:gap-8 ">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Tasty Bites
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/menu"
              className="text-sm font-medium hover:text-primary"
            >
              Menu
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
            <Link
              href="/reservation"
              className="text-sm font-medium hover:text-primary"
            >
              Reservations
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href={"/cart"}>
            <Button size="sm" variant="outline" className="relative">
              Cart
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href={"/orders"}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden md:inline-flex"
                >
                  My Orders
                </Button>
              </Link>
              <Link href={"/profile"}>
                <Button size="sm" variant="ghost">
                  Profile ({user?.email?.split("@")[0]})
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href={"/login"}>
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
