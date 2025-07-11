
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseOrdersData } from "./purchase-orders/hooks/usePurchaseOrdersData";
import PurchaseOrdersTable from "./purchase-orders/PurchaseOrdersTable";
import OrderDetailsDialog from "./purchase-orders/OrderDetailsDialog";
import CreateOrderForm from "./purchase-orders/CreateOrderForm";
import { PurchaseOrder } from "./purchase-orders/types";

const PurchaseOrders = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const queryClient = useQueryClient();

  const { orders, isLoading, updateStatusMutation } = usePurchaseOrdersData();

  const handleUpdateStatus = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>
              Manage purchase orders and supplier deliveries
            </CardDescription>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Purchase Order</DialogTitle>
              </DialogHeader>
              <CreateOrderForm 
                onSuccess={() => {
                  setShowAddDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <PurchaseOrdersTable
          orders={orders}
          onViewOrder={setSelectedOrder}
          onUpdateStatus={handleUpdateStatus}
        />
      </CardContent>

      <OrderDetailsDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Card>
  );
};

export default PurchaseOrders;
