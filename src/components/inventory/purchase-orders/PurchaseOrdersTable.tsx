
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PurchaseOrder } from './types';
import { getStatusIcon, getStatusVariant } from './utils';

interface PurchaseOrdersTableProps {
  orders: PurchaseOrder[];
  onViewOrder: (order: PurchaseOrder) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const PurchaseOrdersTable = ({ orders, onViewOrder, onUpdateStatus }: PurchaseOrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No purchase orders found. Create your first purchase order to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Expected Delivery</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            <TableCell>{order.supplier?.name}</TableCell>
            <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(order.expected_delivery).toLocaleDateString()}</TableCell>
            <TableCell>${order.total_amount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status) as any} className="flex items-center gap-1 w-fit">
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewOrder(order)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {order.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(order.id, 'approved')}
                  >
                    Approve
                  </Button>
                )}
                {order.status === 'approved' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(order.id, 'received')}
                  >
                    Mark Received
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PurchaseOrdersTable;
