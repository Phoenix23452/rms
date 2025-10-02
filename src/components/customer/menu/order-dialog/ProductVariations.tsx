import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductVariationsProps {
  variations: Variant[];
  selectedVariation: Variant | null;
  onVariationChange: (v: Variant) => void;
}

export const ProductVariations = ({
  variations,
  selectedVariation,
  onVariationChange,
}: ProductVariationsProps) => {
  if (!variations || variations.length === 0) {
    return null;
  }
  const handleChange = (value: string) => {
    const selected = variations.find((v) => v.id === Number(value));
    if (selected) {
      onVariationChange(selected);
    }
  };
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Select Size:</h3>
      <RadioGroup
        value={selectedVariation?.id.toString()}
        onValueChange={handleChange}
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
