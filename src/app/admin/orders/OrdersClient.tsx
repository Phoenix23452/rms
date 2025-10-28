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
import { getOrders } from "./actions";

enum OrderStatus {
  PENDING = "PENDING",
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
  const [timeFilter, setTimeFilter] = useState("this_month");
  const [remoteOrders, setRemoteOrders] = useState<Order[]>(orders);
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Sync SSR orders whenever prop changes (important for hydration + Fast Refresh)
  useEffect(() => {
    setRemoteOrders(orders ?? []);
  }, [orders]);

  // 🕐 Only fetch when timeFilter changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const freshOrders = await getOrders(timeFilter);
        setRemoteOrders(freshOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [timeFilter]);

  console.log("Remote Orders:", remoteOrders);
  console.log("Active Filter:", activeFilter);
  console.log("Orders:", orders);

  // 🧠 Apply all other filters locally (activeFilter + searchQuery)
  const filteredOrders = remoteOrders.filter((order) => {
    let match = true;

    // 🔍 Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      match =
        (order.id.toString().toLowerCase().includes(query) ||
          order.customer?.fullName?.toLowerCase().includes(query)) ??
        false;
    }

    // ⚙️ Status / Type / Payment filters
    if (activeFilter === "delivery") {
      match = match && order.orderType === OrderType.DELIVERY;
    } else if (activeFilter === "pickup") {
      match = match && order.orderType === OrderType.PICKUP;
    } else if (activeFilter === "dine-in") {
      match = match && order.orderType === OrderType.DINEIN;
    } else if (activeFilter === "paid") {
      match = match && order.paymentMethod === PaymentType.CARD_PAYMENT;
    } else if (activeFilter === "cod") {
      match = match && order.paymentMethod === PaymentType.COD;
    } else if (activeFilter === "pending") {
      match = match && order.status === OrderStatus.PENDING;
    } else if (activeFilter === "confirmed") {
      match = match && order.status === OrderStatus.CONFIRMED;
    } else if (activeFilter === "out_for_delivery") {
      match = match && order.status === OrderStatus.DISPATCHED;
    } else if (activeFilter === "completed") {
      match = match && order.status === OrderStatus.DELIVERED;
    } else if (activeFilter === "cancelled") {
      match = match && order.status === OrderStatus.CANCELLED;
    }

    return match;
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
          <OrdersTable orders={filteredOrders} />
        )}
      </OrdersTabs>
    </div>
  );
};

export default OrdersPage;
