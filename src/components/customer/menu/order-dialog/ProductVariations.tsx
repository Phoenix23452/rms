import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Variation {
  id: number;
  name: string;
  price: number;
}

interface ProductVariationsProps {
  variations: Variation[];
  selectedVariation: number;
  onVariationChange: (variationId: number) => void;
}

export const ProductVariations = ({
  variations,
  selectedVariation,
  onVariationChange,
}: ProductVariationsProps) => {
  if (!variations || variations.length === 0) {
    return null;
  }
  console.log(variations);
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Select Size:</h3>
      <RadioGroup
        value={selectedVariation.toString()}
        onValueChange={(value) => onVariationChange(parseInt(value))}
        className="flex flex-wrap gap-2"
      >
        {variations.map((variation) => (
          <div key={variation.id} className="flex items-center">
            <RadioGroupItem
              value={variation.id.toString()}
              id={`variation-${variation.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`variation-${variation.id}`}
              className="flex items-center justify-between px-3 py-2 rounded-md border cursor-pointer peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary"
            >
              <span>{variation.name}</span>
              <span className="ml-2 text-sm font-semibold">
                ${variation.price.toFixed(2)}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
