import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSettings } from "@/types/settings";

interface OrderSettingsProps {
  settings: any;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const OrderSettings: React.FC<OrderSettingsProps> = ({
  settings,
  onInputChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="min_order_amount">Minimum Order Amount ($)</Label>
          <Input
            id="min_order_amount"
            name="min_order_amount"
            type="number"
            value={settings.min_order_amount || 0}
            onChange={onInputChange}
            min="0"
            step="0.01"
            placeholder="10.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_percentage">Tax Percentage (%)</Label>
          <Input
            id="tax_percentage"
            name="tax_percentage"
            type="number"
            value={settings.tax_percentage || 0}
            onChange={onInputChange}
            min="0"
            max="100"
            step="0.1"
            placeholder="10"
          />
        </div>
      </CardContent>
    </Card>
  );
};
