"use client";
import React, { useState, useEffect } from "react";
// import { getUserLoyaltyPoints } from "@/services/loyaltyService";
import { CategoryFilter } from "@/components/customer/menu/CategoryFilter";
import { MenuSearchBar } from "@/components/customer/menu/MenuSearchBar";
import { MenuItemCard } from "@/components/customer/menu/MenuItemCard";
import { OrderDialog } from "@/components/customer/menu/order-dialog/OrderDialog";
import { MenuData } from "@/components/customer/menu/MenuData";
import { useMenuFilters } from "@/hooks/customer/use-menu-filters";
import { useOrderDialog } from "@/hooks/customer/use-order-dialog";
import { useProductOptions } from "@/hooks/customer/use-product-options";
import { useCart } from "@/hooks/customer/use-cart";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { HeroSlider } from "@/components/customer/menu/HeroSlider";
import { MenuControls } from "@/components/customer/menu/MenuControls";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { DealsSection } from "@/components/customer/menu/DealsSection";
import { ReviewsSection } from "@/components/customer/menu/ReviewsSection";
import { BestSellingProducts } from "@/components/customer/menu/BestSellingProducts";
import { SaleProducts } from "@/components/customer/menu/SaleProducts";
import { MenuSidebar } from "@/components/customer/menu/MenuSidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Menu() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);
  const [activeSection, setActiveSection] = useState("menu");
  const navigate = useRouter();
  const { isMobile } = useIsMobile();
  const { cartCount, updateCartCount } = useCart();

  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isGridView,
    setIsGridView,
    filteredItems,
  } = useMenuFilters();

  const {
    selectedItem,
    quantity,
    handleOrderNow,
    increaseQuantity,
    decreaseQuantity,
    handleConfirmOrder,
  } = useOrderDialog(navigate, toast);

  const { productVariations, optionalItems } = useProductOptions(selectedItem);

  // Update cart count when order is confirmed
  useEffect(() => {
    updateCartCount();
  }, []);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        // const points = await getUserLoyaltyPoints();
        // setLoyaltyPoints(points);
      } catch (error) {
        console.error("Error fetching loyalty points:", error);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  // All menu categories for tabs - remove duplicate "All" category
  const categories = MenuData.categories.filter((c, index) => {
    if (index === 0) return true;
    return c.id !== "all";
  });

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      {/* Hero Slider with deal/offer images */}
      <HeroSlider />

      <div className="container mx-auto py-6 px-4 flex-grow">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <MenuSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Cart button for mobile */}
            {isMobile && (
              <div className="mb-4">
                <MenuControls
                  cartCount={cartCount}
                  isGridView={isGridView}
                  setIsGridView={setIsGridView}
                />
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-6">
            {/* Show different content based on activeSection */}
            {activeSection === "menu" && (
              <Card className="p-4 mb-4">
                {/* Categories as swipeable slider */}
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />

                {/* Search Bar */}
                <div className="my-4">
                  <MenuSearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>

                {/* Menu Items List */}
                <div className="space-y-4 mt-4">
                  {filteredItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      isGridView={false}
                      handleOrderNow={handleOrderNow}
                    />
                  ))}
                </div>
              </Card>
            )}

            {activeSection === "deals" && <DealsSection />}

            {activeSection === "reviews" && <ReviewsSection />}
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3">
            <BestSellingProducts handleOrderNow={handleOrderNow} />
            <SaleProducts handleOrderNow={handleOrderNow} />
          </div>
        </div>
      </div>

      {/* Footer with credit to Wezsol - Moved to the bottom */}
      <div className="bg-gray-800 text-white py-4 mt-auto">
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

      <AlertDialog open={!!selectedItem}>
        {selectedItem && (
          <OrderDialog
            selectedItem={selectedItem}
            quantity={quantity}
            loyaltyPoints={loyaltyPoints}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            handleConfirmOrder={handleConfirmOrder}
            productVariations={productVariations}
            optionalItems={optionalItems}
          />
        )}
      </AlertDialog>
    </div>
  );
}
