
import React from "react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
}

export const QuantitySelector = ({
  quantity,
  decreaseQuantity,
  increaseQuantity
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <span>Quantity:</span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={decreaseQuantity}>-</Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button size="sm" variant="outline" onClick={increaseQuantity}>+</Button>
      </div>
    </div>
  );
};
