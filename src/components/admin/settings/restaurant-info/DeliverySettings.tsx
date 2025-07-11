
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSettings } from "@/types/settings";

interface DeliverySettingsProps {
  settings: AppSettings;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const DeliverySettings: React.FC<DeliverySettingsProps> = ({
  settings,
  onInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="base_delivery_fee">Base Delivery Fee ($)</Label>
          <Input
            id="base_delivery_fee"
            name="base_delivery_fee"
            type="number"
            value={settings.base_delivery_fee || 0}
            onChange={onInputChange}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fee_per_km">Additional Fee per KM ($)</Label>
          <Input
            id="fee_per_km"
            name="fee_per_km"
            type="number"
            value={settings.fee_per_km || 0}
            onChange={onInputChange}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max_delivery_distance">Maximum Delivery Distance (km)</Label>
          <Input
            id="max_delivery_distance"
            name="max_delivery_distance"
            type="number"
            value={settings.max_delivery_distance || 0}
            onChange={onInputChange}
            min="1"
            step="0.5"
            placeholder="10"
          />
        </div>
      </CardContent>
    </Card>
  );
};
