
export interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_id: string;
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  total_amount: number;
  order_date: string;
  expected_delivery: string;
  supplier?: {
    name: string;
    contact_person: string;
  };
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  inventory_item?: {
    name: string;
    unit: string;
  };
}

export interface CreateOrderFormData {
  supplier_id: string;
  expected_delivery: string;
  items: Array<{
    inventory_item_id: string;
    quantity: number;
    unit_price: number;
  }>;
}
