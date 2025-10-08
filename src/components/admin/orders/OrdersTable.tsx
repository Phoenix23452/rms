import { Button } from "@/components/ui/button";
import OrderStatusBadge from "./OrderStatusBadge";
import { Order } from "@/services/orderService";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  customerId?: string;
  customerName?: string;
  orderType?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  totalAmount: number;
  deliveryArea?: string | null;
  status: string;
  orderDate?: string;

  // Possible real order properties
  order_number?: string;
  user_id?: string;
  delivery_option?: string;
  payment_status?: string;
  payment_method?: string;
  total_amount?: number;
  delivery_address?: {
    address_line: string;
    city: string;
    state: string;
    postal_code: string;
  };
  placed_at?: string;
}

// This type allows us to accept either mock orders or real API orders
type OrdersTableProps = {
  orders: (OrderItem | Order)[];
};

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const navigate = useRouter();

  const handleViewOrder = (orderId: string) => {
    navigate.push(`/admin/orders/${orderId}`);
  };

  const getCustomerName = (order: OrderItem | Order) => {
    if ("customerName" in order) return order.customerName || "Customer";
    return "Customer"; // For real orders, we don't have customer name yet
  };

  const getCustomerId = (order: OrderItem | Order) => {
    if ("customerId" in order) return order.customerId;
    if ("user_id" in order) return order.user_id;
    return "N/A";
  };

  const getOrderType = (order: OrderItem | Order) => {
    if ("orderType" in order) return order.orderType;
    if ("delivery_option" in order) return order.delivery_option;
    return "N/A";
  };

  const getPaymentStatus = (order: OrderItem | Order) => {
    if ("paymentStatus" in order) return order.paymentStatus;
    if ("payment_status" in order) return order.payment_status;
    return "N/A";
  };

  const getPaymentMethod = (order: OrderItem | Order) => {
    if ("paymentMethod" in order) return order.paymentMethod;
    if ("payment_method" in order) return order.payment_method;
    return "N/A";
  };

  const getTotalAmount = (order: OrderItem | Order) => {
    if ("totalAmount" in order) return order.totalAmount;
    if ("total_amount" in order) return order.total_amount || 0;
    return 0;
  };

  const getDeliveryArea = (order: OrderItem | Order) => {
    if ("deliveryArea" in order) return order.deliveryArea;
    if ("delivery_address" in order && order.delivery_address?.city)
      return order.delivery_address.city;
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
                onClick={() => handleViewOrder(order.id)}
              >
                <td className="py-3 px-2">
                  {"order_number" in order ? order.order_number : order.id}
                </td>
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
                        getPaymentStatus(order)?.toLowerCase() ===
                          "completed" || getPaymentStatus(order) === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {getPaymentStatus(order)}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOrder(order.id);
                    }}
                  >
                    View
                  </Button>
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
