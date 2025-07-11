
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PurchaseOrder } from './types';
import { getStatusIcon, getStatusVariant } from './utils';

interface OrderDetailsDialogProps {
  order: PurchaseOrder | null;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, onClose }: OrderDetailsDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Purchase Order Details - {order.order_number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Supplier</Label>
              <p className="font-medium">{order.supplier?.name}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge variant={getStatusVariant(order.status) as any} className="flex items-center gap-1 w-fit">
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </div>
          </div>
          
          <div>
            <Label>Order Items</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.inventory_item?.name}</TableCell>
                    <TableCell>{item.quantity} {item.inventory_item?.unit}</TableCell>
                    <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell>${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold">
              Total: ${order.total_amount.toFixed(2)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
