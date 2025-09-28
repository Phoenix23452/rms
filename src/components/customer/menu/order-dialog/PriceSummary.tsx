import React from "react";

interface PriceSummaryProps {
  basePrice: number;
  quantity: number;
  selectedOptionals: { [key: number]: number | null };
  optionalItems?: Product[];
  selectedVariationPrice: number;
  totalPrice: number;
  // loyaltyPoints?: any;
}

export const PriceSummary = ({
  basePrice,
  quantity,
  selectedOptionals,
  optionalItems,
  selectedVariationPrice,
  totalPrice,
  // loyaltyPoints
}: PriceSummaryProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>Base price:</span>
        <span className="font-medium">
          ${selectedVariationPrice.toFixed(2)} × {quantity}
        </span>
      </div>

      {Object.entries(selectedOptionals).map(([itemId, variationId]) => {
        if (variationId === null) return null;
        const item = optionalItems?.find((o) => o.id === parseInt(itemId));
        const variation = item?.variants.find((v) => v.id === variationId);
        if (!item || !variation) return null;

        return (
          <div
            key={`${itemId}-${variationId}`}
            className="flex items-center justify-between text-sm"
          >
            <span>
              {item.name} ({variation.name}):
            </span>
            <span>${variation.price.toFixed(2)}</span>
          </div>
        );
      })}

      <div className="flex items-center justify-between font-bold pt-2 border-t">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {/* {loyaltyPoints && (
        <div className="mt-4 p-2 bg-muted rounded-md text-sm">
          <p>You have {loyaltyPoints.points} loyalty points available</p>
          <p>You'll earn {Math.floor(totalPrice)} points with this order!</p>
        </div>
      )} */}
    </div>
  );
};
