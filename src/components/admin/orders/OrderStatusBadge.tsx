import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}
enum OrderStatus {
  PANDING = "PANDING",
  CONFIRMED = "CONFIRMED",
  DISPATCHED = "DISPATCHED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.PANDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case OrderStatus.CONFIRMED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case OrderStatus.DISPATCHED:
    case "preparing":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case OrderStatus.DELIVERED:
    case "out_for_delivery":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Completed":
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case OrderStatus.CANCELLED:
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "ready_for_pickup":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const formatOrderStatus = (status: string): string => {
  if (!status) return "";
  const lower = status.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const displayStatus = formatOrderStatus(status);
  return <Badge className={`${getStatusColor(status)}`}>{displayStatus}</Badge>;
};

export default OrderStatusBadge;
