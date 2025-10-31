"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext"; // disabled for now
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session);
  console.log("Session data:", session);
  console.log("Session status:", status);

  // Debug authentication state
  useEffect(() => {}, []);
  // ✅ Auto sign-in admin if no session
  useEffect(() => {
    const autoAdminSignIn = async () => {
      if (status === "unauthenticated") {
        try {
          const res = await signIn("admin-login", {
            redirect: false,
            email: "m.taha14785@gmail.com", // your seed admin email
            password: "12345678", // must match your stored admin password
          });

          if (res?.error) {
            console.error("Auto admin sign-in failed:", res.error);
          } else {
            console.log("✅ Admin auto signed in successfully");
          }
        } catch (err) {
          console.error("Auto admin sign-in error:", err);
        }
      }
    };

    autoAdminSignIn();
  }, [status]);

  const getCartCount = () => {
    if (typeof window === "undefined") return 0; // ✅ SSR safety
    const cart = localStorage?.getItem("cart");
    if (!cart) return 0;

    try {
      const parsedCart = JSON.parse(cart);
      return Array.isArray(parsedCart)
        ? parsedCart.reduce((total, item) => total + (item.quantity || 0), 0)
        : 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      await signOut();
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
                  Profile ({session?.user?.name?.split("@")[0]})
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
