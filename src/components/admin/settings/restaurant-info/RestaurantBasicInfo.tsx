
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSettings } from "@/types/settings";

interface RestaurantBasicInfoProps {
  settings: AppSettings;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string) => (checked: boolean) => void;
}

export const RestaurantBasicInfo: React.FC<RestaurantBasicInfoProps> = ({
  settings,
  onInputChange,
  onSwitchChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="restaurant_name">Restaurant Name</Label>
          <Input
            id="restaurant_name"
            name="restaurant_name"
            value={settings.restaurant_name || ''}
            onChange={onInputChange}
            placeholder="Enter restaurant name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="open_time">Opening Time</Label>
            <Input
              id="open_time"
              name="open_time"
              type="time"
              value={settings.open_time || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="close_time">Closing Time</Label>
            <Input
              id="close_time"
              name="close_time"
              type="time"
              value={settings.close_time || ''}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="is_open">Restaurant Currently Open</Label>
          <Switch
            id="is_open"
            checked={settings.is_open || false}
            onCheckedChange={onSwitchChange('is_open')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
