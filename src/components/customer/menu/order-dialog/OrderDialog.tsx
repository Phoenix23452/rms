import React, { useState } from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { ProductImage } from "./ProductImage";
import { ProductVariations } from "./ProductVariations";
import { QuantitySelector } from "./QuantitySelector";
import { OptionalItems } from "./OptionalItems";
import { PriceSummary } from "./PriceSummary";

interface OrderDialogProps {
  selectedItem: any;
  quantity: number;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
  handleConfirmOrder: () => void;
  productVariations: any[];
  optionalItems: any[];
}

export const OrderDialog = ({
  selectedItem,
  quantity,
  decreaseQuantity,
  increaseQuantity,
  handleConfirmOrder,
  productVariations,
  optionalItems,
}: OrderDialogProps) => {
  const [selectedVariation, setSelectedVariation] = useState(
    productVariations[0]?.id || 0,
  );
  const [selectedOptionals, setSelectedOptionals] = useState<{
    [key: number]: number | null;
  }>({});

  if (!selectedItem) return null;

  const calculateTotalPrice = () => {
    // Get base price from selected variation
    const variation = productVariations.find((v) => v.id === selectedVariation);
    let total = (variation?.price || selectedItem.price) * quantity;

    // Add optional items
    Object.entries(selectedOptionals).forEach(([itemId, variationId]) => {
      if (variationId !== null) {
        const optionalItem = optionalItems.find(
          (o) => o.id === parseInt(itemId),
        );
        if (optionalItem) {
          const optVariation = optionalItem.variations.find(
            (v: any) => v.id === variationId,
          );
          if (optVariation) {
            total += optVariation.price;
          }
        }
      }
    });

    return total;
  };

  const handleOptionalItemToggle = (itemId: number, checked: boolean) => {
    setSelectedOptionals((prev) => ({
      ...prev,
      [itemId]: checked
        ? optionalItems.find((o) => o.id === itemId)?.variations[0]?.id || null
        : null,
    }));
  };

  const handleOptionalVariationChange = (
    itemId: number,
    variationId: number,
  ) => {
    setSelectedOptionals((prev) => ({
      ...prev,
      [itemId]: variationId,
    }));
  };

  const getOrderSummary = () => {
    // Build an order summary object to pass to the confirmation handler
    const variation = productVariations.find((v) => v.id === selectedVariation);

    const optionals = Object.entries(selectedOptionals)
      .filter(([_, variationId]) => variationId !== null)
      .map(([itemId, variationId]) => {
        const optionalItem = optionalItems.find(
          (o) => o.id === parseInt(itemId),
        );
        const optVariation = optionalItem?.variations.find(
          (v: any) => v.id === variationId,
        );
        return {
          itemId: parseInt(itemId),
          itemName: optionalItem?.name,
          variationId: variationId,
          variationName: optVariation?.name,
          price: optVariation?.price || 0,
        };
      });

    return {
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      variationId: selectedVariation,
      variationName: variation?.name,
      basePrice: variation?.price || selectedItem.price,
      quantity,
      optionals,
      totalPrice: calculateTotalPrice(),
    };
  };

  const handleConfirm = () => {
    const orderSummary = getOrderSummary();
    console.log("Order summary:", orderSummary);
    // Pass the order summary to the confirm handler
    handleConfirmOrder();
  };

  // Get the selected variation's price
  const selectedVariationPrice =
    productVariations.find((v) => v.id === selectedVariation)?.price ||
    selectedItem.price;

  return (
    <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <AlertDialogHeader>
        <AlertDialogTitle>Order Now</AlertDialogTitle>
        <AlertDialogDescription>
          Customize your order for {selectedItem?.name}.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="py-4">
        {/* Product image */}
        <ProductImage image={selectedItem.image} name={selectedItem.name} />

        {/* Product variations */}
        <ProductVariations
          variations={productVariations}
          selectedVariation={selectedVariation}
          onVariationChange={setSelectedVariation}
        />

        <Separator className="my-4" />

        {/* Quantity selector */}
        <QuantitySelector
          quantity={quantity}
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
        />

        <Separator className="my-4" />

        {/* Optional items */}
        <OptionalItems
          items={optionalItems}
          selectedOptionals={selectedOptionals}
          onOptionalItemToggle={handleOptionalItemToggle}
          onOptionalVariationChange={handleOptionalVariationChange}
        />

        <Separator className="my-4" />

        {/* Price summary */}
        <PriceSummary
          basePrice={selectedItem.price}
          quantity={quantity}
          selectedOptionals={selectedOptionals}
          optionalItems={optionalItems}
          selectedVariationPrice={selectedVariationPrice}
          totalPrice={calculateTotalPrice()}
          // loyaltyPoints={loyaltyPoints}
        />
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleConfirm}>
          Add to Cart
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
