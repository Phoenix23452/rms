
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RestaurantInfoSettings } from "./RestaurantInfoSettings";
import { DeliveryZonesSettings } from "./DeliveryZonesSettings";
import { RestaurantLocationsSettings } from "./RestaurantLocationsSettings";
import { WalletSettings } from "./WalletSettings";

export const SettingsGrid: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="restaurant">Restaurant Info</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Zones</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="restaurant">
          <RestaurantInfoSettings />
        </TabsContent>
        
        <TabsContent value="locations">
          <RestaurantLocationsSettings />
        </TabsContent>
        
        <TabsContent value="delivery">
          <DeliveryZonesSettings />
        </TabsContent>
        
        <TabsContent value="wallet">
          <WalletSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
