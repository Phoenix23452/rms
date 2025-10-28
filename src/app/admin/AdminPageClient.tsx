"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Users,
  Utensils,
  DollarSign,
  Clock,
  CheckCheck,
  //   Truck,
  AlertCircle,
} from "lucide-react";

// Import charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data for sales chart
const salesData = [
  { name: "Mon", sales: 2400 },
  { name: "Tue", sales: 1398 },
  { name: "Wed", sales: 9800 },
  { name: "Thu", sales: 3908 },
  { name: "Fri", sales: 4800 },
  { name: "Sat", sales: 7800 },
  { name: "Sun", sales: 6800 },
];

// Mock data for order status
const orderStatusData = [
  { name: "Pending", value: 12, color: "#f59e0b" },
  { name: "Confirmed", value: 8, color: "#3b82f6" },
  { name: "Processing", value: 5, color: "#8b5cf6" },
  { name: "Delivered", value: 25, color: "#22c55e" },
  { name: "Cancelled", value: 2, color: "#ef4444" },
];

// Mock data for top products
const topProductsData = [
  { name: "Chicken Burger", orders: 125 },
  { name: "Pizza Margherita", orders: 98 },
  { name: "Fish & Chips", orders: 84 },
  { name: "Beef Steak", orders: 65 },
  { name: "Pasta Carbonara", orders: 49 },
];

// Recent orders data
const recentOrders = [
  {
    id: "ORD-5289",
    customer: "John Doe",
    status: "Pending",
    amount: 29.99,
    time: "10 mins ago",
    paymentMethod: "Card",
  },
  {
    id: "ORD-5288",
    customer: "Sarah Smith",
    status: "Confirmed",
    amount: 45.5,
    time: "25 mins ago",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-5287",
    customer: "Mike Johnson",
    status: "Processing",
    amount: 32.75,
    time: "1 hour ago",
    paymentMethod: "Card",
  },
  {
    id: "ORD-5286",
    customer: "Emily Brown",
    status: "Delivered",
    amount: 18.25,
    time: "3 hours ago",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-5285",
    customer: "Alex Williams",
    status: "Delivered",
    amount: 52.0,
    time: "5 hours ago",
    paymentMethod: "Card",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,429.32</div>
            <p className="text-xs text-muted-foreground mt-1">
              +20.1% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,834</div>
            <p className="text-xs text-muted-foreground mt-1">
              +4.3% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time-based charts */}
      <Tabs defaultValue="daily" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Revenue Overview</h2>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="mt-0">
          <Card>
            <CardContent className="py-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                  <Bar dataKey="sales" fill="#FF5C2C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-0">
          <Card>
            <CardContent className="py-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#FF5C2C"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-0">
          <Card>
            <CardContent className="py-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                  <Bar dataKey="sales" fill="#FF5C2C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order status and top products */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Order Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">12 Pending</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">8 Confirmed</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Utensils className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">5 Processing</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCheck className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">25 Delivered</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProductsData.map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center text-accent-foreground">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.orders} orders
                    </p>
                  </div>
                  <div className="w-1/3 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{
                        width: `${(product.orders / topProductsData[0].orders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Order ID</th>
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Payment</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="py-3 px-2">{order.customer}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`${order.paymentMethod === "Card" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"} text-xs px-2 py-0.5 rounded-full`}
                      >
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {order.status === "Pending" && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-yellow-500" />
                          <span className="text-yellow-500">
                            {order.status}
                          </span>
                        </div>
                      )}
                      {order.status === "Confirmed" && (
                        <div className="flex items-center">
                          <ShoppingBag className="mr-1 h-3 w-3 text-blue-500" />
                          <span className="text-blue-500">{order.status}</span>
                        </div>
                      )}
                      {order.status === "Processing" && (
                        <div className="flex items-center">
                          <Utensils className="mr-1 h-3 w-3 text-purple-500" />
                          <span className="text-purple-500">
                            {order.status}
                          </span>
                        </div>
                      )}
                      {order.status === "Delivered" && (
                        <div className="flex items-center">
                          <CheckCheck className="mr-1 h-3 w-3 text-green-500" />
                          <span className="text-green-500">{order.status}</span>
                        </div>
                      )}
                      {order.status === "Cancelled" && (
                        <div className="flex items-center">
                          <AlertCircle className="mr-1 h-3 w-3 text-red-500" />
                          <span className="text-red-500">{order.status}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2">${order.amount.toFixed(2)}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {order.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
