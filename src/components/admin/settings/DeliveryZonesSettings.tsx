import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchDeliveryZones, updateDeliveryZone, createDeliveryZone } from "@/services/deliveryZonesService";
import { DeliveryZone, NewDeliveryZone } from "@/types/settings";
import { Trash2, Plus } from "lucide-react";

export const DeliveryZonesSettings: React.FC = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newZone, setNewZone] = useState<NewDeliveryZone>({ name: '', fee: 0 });

  useEffect(() => {
    const loadZones = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDeliveryZones();
        setZones(data);
      } catch (error) {
        console.error('Error loading delivery zones:', error);
        toast.error('Failed to load delivery zones');
      } finally {
        setIsLoading(false);
      }
    };

    loadZones();
  }, []);

  const handleZoneUpdate = async (zone: DeliveryZone) => {
    try {
      const updatedZone = await updateDeliveryZone(zone);
      if (updatedZone) {
        setZones(zones.map(z => z.id === zone.id ? updatedZone : z));
        toast.success('Delivery zone updated successfully');
      }
    } catch (error) {
      console.error('Error updating delivery zone:', error);
      toast.error('Failed to update delivery zone');
    }
  };

  const handleAddZone = async () => {
    if (!newZone.name || newZone.fee < 0) {
      toast.error('Please enter valid zone name and fee');
      return;
    }

    try {
      const createdZone = await createDeliveryZone(newZone);
      setZones([...zones, createdZone]);
      setNewZone({ name: '', fee: 0 });
      toast.success('Delivery zone added successfully');
    } catch (error) {
      console.error('Error creating delivery zone:', error);
      toast.error('Failed to add delivery zone');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading delivery zones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Zones */}
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Zone Name</Label>
                    <Input
                      value={zone.name}
                      onChange={(e) => {
                        const updatedZone = { ...zone, name: e.target.value };
                        setZones(zones.map(z => z.id === zone.id ? updatedZone : z));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Fee ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={zone.fee}
                      onChange={(e) => {
                        const updatedZone = { ...zone, fee: parseFloat(e.target.value) || 0 };
                        setZones(zones.map(z => z.id === zone.id ? updatedZone : z));
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => handleZoneUpdate(zone)}
                    className="w-full"
                  >
                    Update Zone
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Zone */}
          <div className="pt-4 border-t">
            <h4 className="text-lg font-medium mb-4">Add New Delivery Zone</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>Zone Name</Label>
                <Input
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="e.g., Downtown, Suburb Area"
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Fee ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newZone.fee}
                  onChange={(e) => setNewZone({ ...newZone, fee: parseFloat(e.target.value) || 0 })}
                  placeholder="5.00"
                />
              </div>
              <Button
                onClick={handleAddZone}
                className="w-full"
                disabled={!newZone.name}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Zone
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
