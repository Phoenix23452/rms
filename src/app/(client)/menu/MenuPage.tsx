"use client";
import React, { useState, useEffect } from "react";
import { CategoryFilter } from "@/components/customer/menu/CategoryFilter";
import { MenuSearchBar } from "@/components/customer/menu/MenuSearchBar";
import { MenuItemCard } from "@/components/customer/menu/MenuItemCard";
import { OrderDialog } from "@/components/customer/menu/order-dialog/OrderDialog";
import { useOrderDialog } from "@/hooks/customer/use-order-dialog";
import { useCart } from "@/hooks/customer/use-cart";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { HeroSlider } from "@/components/customer/menu/HeroSlider";
import { Card } from "@/components/ui/card";
import { DealsSection } from "@/components/customer/menu/DealsSection";
import { ReviewsSection } from "@/components/customer/menu/ReviewsSection";
import { BestSellingProducts } from "@/components/customer/menu/BestSellingProducts";
import { SaleProducts } from "@/components/customer/menu/SaleProducts";
import { MenuSidebar } from "@/components/customer/menu/MenuSidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MenuPage({
  isMobile,
  categories,
  products,
}: {
  isMobile: boolean;
  categories: Category[];
  products: Product[];
}) {
  // const [loyaltyPoints, setLoyaltyPoints] = useState(180);
  const navigate = useRouter();
  const { cartCount, updateCartCount } = useCart();
  const [activeSection, setActiveSection] = useState("menu");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = products?.filter((item) => {
    const lowerSearch = searchQuery.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.description?.toLowerCase().includes(lowerSearch) ||
      item.category?.name?.toLowerCase().includes(lowerSearch);
    const matchesCategory =
      activeCategory === "all" || String(item.category?.id) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const {
    selectedItem,
    setSelectedItem,
    quantity,
    handleOrderNow,
    increaseQuantity,
    decreaseQuantity,
    handleConfirmOrder,
    selectedVariant,
    setSelectedVariant,
    selectedOptionals,
    setSelectedOptionals,
  } = useOrderDialog(navigate, toast);

  console.log(selectedItem);

  // Update cart count when order is confirmed
  useEffect(() => {
    updateCartCount();
  }, []);

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
                  {filteredItems?.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
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

      <AlertDialog
        open={!!selectedItem}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedItem(null); // Close the dialog
          }
        }}
      >
        {selectedItem && (
          <OrderDialog
            selectedItem={selectedItem}
            quantity={quantity}
            // loyaltyPoints={loyaltyPoints}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            handleConfirmOrder={handleConfirmOrder}
            productVariations={selectedItem.variants}
            optionalItems={selectedItem.optionalItems}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            selectedOptionals={selectedOptionals}
            setSelectedOptionals={setSelectedOptionals}
          />
        )}
      </AlertDialog>
    </div>
  );
}
