
import { StockStatus } from './types';

export const getStockStatus = (current: number, min: number): StockStatus => {
  if (current <= 0) return { label: 'Out of Stock', variant: 'destructive' };
  if (current <= min) return { label: 'Low Stock', variant: 'destructive' };
  if (current <= min * 2) return { label: 'Medium Stock', variant: 'secondary' };
  return { label: 'In Stock', variant: 'default' };
};
