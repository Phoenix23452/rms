"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Building,
  CreditCard,
  Clock,
  LogOut,
  Star,
  File,
  ShoppingBag,
  Save,
  Trash2,
  Plus,
  Gift,
} from "lucide-react";
import { LoyaltyCard } from "@/components/customer/LoyaltyCard";
import { useLoyalty } from "@/hooks/use-loyalty";
// import { AddAddressDialog } from "@/components/customer/profile/AddAddressDialog";
import { OrderDetailsDialog } from "@/components/customer/profile/OrderDetailsDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const userData = {
  id: "CUST-2451",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "2025-01-15T10:30:00",
  addresses: [
    {
      id: 1,
      type: "Home",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      address: "456 Business Ave, Suite 200",
      city: "New York",
      state: "NY",
      zipCode: "10013",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: "Credit Card",
      cardType: "Visa",
      last4: "4242",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Credit Card",
      cardType: "Mastercard",
      last4: "8765",
      expiryDate: "09/27",
      isDefault: false,
    },
  ],
  favorites: [
    {
      id: 1,
      name: "Classic Cheeseburger",
      image: "https://placehold.co/100x100",
      price: 8.99,
    },
    {
      id: 4,
      name: "Chicken Tenders",
      image: "https://placehold.co/100x100",
      price: 9.99,
    },
    {
      id: 7,
      name: "Chocolate Brownie",
      image: "https://placehold.co/100x100",
      price: 6.99,
    },
  ],
  recentOrders: [
    {
      id: "ORD-5290",
      date: "2025-04-02T18:45:00",
      status: "Delivered",
      total: 25.75,
      items: [
        { name: "Margherita Pizza", quantity: 1 },
        { name: "Garlic Bread", quantity: 1 },
        { name: "Coca Cola", quantity: 2 },
      ],
    },
    {
      id: "ORD-5283",
      date: "2025-03-28T13:15:00",
      status: "Delivered",
      total: 21.97,
      items: [
        { name: "Chicken Burger", quantity: 1 },
        { name: "French Fries", quantity: 1 },
        { name: "Chocolate Milkshake", quantity: 1 },
      ],
    },
  ],
  rewards: {
    points: 450,
    tier: "Silver",
    availableRewards: [
      {
        id: 1,
        name: "Free Delivery",
        points: 200,
        description: "Free delivery on your next order",
      },
      {
        id: 2,
        name: "10% Off",
        points: 300,
        description: "10% off your next order",
      },
      {
        id: 3,
        name: "Free Dessert",
        points: 500,
        description: "Free dessert with your next order",
      },
    ],
  },
};

const CustomerProfilePage = () => {
  // const { logout } = useAuth();
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  //   const { points, redeemPoints } = useLoyalty();

  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const handleSaveProfile = () => {
    toast.success("Profile updated", {
      description: "Your profile information has been saved.",
    });
  };

  const handleSetDefaultAddress = (id: number) => {
    toast.success("Default address updated", {
      description: "Your default address has been updated.",
    });
  };

  const handleDeleteAddress = (id: number) => {
    toast.success("Address removed", {
      description: "The address has been removed from your profile.",
    });
  };

  const handleSetDefaultPayment = (id: number) => {
    toast.success("Default payment method updated", {
      description: "Your default payment method has been updated.",
    });
  };

  const handleDeletePayment = (id: number) => {
    toast.success("Payment method removed", {
      description: "The payment method has been removed from your profile.",
    });
  };

  const handleRedeemReward = (id: number) => {
    // if (
    //   userData?.rewards.points >=
    //     userData.rewards.availableRewards.find((reward) => reward.id === id)
    //       ?.points ||
    //   0
    // ) {
    //   redeemPoints.mutate(
    //     userData.rewards.availableRewards.find((reward) => reward.id === id)
    //       ?.points || 0,
    //   );
    // } else {
    // }
    toast.success("Not enough points", {
      description: "You don't have enough points to redeem this reward.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate.push("/auth/login");

    toast("Logged out", {
      description: "You have been successfully logged out.",
    });
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrderForDetails(order);
    setIsOrderDetailsOpen(true);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar with user information */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                  {userData.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {userData.email}
                </p>
                <div className="flex items-center mt-2">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    {userData.rewards.tier} Member
                  </Badge>
                  <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                    {userData.rewards.points} Points
                  </Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <Clock className="inline-block h-3.5 w-3.5 mr-1" />
                  Member since{" "}
                  {new Date(userData.joinDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile tabs navigation */}
          <div className="md:hidden mb-6">
            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 w-full mb-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Desktop sidebar navigation */}
          <Card className="hidden md:block">
            <CardContent className="pt-6">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "profile" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "addresses" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "payments" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "orders" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Order History
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "favorites" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "rewards" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setActiveTab("rewards")}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Rewards
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area with tabs */}
        <div className="md:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-muted-foreground mr-2" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">About Me (Optional)</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your food preferences"
                        className="min-h-[100px]"
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Delivery Addresses</CardTitle>
                    <CardDescription>
                      Manage your delivery addresses
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsAddAddressOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Address
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            {address.type === "Home" ? (
                              <Home className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            ) : (
                              <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            )}
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{address.type}</h3>
                                {address.isDefault && (
                                  <Badge
                                    className="ml-2 text-xs"
                                    variant="outline"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{address.address}</p>
                              <p className="text-sm">
                                {address.city}, {address.state}{" "}
                                {address.zipCode}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSetDefaultAddress(address.id)
                                }
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payments" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.paymentMethods.map((method) => (
                      <div key={method.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <CreditCard className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">
                                  {method.cardType}
                                </h3>
                                {method.isDefault && (
                                  <Badge
                                    className="ml-2 text-xs"
                                    variant="outline"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">
                                •••• •••• •••• {method.last4}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expiryDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            {!method.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSetDefaultPayment(method.id)
                                }
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeletePayment(method.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="orders" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your previous orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.recentOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()} at{" "}
                              {new Date(order.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${order.total.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} items
                            </p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <File className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate.push("/orders")}
                  >
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Favorites Tab - Fixed design */}
            <TabsContent value="favorites" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Items</CardTitle>
                  <CardDescription>
                    Quickly reorder your favorite items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {userData.favorites.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-lg font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => {
                            toast(`Added ${item.name} to cart`);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate.push("/menu")}
                  >
                    Browse Menu
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards & Loyalty</CardTitle>
                  <CardDescription>
                    Earn points with every order and redeem for rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg p-6 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold">
                            {userData.rewards.tier} Member
                          </h3>
                          <p className="text-white/80">
                            Membership ID: {userData.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {userData.rewards.points}
                          </div>
                          <div className="text-white/80">Available Points</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm mb-1">
                          Next tier: Gold (750 points)
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{
                              width: `${(userData.rewards.points / 750) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Available Rewards</h3>
                      <div className="space-y-3">
                        {userData.rewards.availableRewards.map((reward) => (
                          <div
                            key={reward.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center">
                                  <Gift className="h-5 w-5 text-brand-500 mr-2" />
                                  <h4 className="font-medium">{reward.name}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {reward.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className="mb-2">
                                  {reward.points} Points
                                </Badge>
                                <Button
                                  size="sm"
                                  variant={
                                    userData.rewards.points >= reward.points
                                      ? "default"
                                      : "outline"
                                  }
                                  disabled={
                                    userData.rewards.points < reward.points
                                  }
                                  onClick={() => handleRedeemReward(reward.id)}
                                >
                                  Redeem
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <LoyaltyCard />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Address Dialog */}
      {/* <AddAddressDialog
        open={isAddAddressOpen}
        onOpenChange={setIsAddAddressOpen}
        onAddressAdded={() => {
          setIsAddAddressOpen(false);
          toast({
            title: "Address added",
            description: "Your new address has been saved successfully.",
          });
        }}
      /> */}

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={isOrderDetailsOpen}
        onOpenChange={setIsOrderDetailsOpen}
        order={selectedOrderForDetails}
      />
    </div>
  );
};

export default CustomerProfilePage;
