import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  fetchRestaurantLocations,
  updateRestaurantLocation,
  createRestaurantLocation,
} from "@/services/restaurantLocationsService";
// import { RestaurantLocation, NewRestaurantLocation } from "@/types/settings";
import { MapPin, Plus, Edit } from "lucide-react";

export const RestaurantLocationsSettings: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState<any>({
    name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    email: "",
    is_main_branch: false,
    is_active: true,
    opens_at: "09:00",
    closes_at: "22:00",
  });

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRestaurantLocations();
        setLocations(data);
      } catch (error) {
        console.error("Error loading restaurant locations:", error);
        toast.error("Failed to load restaurant locations");
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleLocationUpdate = async (location: any) => {
    try {
      const updatedLocation = await updateRestaurantLocation(location);
      if (updatedLocation) {
        setLocations(
          locations.map((l) => (l.id === location.id ? updatedLocation : l)),
        );
        toast.success("Restaurant location updated successfully");
      }
    } catch (error) {
      console.error("Error updating restaurant location:", error);
      toast.error("Failed to update restaurant location");
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.address || !newLocation.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const createdLocation = await createRestaurantLocation(newLocation);
      setLocations([...locations, createdLocation]);
      setNewLocation({
        name: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        phone: "",
        email: "",
        is_main_branch: false,
        is_active: true,
        opens_at: "09:00",
        closes_at: "22:00",
      });
      setShowAddForm(false);
      toast.success("Restaurant location added successfully");
    } catch (error) {
      console.error("Error creating restaurant location:", error);
      toast.error("Failed to add restaurant location");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading restaurant locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Restaurant Locations</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Location
        </Button>
      </div>

      {/* Add New Location Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Restaurant Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location Name *</Label>
                <Input
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                  placeholder="Main Branch, Downtown Location"
                />
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input
                  value={newLocation.address}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, address: e.target.value })
                  }
                  placeholder="123 Main Street"
                />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={newLocation.city}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, city: e.target.value })
                  }
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={newLocation.state}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, state: e.target.value })
                  }
                  placeholder="NY"
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={newLocation.postal_code}
                  onChange={(e) =>
                    setNewLocation({
                      ...newLocation,
                      postal_code: e.target.value,
                    })
                  }
                  placeholder="10001"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newLocation.phone || ""}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newLocation.email || ""}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, email: e.target.value })
                  }
                  placeholder="branch@restaurant.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Opening Hours</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={newLocation.opens_at}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        opens_at: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="time"
                    value={newLocation.closes_at}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        closes_at: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newLocation.is_main_branch}
                  onCheckedChange={(checked) =>
                    setNewLocation({ ...newLocation, is_main_branch: checked })
                  }
                />
                <Label>Main Branch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newLocation.is_active}
                  onCheckedChange={(checked) =>
                    setNewLocation({ ...newLocation, is_active: checked })
                  }
                />
                <Label>Active</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddLocation}>Add Location</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {location.name}
                  {location.is_main_branch && (
                    <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                      Main
                    </span>
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={location.is_active}
                    onCheckedChange={(checked) => {
                      const updatedLocation = {
                        ...location,
                        is_active: checked,
                      };
                      setLocations(
                        locations.map((l) =>
                          l.id === location.id ? updatedLocation : l,
                        ),
                      );
                      handleLocationUpdate(updatedLocation);
                    }}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {location.address}, {location.city}, {location.state}{" "}
                  {location.postal_code}
                </p>
              </div>

              {location.phone && (
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {location.phone}
                  </p>
                </div>
              )}

              {location.email && (
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {location.email}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">
                  {location.opens_at} - {location.closes_at}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
