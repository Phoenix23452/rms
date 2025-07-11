import Header from "@/components/customer/Header";
import { ScrollContent } from "@/components/customer/layout/ScrollContent";
import { MobileNavigation } from "@/components/customer/navigation/MobileNavigation";
import { cn, isMobileDevice } from "@/lib/utils";
import { headers } from "next/headers";
import React, { ReactNode } from "react";

export default async function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ua = (await headers()).get("user-agent");
  const isMobile = isMobileDevice(ua);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Fixed on mobile for app-like experience */}
      <div
        className={cn(
          isMobile && "fixed top-0 left-0 right-0 z-30",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        )}
      >
        <Header />
      </div>

      <div
        className={`flex-1 ${isMobile ? "pt-16 pb-16" : ""} ${shouldShowBottomNav() ? "pb-16" : ""}`}
      >
        <ScrollContent
          // currentLocation={currentLocation}
          // mainLocation={mainLocation}
          isMobile={isMobile}
        >
          {children}
        </ScrollContent>
      </div>

      {/* Bottom Navigation - Fixed for app-like experience */}
      {shouldShowBottomNav() && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <MobileNavigation />
        </div>
      )}
    </div>
  );
}

function shouldShowBottomNav() {
  return true; // Replace with real logic if needed
}
