"use client";
import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FilterIcon } from "lucide-react";
// import { getOrdersByStatus } from "@/services/orderService";
// import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import OrderFilters from "@/components/admin/orders/OrderFilters";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";

enum OrderStatus {
  PANDING = "PANDING",
  CONFIRMED = "CONFIRMED",
  DISPATCHED = "DISPATCHED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}
enum OrderType {
  PICKUP = "PICKUP",
  DINEIN = "DINEIN",
  DELIVERY = "DELIVERY",
}
enum PaymentType {
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  COD = "COD",
  CARD_PAYMENT = "CARD_PAYMENT",
}
const OrdersPage = ({ orders }: { orders: Order[] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("today");
  const [realOrders, setRealOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const filterOrders = async () => {
      try {
        setIsLoading(true);
        let statusFilter: OrderStatus[] = [];

        // Define which orders to fetch based on activeFilter
        // Use your enum instead of lowercase strings
        switch (activeFilter) {
          case "today":
          case "all":
          case "delivery":
          case "pickup":
          case "dine-in":
          case "paid":
          case "cod":
            statusFilter = [
              OrderStatus.PANDING,
              OrderStatus.CONFIRMED,
              OrderStatus.DISPATCHED,
              OrderStatus.DELIVERED,
              OrderStatus.CANCELLED,
            ];
            break;

          case "pending":
            statusFilter = [OrderStatus.PANDING];
            break;

          case "confirmed":
            statusFilter = [OrderStatus.CONFIRMED];
            break;

          case "out_for_delivery":
          case "dispatched":
            statusFilter = [OrderStatus.DISPATCHED];
            break;

          case "completed":
            statusFilter = [OrderStatus.DELIVERED];
            break;

          case "cancelled":
            statusFilter = [OrderStatus.CANCELLED];
            break;

          default:
            statusFilter = [OrderStatus.PANDING];
            break;
        }

        const data = await filterOrderByStatus(statusFilter);

        // Apply front-end filters
        let filteredData = [...data];

        // Filter by delivery option or payment details
        if (activeFilter === "delivery") {
          filteredData = filteredData.filter(
            (order) => order.orderType === OrderType.DELIVERY,
          );
        } else if (activeFilter === "pickup") {
          filteredData = filteredData.filter(
            (order) => order.orderType === OrderType.PICKUP,
          );
        } else if (activeFilter === "dine-in") {
          filteredData = filteredData.filter(
            (order) => order.orderType === OrderType.DINEIN,
          );
        } else if (activeFilter === "paid") {
          filteredData = filteredData.filter(
            (order) => order.paymentMethod === PaymentType.CARD_PAYMENT,
          );
        } else if (activeFilter === "cod") {
          filteredData = filteredData.filter(
            (order) => order.paymentMethod === PaymentType.COD,
            // order.payment_status === "pending",
          );
        } else if (activeFilter === "today") {
          // Filter for today's orders
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filteredData = filteredData.filter((order) => {
            const orderDate = new Date(order.createdAt);
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

    filterOrders();
  }, [activeFilter]);

  // Filter orders based on the active filter and search query
  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase.includes(query) ||
        order.customer?.fullName.toLowerCase().includes(query)
      );
    }

    // Here we're still using the mock data filters
    // This will be replaced by the real filters in the useEffect above
    if (activeFilter === "all") return true;
    if (activeFilter === "delivery")
      return order.orderType === OrderType.DELIVERY;
    if (activeFilter === "pickup") return order.orderType === OrderType.PICKUP;
    if (activeFilter === "dine-in") return order.orderType === OrderType.DINEIN;
    if (activeFilter === "paid")
      return order.paymentMethod === PaymentType.CARD_PAYMENT;
    if (activeFilter === "cod") return order.paymentMethod === PaymentType.COD;

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
