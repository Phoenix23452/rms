
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  min_stock: number;
  unit: string;
  cost_per_unit: number;
  supplier_id?: string;
  location: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface StockStatus {
  label: string;
  variant: 'default' | 'secondary' | 'destructive';
}
