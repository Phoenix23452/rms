"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Eye,
  Truck,
  MoreVertical,
  User,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Dummy types
type RiderWithProfile = {
  id: string;
  is_active: boolean;
  profile: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  };
  current_latitude?: number;
  current_longitude?: number;
  last_location_update?: string;
  created_at?: string;
};

// Module-level dummy store so update functions can mutate it
const DUMMY_RIDERS: RiderWithProfile[] = [
  {
    id: "RID-001",
    is_active: true,
    profile: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      avatar_url: "",
    },
    current_latitude: 40.7128,
    current_longitude: -74.006,
    last_location_update: new Date().toISOString(),
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "RID-002",
    is_active: false,
    profile: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone: "",
      avatar_url: "",
    },
    // no location for this rider
    created_at: new Date("2024-06-15").toISOString(),
  },
];

// Simulate updating status (pretend API)
async function updateRiderStatus(id: string, isActive: boolean) {
  return new Promise<void>((resolve) => {
    const idx = DUMMY_RIDERS.findIndex((r) => r.id === id);
    if (idx >= 0) {
      DUMMY_RIDERS[idx] = {
        ...DUMMY_RIDERS[idx],
        is_active: isActive,
        last_location_update: new Date().toISOString(),
      };
    }
    setTimeout(resolve, 150);
  });
}

// Hook that provides dummy fetching behavior
function useDummyRiders() {
  const [data, setData] = useState<RiderWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = () => {
    setIsLoading(true);
    setError(null);
    // simulate network
    setTimeout(() => {
      setData([...DUMMY_RIDERS]); // return a shallow copy
      setIsLoading(false);
    }, 250);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  };
}

// Mock deliveries data
const mockDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-123",
    customerName: "John Doe",
    address: "123 Main St",
    status: "Completed",
    date: "2025-04-05T14:30:00",
    amount: 45.99,
  },
  {
    id: "DEL-002",
    orderId: "ORD-124",
    customerName: "Jane Smith",
    address: "456 Oak Ave",
    status: "In Progress",
    date: "2025-04-05T16:45:00",
    amount: 32.5,
  },
];

export default function RidersPageClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRider, setSelectedRider] = useState<RiderWithProfile | null>(
    null,
  );
  const [showProfile, setShowProfile] = useState(false);
  const [showDeliveries, setShowDeliveries] = useState(false);

  const { data: riders = [], isLoading, error, refetch } = useDummyRiders();

  // Filter riders based on search query
  const filteredRiders = riders.filter(
    (rider: any) =>
      rider.profile.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      rider.profile.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      rider.profile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStatusToggle = async (rider: RiderWithProfile) => {
    try {
      await updateRiderStatus(rider.id, !rider.is_active);
      toast("Status Updated", {
        description: `Rider status has been ${!rider.is_active ? "activated" : "deactivated"}.`,
      });
      refetch();
    } catch (error) {
      console.error("Error updating rider status:", error);
      toast.error("Error", {
        description: "Failed to update rider status.",
      });
    }
  };

  const handleViewProfile = (rider: RiderWithProfile) => {
    setSelectedRider(rider);
    setShowProfile(true);
  };

  const handleViewDeliveries = (rider: RiderWithProfile) => {
    setSelectedRider(rider);
    setShowDeliveries(true);
  };

  const handleCall = (rider: RiderWithProfile) => {
    if (rider.profile.phone) {
      window.open(`tel:${rider.profile.phone}`, "_self");
    } else {
      toast.error("No Phone Number", {
        description: "This rider doesn't have a phone number on file.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading riders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Failed to load riders</div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Riders</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search riders..."
              className="pl-8 w-full sm:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/admin/riders/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rider
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>All Riders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="py-3 px-4 text-left font-medium">Rider</th>
                  <th className="py-3 px-4 text-left font-medium">Contact</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Location</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Last Update
                  </th>
                  <th className="py-3 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.map((rider: any) => (
                  <tr
                    key={rider.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage
                            src={rider.profile.avatar_url || undefined}
                          />
                          <AvatarFallback>
                            {rider.profile.first_name?.charAt(0) || "R"}
                            {rider.profile.last_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {rider.profile.first_name} {rider.profile.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {rider.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-sm">
                            {rider.profile.email || "No email"}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-sm">
                            {rider.profile.phone || "No phone"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          rider.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {rider.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {rider.current_latitude && rider.current_longitude ? (
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-sm">
                            {rider.current_latitude.toFixed(4)},{" "}
                            {rider.current_longitude.toFixed(4)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No location
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {rider.last_location_update
                          ? new Date(
                              rider.last_location_update,
                            ).toLocaleString()
                          : "Never"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewProfile(rider)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[180px]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewProfile(rider)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewDeliveries(rider)}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              View Deliveries
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCall(rider)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call Rider
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(rider)}
                            >
                              {rider.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRiders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No riders found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rider Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rider Profile</DialogTitle>
          </DialogHeader>
          {selectedRider && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedRider.profile.avatar_url || undefined}
                  />
                  <AvatarFallback className="text-xl">
                    {selectedRider.profile.first_name?.charAt(0) || "R"}
                    {selectedRider.profile.last_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedRider.profile.first_name}{" "}
                    {selectedRider.profile.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Rider ID: {selectedRider.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">
                    {selectedRider.profile.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">
                    {selectedRider.profile.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    className={
                      selectedRider.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedRider.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm">
                    {new Date(
                      selectedRider.created_at || "",
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedRider.current_latitude &&
                selectedRider.current_longitude && (
                  <div>
                    <Label className="text-sm font-medium">
                      Current Location
                    </Label>
                    <p className="text-sm">
                      Lat: {selectedRider.current_latitude.toFixed(6)}, Lng:{" "}
                      {selectedRider.current_longitude.toFixed(6)}
                    </p>
                  </div>
                )}

              <div>
                <Label className="text-sm font-medium">
                  Last Location Update
                </Label>
                <p className="text-sm">
                  {selectedRider.last_location_update
                    ? new Date(
                        selectedRider.last_location_update,
                      ).toLocaleString()
                    : "Never updated"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rider Deliveries Dialog */}
      <Dialog open={showDeliveries} onOpenChange={setShowDeliveries}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Rider Deliveries</DialogTitle>
          </DialogHeader>
          {selectedRider && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedRider.profile.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {selectedRider.profile.first_name?.charAt(0) || "R"}
                    {selectedRider.profile.last_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {selectedRider.profile.first_name}{" "}
                    {selectedRider.profile.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Recent deliveries
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {mockDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{delivery.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {delivery.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Address: {delivery.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(delivery.date).toLocaleDateString()} at{" "}
                          {new Date(delivery.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${delivery.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            delivery.status === "Completed"
                              ? "text-green-600 border-green-600"
                              : "text-blue-600 border-blue-600"
                          }
                        >
                          {delivery.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
