"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  SearchIcon,
  FilterIcon,
  //   User,
  Mail,
  Phone,
  //   MapPin,
  Calendar,
  MoreVertical,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for customers
const customersData = [
  {
    id: "CUST-2451",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    joinDate: "2025-01-15T10:30:00",
    orders: 12,
    totalSpent: 351.75,
    lastOrder: "2025-04-05T14:30:00",
    status: "Active",
    isFrequent: true,
  },
  {
    id: "CUST-1872",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    joinDate: "2025-02-20T09:15:00",
    orders: 8,
    totalSpent: 215.4,
    lastOrder: "2025-04-02T18:45:00",
    status: "Active",
    isFrequent: true,
  },
  {
    id: "CUST-3214",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine St, Chicago, IL 60007",
    joinDate: "2024-11-10T16:20:00",
    orders: 5,
    totalSpent: 122.85,
    lastOrder: "2025-03-25T12:10:00",
    status: "Active",
    isFrequent: false,
  },
  {
    id: "CUST-9012",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 234-5678",
    address: "101 Elm St, Boston, MA 02108",
    joinDate: "2025-03-05T11:45:00",
    orders: 3,
    totalSpent: 87.25,
    lastOrder: "2025-04-01T19:30:00",
    status: "Active",
    isFrequent: false,
  },
  {
    id: "CUST-7653",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+1 (555) 876-5432",
    address: "202 Maple Ave, Seattle, WA 98101",
    joinDate: "2024-12-15T08:30:00",
    orders: 10,
    totalSpent: 298.6,
    lastOrder: "2025-03-28T13:15:00",
    status: "Active",
    isFrequent: true,
  },
  {
    id: "CUST-5421",
    name: "Jennifer Garcia",
    email: "jennifer.g@example.com",
    phone: "+1 (555) 345-6789",
    address: "303 Cedar St, Miami, FL 33101",
    joinDate: "2024-10-22T13:20:00",
    orders: 15,
    totalSpent: 412.3,
    lastOrder: "2025-04-06T17:40:00",
    status: "Active",
    isFrequent: true,
  },
  {
    id: "CUST-4367",
    name: "Robert Martinez",
    email: "robert.m@example.com",
    phone: "+1 (555) 567-8901",
    address: "404 Birch Rd, Austin, TX 78701",
    joinDate: "2025-01-30T10:10:00",
    orders: 6,
    totalSpent: 143.75,
    lastOrder: "2025-03-20T11:25:00",
    status: "Inactive",
    isFrequent: false,
  },
  {
    id: "CUST-8912",
    name: "Amanda Thompson",
    email: "amanda.t@example.com",
    phone: "+1 (555) 678-9012",
    address: "505 Walnut Dr, Denver, CO 80201",
    joinDate: "2024-11-05T14:50:00",
    orders: 9,
    totalSpent: 267.9,
    lastOrder: "2025-03-18T15:55:00",
    status: "Active",
    isFrequent: true,
  },
];

// Mock data for product reviews
const reviewsData = [
  {
    id: 1,
    customerId: "CUST-2451",
    customerName: "John Smith",
    productName: "Chicken Burger",
    rating: 5,
    review: "Absolutely delicious! Best burger I've had in a long time.",
    date: "2025-04-05T14:35:00",
  },
  {
    id: 2,
    customerId: "CUST-1872",
    customerName: "Sarah Johnson",
    productName: "Margherita Pizza",
    rating: 4,
    review: "Really tasty pizza, but could use a bit more cheese.",
    date: "2025-04-02T18:50:00",
  },
  {
    id: 3,
    customerId: "CUST-7653",
    customerName: "David Wilson",
    productName: "Grilled Fish",
    rating: 5,
    review: "Perfectly cooked, flavorful and fresh. Will order again!",
    date: "2025-03-28T13:20:00",
  },
  {
    id: 4,
    customerId: "CUST-5421",
    customerName: "Jennifer Garcia",
    productName: "Chocolate Milkshake",
    rating: 5,
    review: "So creamy and rich, absolutely perfect!",
    date: "2025-04-06T17:45:00",
  },
  {
    id: 5,
    customerId: "CUST-3214",
    customerName: "Michael Brown",
    productName: "French Fries",
    rating: 3,
    review: "Decent fries, but they could be crispier.",
    date: "2025-03-25T12:15:00",
  },
];

// Mock orders data for customer
const mockCustomerOrders = [
  {
    id: "ORD-001",
    date: "2025-04-05T14:30:00",
    total: 45.99,
    status: "Delivered",
    items: ["Chicken Burger", "Fries", "Coke"],
  },
  {
    id: "ORD-002",
    date: "2025-03-28T18:45:00",
    total: 32.5,
    status: "Delivered",
    items: ["Pizza Margherita", "Garlic Bread"],
  },
];

export default function CustomersPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  // Filter customers based on search query and active tab
  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (tab === "all") return matchesSearch;
    if (tab === "frequent") return matchesSearch && customer.isFrequent;
    if (tab === "recent") {
      const lastOrderDate = new Date(customer.lastOrder);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && lastOrderDate > thirtyDaysAgo;
    }
    return matchesSearch;
  });

  const handleViewProfile = (customer: any) => {
    setSelectedCustomer(customer);
    setShowProfile(true);
  };

  const handleViewOrders = (customer: any) => {
    setSelectedCustomer(customer);
    setShowOrders(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-full sm:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="frequent">Frequent Customers</TabsTrigger>
            <TabsTrigger value="recent">Recent Customers</TabsTrigger>
          </TabsList>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="orders-desc">Most Orders</SelectItem>
              <SelectItem value="spent-desc">Highest Spent</SelectItem>
              <SelectItem value="date-desc">Newest Joined</SelectItem>
              <SelectItem value="date-asc">Oldest Joined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground">
                      <th className="py-3 px-4 text-left font-medium">
                        Customer
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Contact
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Joined
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Orders
                      </th>
                      <th className="py-3 px-4 text-left font-medium">Spent</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Status
                      </th>
                      <th className="py-3 px-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {customer.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                              <span className="text-sm">{customer.email}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                              <span className="text-sm">{customer.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-sm">
                              {new Date(customer.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{customer.orders}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ${customer.totalSpent.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              customer.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewProfile(customer)}
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
                                  onClick={() => handleViewProfile(customer)}
                                >
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleViewOrders(customer)}
                                >
                                  View Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem>Send Email</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                  Block Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No customers found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequent" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {/* Frequent customers table with same structure as all customers table */}
              <table className="w-full border-collapse">
                {/* Table header and body similar to all customers */}
                <thead>
                  <tr className="border-b border-border text-sm text-muted-foreground">
                    <th className="py-3 px-4 text-left font-medium">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Contact</th>
                    <th className="py-3 px-4 text-left font-medium">Orders</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Total Spent
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Last Order
                    </th>
                    <th className="py-3 px-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm">{customer.email}</span>
                          <span className="text-sm text-muted-foreground">
                            {customer.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{customer.orders}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No frequent customers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {/* Recent customers table structure */}
              <table className="w-full border-collapse">
                {/* Similar table header and body */}
                <thead>
                  <tr className="border-b border-border text-sm text-muted-foreground">
                    <th className="py-3 px-4 text-left font-medium">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Contact</th>
                    <th className="py-3 px-4 text-left font-medium">Joined</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Last Order
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Amount</th>
                    <th className="py-3 px-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{customer.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No recent customers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xl">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Orders</Label>
                  <p className="text-sm">{selectedCustomer.orders}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Spent</Label>
                  <p className="text-sm">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm">{selectedCustomer.address}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Member Since</Label>
                <p className="text-sm">
                  {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Customer Orders Dialog */}
      <Dialog open={showOrders} onOpenChange={setShowOrders}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Orders</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.orders} total orders
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {mockCustomerOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()} at{" "}
                          {new Date(order.date).toLocaleTimeString()}
                        </p>
                        <p className="text-sm mt-1">
                          Items: {order.items.join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <Badge variant="outline" className="mt-1">
                          {order.status}
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

      <Card>
        <CardHeader>
          <CardTitle>Product Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewsData.map((review) => (
              <div key={review.id} className="border-b border-border pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{review.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {review.customerId}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-2">
                      {review.productName}
                    </span>
                    <div className="text-amber-400 text-xs">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-sm">{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
