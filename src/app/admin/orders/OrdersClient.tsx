"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { getOrdersByStatus, Order, OrderStatus } from "@/services/orderService";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import OrderFilters from "@/components/admin/orders/OrderFilters";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";

// Mock data for orders (later this will be replaced by actual API calls)
const orders = [
  {
    id: "ORD-5291",
    customerId: "CUST-2451",
    customerName: "John Smith",
    orderType: "Delivery",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    totalAmount: 32.5,
    deliveryArea: "Downtown",
    status: "Pending",
    orderDate: "2025-04-08T14:30:00",
  },
  {
    id: "ORD-5290",
    customerId: "CUST-1872",
    customerName: "Sarah Johnson",
    orderType: "Pickup",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    totalAmount: 18.75,
    deliveryArea: null,
    status: "Confirmed",
    orderDate: "2025-04-08T13:45:00",
  },
  {
    id: "ORD-5289",
    customerId: "CUST-3214",
    customerName: "Michael Brown",
    orderType: "Delivery",
    paymentStatus: "Unpaid",
    paymentMethod: "COD",
    totalAmount: 45.2,
    deliveryArea: "Westside",
    status: "Processing",
    orderDate: "2025-04-08T12:15:00",
  },
  {
    id: "ORD-5288",
    customerId: "CUST-9012",
    customerName: "Emily Davis",
    orderType: "Dine-in",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    totalAmount: 65.3,
    deliveryArea: null,
    status: "Completed",
    orderDate: "2025-04-08T11:30:00",
  },
  {
    id: "ORD-5287",
    customerId: "CUST-7653",
    customerName: "David Wilson",
    orderType: "Delivery",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    totalAmount: 27.4,
    deliveryArea: "Eastside",
    status: "Out for Delivery",
    orderDate: "2025-04-08T10:45:00",
  },
];

const OrdersPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("today");
  const [realOrders, setRealOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        let statusFilter: OrderStatus | OrderStatus[] = "pending";

        // Define which orders to fetch based on activeFilter
        switch (activeFilter) {
          case "today":
            statusFilter = [
              "pending",
              "confirmed",
              "preparing",
              "ready_for_pickup",
              "out_for_delivery",
              "delivered",
              "cancelled",
            ];
            break;
          case "pending":
            statusFilter = "pending";
            break;
          case "confirmed":
            statusFilter = "confirmed";
            break;
          case "out_for_delivery":
            statusFilter = "out_for_delivery";
            break;
          case "completed":
            statusFilter = "delivered";
            break;
          case "all":
            statusFilter = [
              "pending",
              "confirmed",
              "preparing",
              "ready_for_pickup",
              "out_for_delivery",
              "delivered",
              "cancelled",
            ];
            break;
          case "delivery":
          case "pickup":
          case "dine-in":
          case "paid":
          case "cod":
            // Fetch all and filter on front-end
            statusFilter = [
              "pending",
              "confirmed",
              "preparing",
              "ready_for_pickup",
              "out_for_delivery",
              "delivered",
              "cancelled",
            ];
            break;
        }

        const data = await getOrdersByStatus(statusFilter);

        // Apply front-end filters
        let filteredData = [...data];

        // Filter by delivery option or payment details
        if (activeFilter === "delivery") {
          filteredData = filteredData.filter(
            (order) => order.delivery_option === "delivery",
          );
        } else if (activeFilter === "pickup") {
          filteredData = filteredData.filter(
            (order) => order.delivery_option === "pickup",
          );
        } else if (activeFilter === "dine-in") {
          filteredData = filteredData.filter(
            (order) => order.delivery_option === "dine-in",
          );
        } else if (activeFilter === "paid") {
          filteredData = filteredData.filter(
            (order) => order.payment_status === "completed",
          );
        } else if (activeFilter === "cod") {
          filteredData = filteredData.filter(
            (order) =>
              order.payment_method === "cash" &&
              order.payment_status === "pending",
          );
        } else if (activeFilter === "today") {
          // Filter for today's orders
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filteredData = filteredData.filter((order) => {
            const orderDate = new Date(order.placed_at);
            return orderDate >= today;
          });
        }

        setRealOrders(filteredData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [activeFilter]);

  // Filter orders based on the active filter and search query
  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query)
      );
    }

    // Here we're still using the mock data filters
    // This will be replaced by the real filters in the useEffect above
    if (activeFilter === "all") return true;
    if (activeFilter === "delivery") return order.orderType === "Delivery";
    if (activeFilter === "pickup") return order.orderType === "Pickup";
    if (activeFilter === "dine-in") return order.orderType === "Dine-in";
    if (activeFilter === "paid") return order.paymentStatus === "Paid";
    if (activeFilter === "cod") return order.paymentMethod === "COD";

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <OrderFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
            />
          </div>
        </div>
      </div>

      <OrdersTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter}>
        {isLoading ? (
          <div className="py-8 text-center">Loading orders...</div>
        ) : (
          <OrdersTable
            orders={realOrders.length > 0 ? realOrders : filteredOrders}
          />
        )}
      </OrdersTabs>
    </div>
  );
};

export default OrdersPage;
