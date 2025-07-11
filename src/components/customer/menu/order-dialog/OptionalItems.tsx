
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Variation {
  id: number;
  name: string;
  price: number;
}

interface OptionalItem {
  id: number;
  name: string;
  variations: Variation[];
}

interface OptionalItemsProps {
  items: OptionalItem[];
  selectedOptionals: {[key: number]: number | null};
  onOptionalItemToggle: (itemId: number, checked: boolean) => void;
  onOptionalVariationChange: (itemId: number, variationId: number) => void;
}

export const OptionalItems = ({
  items,
  selectedOptionals,
  onOptionalItemToggle,
  onOptionalVariationChange
}: OptionalItemsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Optional Add-ons:</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`optional-${item.id}`}
                checked={selectedOptionals[item.id] !== undefined && selectedOptionals[item.id] !== null}
                onCheckedChange={(checked) => onOptionalItemToggle(item.id, !!checked)}
              />
              <Label htmlFor={`optional-${item.id}`} className="flex-grow">
                {item.name}
                <Badge variant="outline" className="ml-2">From ${item.variations[0].price.toFixed(2)}</Badge>
              </Label>
            </div>
            
            {selectedOptionals[item.id] !== undefined && selectedOptionals[item.id] !== null && (
              <div className="ml-6">
                <RadioGroup 
                  value={selectedOptionals[item.id]?.toString() || ''} 
                  onValueChange={(value) => onOptionalVariationChange(item.id, parseInt(value))}
                  className="flex flex-wrap gap-2"
                >
                  {item.variations.map((variation) => (
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
                        <span className="ml-2 font-semibold">${variation.price.toFixed(2)}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
