import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const navigate = useRouter();

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
      case "Preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <span>Order #{order.id}</span>
              <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.date).toLocaleDateString()} at{" "}
            {new Date(order.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium mb-3">Order Items</h3>
            <div className="border rounded-md divide-y">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3"
                >
                  <div>
                    <span className="font-medium">{item.quantity}x</span>{" "}
                    {item.name}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              {/* Order Summary */}
              <div className="space-y-2 p-3 bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(order.total - 2.99).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Type:</span>
                  <span>Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Restaurant:</span>
                  <span>Haji Sardar</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Delivery Address</h3>
              <div className="text-sm">
                <p>123 Main St, Apt 4B</p>
                <p>New York, NY 10001</p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="text-sm font-medium mb-3">Order Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-muted-foreground">
                  {new Date(order.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="ml-2">Order placed</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-muted-foreground">
                  {new Date(
                    Date.parse(order.date) + 5 * 60000,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="ml-2">Order confirmed</span>
              </div>
              {order.status === "Delivered" && (
                <>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-muted-foreground">
                      {new Date(
                        Date.parse(order.date) + 15 * 60000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="ml-2">Order prepared</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-muted-foreground">
                      {new Date(
                        Date.parse(order.date) + 25 * 60000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="ml-2">Out for delivery</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-muted-foreground">
                      {new Date(
                        Date.parse(order.date) + 45 * 60000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="ml-2">Order delivered</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {order.status === "Delivered" && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate.push("/menu");
                }}
                className="flex-1"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Reorder
              </Button>
            )}
            {order.status !== "Delivered" && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate.push(`/track/${order.id}`);
                }}
                className="flex-1"
              >
                <Clock className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
