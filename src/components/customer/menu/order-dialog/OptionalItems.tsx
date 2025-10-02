import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OptionalItemsProps {
  items?: Product[];
  selectedOptionals: Variant[];
  onOptionalItemToggle: (item: Product, checked: boolean) => void;
  onOptionalVariationChange: (item: Product, variationId: number) => void;
}

export const OptionalItems = ({
  items,
  selectedOptionals,
  onOptionalItemToggle,
  onOptionalVariationChange,
}: OptionalItemsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Optional Add-ons:</h3>
      <div className="space-y-4">
        {items?.map((item) => {
          const selectedVariant = selectedOptionals.find(
            (v) => v.productId === item.id,
          );
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`optional-${item.id}`}
                  checked={!!selectedVariant}
                  onCheckedChange={(checked) =>
                    onOptionalItemToggle(item, !!checked)
                  }
                />
                <Label htmlFor={`optional-${item.id}`} className="flex-grow">
                  {item.name}
                  <Badge variant="outline" className="ml-2">
                    From ${item.variants[0].price.toFixed(2)}
                  </Badge>
                </Label>
              </div>

              {selectedVariant && (
                <div className="ml-6">
                  <RadioGroup
                    value={selectedVariant.id.toString() || ""}
                    onValueChange={(value) =>
                      onOptionalVariationChange(item, parseInt(value))
                    }
                    className="flex flex-wrap gap-2"
                  >
                    {item.variants.map((variation) => (
                      <div key={variation.id} className="flex items-center">
                        <RadioGroupItem
                          value={variation.id.toString()}
                          id={`opt-var-${variation.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`opt-var-${variation.id}`}
                          className="flex items-center justify-between px-3 py-1 text-sm rounded-md border cursor-pointer peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary"
                        >
                          <span>{variation.name}</span>
                          <span className="ml-2 font-semibold">
                            ${variation.price.toFixed(2)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
