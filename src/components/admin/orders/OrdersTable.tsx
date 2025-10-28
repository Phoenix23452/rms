import { Button } from "@/components/ui/button";
import OrderStatusBadge from "./OrderStatusBadge";
import { useRouter } from "next/navigation";
import Link from "next/link";

// This type allows us to accept either mock orders or real API orders
type OrdersTableProps = {
  orders: Order[];
};
enum PaymentType {
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  COD = "COD",
  CARD_PAYMENT = "CARD_PAYMENT",
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const navigate = useRouter();

  const handleViewOrder = (orderId: string) => {
    navigate.push(`/admin/orders/${orderId}`);
  };

  const getCustomerName = (order: Order) => {
    if (order.customer) return order.customer?.fullName || "Customer";
    return "Customer"; // For real orders, we don't have customer name yet
  };

  const getCustomerId = (order: Order) => {
    if (order.customer) return order.customer?.customerCode || "N/A";
  };

  const getOrderType = (order: Order) => {
    if (order.orderType) return order.orderType;
  };

  const getPaymentStatus = (order: Order) => {
    if (order.paymentMethod) return order.paymentMethod;
  };

  const getPaymentMethod = (order: Order) => {
    if (order.paymentMethod) return order.paymentMethod;
    return "N/A";
  };

  const getTotalAmount = (order: Order) => {
    if (order.total) return order.total;
    return 0;
  };

  const getDeliveryArea = (order: Order) => {
    const addrStr =
      typeof order.address === "string"
        ? order.address
        : JSON.stringify(order.address);
    const parts = addrStr
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    // Prefer the 3rd component (common for Google Maps: road, locality, city, country)
    if (parts.length >= 3) return parts[2].split(/\s+/)[0];
    // Fallback to the second-last component (city/locality)
    if (parts.length >= 2) return parts[parts.length - 2].split(/\s+/)[0];
    // Single-part address fallback
    if (parts.length === 1) return parts[0].split(/\s+/)[0];

    return "-";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-sm text-muted-foreground">
            <th className="py-3 px-2 text-left font-medium">Order ID</th>
            <th className="py-3 px-2 text-left font-medium">Customer</th>
            <th className="py-3 px-2 text-left font-medium">Type</th>
            <th className="py-3 px-2 text-left font-medium">Payment</th>
            <th className="py-3 px-2 text-left font-medium">Area</th>
            <th className="py-3 px-2 text-left font-medium">Status</th>
            <th className="py-3 px-2 text-left font-medium">Total</th>
            <th className="py-3 px-2 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => handleViewOrder(String(order.id))}
              >
                <td className="py-3 px-2">ORD- {order.id}</td>
                <td className="py-3 px-2">
                  <div>
                    <div className="font-medium">{getCustomerName(order)}</div>
                    <div className="text-sm text-muted-foreground">
                      {getCustomerId(order)}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">{getOrderType(order)}</td>
                <td className="py-3 px-2">
                  <div>
                    <div
                      className={
                        getPaymentStatus(order) === PaymentType.CARD_PAYMENT
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {getPaymentStatus(order) === PaymentType.CARD_PAYMENT
                        ? "Paid"
                        : "Unpaid"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getPaymentMethod(order)}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">{getDeliveryArea(order)}</td>
                <td className="py-3 px-2">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-3 px-2 font-medium">
                  ${getTotalAmount(order).toFixed(2)}
                </td>
                <td className="py-3 px-2">
                  <Link href={`/admin/orders/${order.id}`} passHref>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="py-6 text-center text-muted-foreground"
              >
                No orders found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
