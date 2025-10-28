"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  User,
  MapPin,
  Clock,
  CreditCard,
  Package,
  Phone,
  Printer,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Mock order data
const orderData = {
  id: "ORD-5291",
  customerId: "CUST-2451",
  customerName: "John Smith",
  customerPhone: "+1 (555) 123-4567",
  orderType: "Delivery",
  paymentStatus: "Paid",
  paymentMethod: "Card",
  cardLast4: "1234",
  totalAmount: 32.5,
  subtotal: 27.5,
  deliveryFee: 5.0,
  tax: 2.75,
  discount: 0,
  tip: 4.0,
  deliveryAddress: "123 Main St, Apt 4B, Downtown, NY 10001",
  deliveryArea: "Downtown",
  status: "Pending",
  orderDate: "2025-04-08T14:30:00",
  deliveryNotes: "Please leave at the door, no contact delivery.",
  assignedRider: null,
  items: [
    {
      id: 1,
      name: "Chicken Burger",
      variant: "Regular",
      quantity: 1,
      price: 8.5,
      total: 8.5,
    },
    {
      id: 2,
      name: "Fries",
      variant: "Large",
      quantity: 1,
      price: 4.0,
      total: 4.0,
    },
    {
      id: 3,
      name: "Coca Cola",
      variant: "Medium",
      quantity: 2,
      price: 2.5,
      total: 5.0,
    },
    {
      id: 4,
      name: "Chicken Wings",
      variant: "Spicy (8pcs)",
      quantity: 1,
      price: 10.0,
      total: 10.0,
    },
  ],
  statusHistory: [
    {
      status: "Order Placed",
      timestamp: "2025-04-08T14:30:00",
      note: "Order placed by customer",
    },
    {
      status: "Payment Received",
      timestamp: "2025-04-08T14:31:00",
      note: "Payment processed successfully",
    },
  ],
};

// Mock riders data
const availableRiders = [
  {
    id: 1,
    name: "Mike Wilson",
    status: "Available",
    orders: 0,
    phone: "+1 (555) 234-5678",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    status: "Available",
    orders: 1,
    phone: "+1 (555) 987-6543",
  },
  {
    id: 3,
    name: "David Brown",
    status: "Busy",
    orders: 2,
    phone: "+1 (555) 876-5432",
  },
  {
    id: 4,
    name: "Emma Clark",
    status: "Available",
    orders: 1,
    phone: "+1 (555) 345-6789",
  },
  {
    id: 5,
    name: "Robert Lee",
    status: "Available",
    orders: 0,
    phone: "+1 (555) 456-7890",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Out for Delivery":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const OrderByIdClient = ({ id }: { id: string }) => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(orderData.status);
  const [selectedRider, setSelectedRider] = useState<string>("");
  const [assigningRider, setAssigningRider] = useState(false);
  const [orderPreparationTime, setOrderPreparationTime] = useState("15");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("30");
  const [showAssignRiderDialog, setShowAssignRiderDialog] = useState(false);

  // Timer state for order preparation countdown
  const [preparationTimeLeft, setPreparationTimeLeft] = useState<number | null>(
    null,
  );

  const handleStatusChange = (newStatus: string) => {
    if (orderStatus === "Pending" && newStatus === "confirmed") {
      setOrderStatus("Confirmed");

      // Add a new status entry to the history
      const newStatusEntry = {
        status: "Order Confirmed",
        timestamp: new Date().toISOString(),
        note: "Order confirmed by restaurant",
      };

      orderData.statusHistory.push(newStatusEntry);

      // Start preparation timer if confirmed
      setPreparationTimeLeft(parseInt(orderPreparationTime) * 60);

      toast("Order Status Updated", {
        description: "Order has been confirmed and kitchen notified.",
      });
    } else if (orderStatus === "Confirmed" && newStatus === "processing") {
      setOrderStatus("Processing");

      // Add a new status entry to the history
      const newStatusEntry = {
        status: "Order Processing",
        timestamp: new Date().toISOString(),
        note: "Order is being prepared by the kitchen",
      };

      orderData.statusHistory.push(newStatusEntry);

      toast("Order Status Updated", {
        description: "Order is now being prepared by the kitchen.",
      });
    } else if (orderStatus === "Processing" && newStatus === "ready") {
      if (orderData.orderType === "Delivery" && !selectedRider) {
        setShowAssignRiderDialog(true);
        return;
      }

      setOrderStatus("Ready");

      // Add a new status entry to the history
      const newStatusEntry = {
        status: "Order Ready",
        timestamp: new Date().toISOString(),
        note:
          orderData.orderType === "Delivery"
            ? "Order ready for delivery"
            : "Order ready for pickup",
      };

      orderData.statusHistory.push(newStatusEntry);

      toast("Order Status Updated", {
        description: `Order is now ready for ${orderData.orderType.toLowerCase()}.`,
      });
    } else if (newStatus === "out-for-delivery") {
      if (!selectedRider) {
        setShowAssignRiderDialog(true);
        return;
      }

      setOrderStatus("Out for Delivery");

      // Add a new status entry to the history
      const newStatusEntry = {
        status: "Out for Delivery",
        timestamp: new Date().toISOString(),
        note: `Order picked up by rider for delivery. Estimated delivery time: ${estimatedDeliveryTime} minutes`,
      };

      orderData.statusHistory.push(newStatusEntry);

      toast("Order Status Updated", {
        description: "Order is now out for delivery.",
      });
    } else if (newStatus === "completed") {
      setOrderStatus("Completed");

      // Add a new status entry to the history
      const newStatusEntry = {
        status: "Order Completed",
        timestamp: new Date().toISOString(),
        note:
          orderData.orderType === "Delivery"
            ? "Order delivered to customer"
            : orderData.orderType === "Pickup"
              ? "Order picked up by customer"
              : "Customer has completed dining",
      };

      orderData.statusHistory.push(newStatusEntry);

      toast("Order Completed", {
        description: "Order has been successfully completed.",
      });
    } else if (newStatus === "cancelled") {
      setOrderStatus("Cancelled");

      // Add a new status entry to the history
      const newStatusEntry = {
        status: "Order Cancelled",
        timestamp: new Date().toISOString(),
        note: "Order has been cancelled",
      };

      orderData.statusHistory.push(newStatusEntry);

      toast.error("Order Cancelled", {
        description: "Order has been cancelled.",
      });
    }
  };

  const handleAssignRider = () => {
    if (!selectedRider) {
      toast.error("Error", {
        description: "Please select a rider first.",
      });
      return;
    }

    setAssigningRider(true);

    // Simulate API call
    setTimeout(() => {
      const selectedRiderObj = availableRiders.find(
        (r) => r.id.toString() === selectedRider,
      );
      if (selectedRiderObj) {
        orderData.assignedRider = selectedRiderObj;

        // Add a new status entry to the history
        const newStatusEntry = {
          status: "Rider Assigned",
          timestamp: new Date().toISOString(),
          note: `${selectedRiderObj.name} has been assigned to this order`,
        };

        orderData.statusHistory.push(newStatusEntry);
      }

      setAssigningRider(false);
      setShowAssignRiderDialog(false);

      toast("Rider Assigned", {
        description: "Rider has been successfully assigned to this order.",
      });
    }, 1000);
  };

  const handlePrintInvoice = () => {
    toast("Printing Invoice", {
      description: "Invoice is being sent to the printer.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <Badge className={`ml-2 ${getStatusColor(orderStatus)}`}>
            {orderStatus}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirm Order</SelectItem>
              <SelectItem value="processing">Start Preparation</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="completed">Complete Order</SelectItem>
              <SelectItem value="cancelled">Cancel Order</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrintInvoice}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order #{orderData.id}</CardTitle>
                  <CardDescription>
                    {new Date(orderData.orderDate).toLocaleString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    ${orderData.totalAmount.toFixed(2)}
                  </div>
                  <div
                    className={
                      orderData.paymentStatus === "Paid"
                        ? "text-green-600 text-sm"
                        : "text-red-600 text-sm"
                    }
                  >
                    {orderData.paymentStatus} • {orderData.paymentMethod}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex space-x-2">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="font-medium">Customer</div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.customerName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.customerPhone}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Package className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="font-medium">Order Type</div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.orderType}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="font-medium">Payment Method</div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.paymentMethod}
                      {orderData.cardLast4 && ` (**** ${orderData.cardLast4})`}
                    </div>
                  </div>
                </div>
              </div>

              {orderData.orderType === "Delivery" && (
                <div className="mb-6">
                  <div className="flex space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium">Delivery Address</div>
                      <div className="text-sm text-muted-foreground">
                        {orderData.deliveryAddress}
                      </div>
                      {orderData.deliveryNotes && (
                        <div className="text-sm italic mt-1 p-2 bg-muted/50 rounded-md">
                          Note: {orderData.deliveryNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div>
                <div className="font-medium mb-3">Order Items</div>
                <div className="space-y-3">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {item.quantity}x
                          </span>
                          <div>
                            <div>{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.variant}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>${item.total.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  {orderData.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Fee:
                      </span>
                      <span>${orderData.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="text-green-600">
                        -${orderData.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderData.tip > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tip:</span>
                      <span>${orderData.tip.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${orderData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.statusHistory.map((status, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-brand-500" />
                      {index < orderData.statusHistory.length - 1 && (
                        <div className="h-8 w-px bg-border mx-auto mt-1" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{status.status}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(status.timestamp).toLocaleString()}
                      </div>
                      {status.note && (
                        <div className="text-sm mt-1">{status.note}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {orderData.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{orderData.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.customerId}
                    </div>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground"
                      >
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Call
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {orderStatus === "Confirmed" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Order Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm mb-2">
                      Estimated preparation time (minutes)
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="5"
                        value={orderPreparationTime}
                        onChange={(e) =>
                          setOrderPreparationTime(e.target.value)
                        }
                        className="w-full"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => handleStatusChange("processing")}
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {orderData.orderType === "Delivery" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Rider Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.assignedRider ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                        {orderData.assignedRider.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {orderData.assignedRider.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Currently assigned
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {orderData.assignedRider.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowAssignRiderDialog(true)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      No rider has been assigned to this order yet.
                    </div>
                    <Select
                      value={selectedRider}
                      onValueChange={setSelectedRider}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRiders.map((rider) => (
                          <SelectItem
                            key={rider.id}
                            value={rider.id.toString()}
                          >
                            {rider.name} ({rider.status}, {rider.orders} orders)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="w-full"
                      onClick={handleAssignRider}
                      disabled={assigningRider || !selectedRider}
                    >
                      {assigningRider ? "Assigning..." : "Assign Rider"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {orderStatus === "Ready" && orderData.orderType === "Delivery" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm mb-2">
                      Estimated delivery time (minutes)
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="5"
                        value={estimatedDeliveryTime}
                        onChange={(e) =>
                          setEstimatedDeliveryTime(e.target.value)
                        }
                        className="w-full"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => handleStatusChange("out-for-delivery")}
                        disabled={!orderData.assignedRider}
                      >
                        Start Delivery
                      </Button>
                    </div>
                    {!orderData.assignedRider && (
                      <div className="text-sm text-red-500 mt-2">
                        Please assign a rider before starting delivery
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog
        open={showAssignRiderDialog}
        onOpenChange={setShowAssignRiderDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Rider</DialogTitle>
            <DialogDescription>
              Select a rider to assign to this order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedRider} onValueChange={setSelectedRider}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a rider" />
              </SelectTrigger>
              <SelectContent>
                {availableRiders.map((rider) => (
                  <SelectItem key={rider.id} value={rider.id.toString()}>
                    {rider.name} ({rider.status}, {rider.orders} orders)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAssignRiderDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRider}
                disabled={assigningRider || !selectedRider}
              >
                {assigningRider ? "Assigning..." : "Assign Rider"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderByIdClient;
