import React, { useState } from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

import { ProductImage } from "./ProductImage";
import { ProductVariations } from "./ProductVariations";
import { QuantitySelector } from "./QuantitySelector";
import { OptionalItems } from "./OptionalItems";
import { PriceSummary } from "./PriceSummary";

interface OrderDialogProps {
  selectedItem: Product;
  quantity: number;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
  handleConfirmOrder: () => void;
  productVariations: Variant[];
  optionalItems?: Product[];
  selectedVariant: Variant | null;
  setSelectedVariant: (v: Variant | null) => void;
  selectedOptionals: Variant[];
  setSelectedOptionals: React.Dispatch<React.SetStateAction<Variant[]>>;
}

export const OrderDialog = ({
  selectedItem,
  quantity,
  decreaseQuantity,
  increaseQuantity,
  handleConfirmOrder,
  productVariations,
  optionalItems,
  selectedVariant,
  setSelectedVariant,
  selectedOptionals,
  setSelectedOptionals,
}: OrderDialogProps) => {
  // const [selectedVariant, setSelectedVariant] = useState(
  //   productVariations[0]?.id || 0,
  // );
  // const [selectedOptionals, setSelectedOptionals] = useState<{
  //   [key: number]: number | null;
  // }>({});

  if (!selectedItem) return null;

  const calculateTotalPrice = () => {
    let base = selectedVariant?.price || selectedItem.regularPrice;
    if (selectedItem.discountPercentage) {
      base = base - (base * selectedItem.discountPercentage) / 100;
    }
    let total = base * quantity;
    // Get base price from selected variation

    selectedOptionals?.forEach((opt) => {
      total += opt.price;
    });
    // Add optional items
    // Object.entries(selectedOptionals).forEach(([itemId, variationId]) => {
    //   if (variationId !== null) {
    //     const optionalItem = optionalItems?.find(
    //       (o) => o.id === parseInt(itemId),
    //     );
    //     if (optionalItem) {
    //       const optVariation = optionalItem.variants.find(
    //         (v: any) => v.id === variationId,
    //       );
    //       if (optVariation) {
    //         total += optVariation.price;
    //       }
    //     }
    //   }
    // });

    return total;
  };

  const handleOptionalItemToggle = (item: Product, checked: boolean) => {
    if (!item.variants.length) return;
    const variation = { ...item.variants[0], product: item };
    setSelectedOptionals((prev: Variant[]) =>
      checked
        ? [...prev, variation]
        : prev.filter((v) => v.productId !== item.id),
    );
  };

  const handleOptionalVariationChange = (
    item: Product,
    variationId: number,
  ) => {
    const variation = item.variants.find((v) => v.id === variationId);
    if (!variation) return;
    setSelectedOptionals((prev) => [
      ...prev.filter((v) => v.productId !== item.id),
      { ...variation, product: item },
    ]);
  };

  const getOrderSummary = () => {
    // Build an order summary object to pass to the confirmation handler
    const variation = productVariations.find(
      (v) => v.id === selectedVariant?.id,
    );

    const optionals = Object.entries(selectedOptionals)
      .filter(([_, variationId]) => variationId !== null)
      .map(([itemId, variationId]) => {
        const optionalItem = optionalItems?.find(
          (o) => o.id === parseInt(itemId),
        );
        const optVariation = optionalItem?.variants.find(
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
      variationId: selectedVariant,
      variationName: variation?.name,
      basePrice: variation?.price || selectedItem.regularPrice,
      quantity,
      optionals,
      totalPrice: calculateTotalPrice(),
    };
  };

  const handleConfirm = () => {
    // Pass the order summary to the confirm handler
    handleConfirmOrder();
  };

  // Get the selected variation's price
  const selectedVariationPrice =
    productVariations.find((v) => v.id === selectedVariant?.id)?.price ||
    selectedItem.regularPrice;

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
        <ProductImage
          image={selectedItem.image || ""}
          name={selectedItem.name}
        />

        {/* Product variations */}
        <ProductVariations
          variations={productVariations}
          selectedVariation={selectedVariant}
          onVariationChange={setSelectedVariant}
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
          basePrice={selectedItem.regularPrice}
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
