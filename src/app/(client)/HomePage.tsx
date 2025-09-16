"use client";
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/customer/home/HeroSection";
import CategoriesSection from "@/components/customer/home/CategoriesSection";
import SpecialDealsSection from "@/components/customer/home/SpecialDealsSection";
import FeaturesSection from "@/components/customer/home/FeaturesSection";
import ReservationCTA from "@/components/customer/home/ReservationCTA";
import PopularItemsSection from "@/components/customer/home/PopularItemsSection";

export default function HomePage({
  categories,
  isMobile,
}: {
  categories: Category[];
  isMobile: boolean;
}) {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SpecialDealsSection />
      <CategoriesSection isMobile={isMobile} categories={categories} />
      <PopularItemsSection isMobile={isMobile} />
      <FeaturesSection isMobile={isMobile} />
      <ReservationCTA />

      {/* Footer with credit to Wezsol */}
      <div className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} This product is from{" "}
            <a href="https://wezsol.com" className="text-primary font-bold">
              wezsol.com
            </a>
            . Created by Wezsol.
          </p>
        </div>
      </div>
    </div>
  );
}
