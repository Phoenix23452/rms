import React, { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/customer/layout/Footer";
import { LocationType } from "@/hooks/use-locations";

interface ScrollContentProps {
  currentLocation?: LocationType | null;
  mainLocation?: LocationType | null;
  isMobile: any;
  children: ReactNode;
}

export const ScrollContent = ({
  currentLocation,
  mainLocation,
  children,
  isMobile,
}: ScrollContentProps) => {
  return (
    <ScrollArea className="">
      <main className={isMobile ? "pb-16 pt-4" : ""}>{children}</main>

      {!isMobile && <Footer location={currentLocation || mainLocation} />}
    </ScrollArea>
  );
};
