
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateOrderFormData } from './types';

interface CreateOrderFormProps {
  onSuccess: () => void;
}

const CreateOrderForm = ({ onSuccess }: CreateOrderFormProps) => {
  const [formData, setFormData] = useState<CreateOrderFormData>({
    supplier_id: '',
    expected_delivery: '',
    items: [{ inventory_item_id: '', quantity: 0, unit_price: 0 }]
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['inventory-items-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, unit, cost_per_unit');
      
      if (error) throw error;
      return data;
    }
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { inventory_item_id: '', quantity: 0, unit_price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderNumber = `PO-${Date.now()}`;
      const totalAmount = formData.items.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0
      );

      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .insert([{
          order_number: orderNumber,
          supplier_id: formData.supplier_id,
          total_amount: totalAmount,
          order_date: new Date().toISOString(),
          expected_delivery: formData.expected_delivery,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = formData.items.map(item => ({
        purchase_order_id: orderData.id,
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
      
      toast.success('Purchase order created successfully');
      onSuccess();
    } catch (error) {
      console.error('Create order error:', error);
      toast.error('Failed to create purchase order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplier_id">Supplier *</Label>
          <Select value={formData.supplier_id} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expected_delivery">Expected Delivery *</Label>
          <Input
            id="expected_delivery"
            type="date"
            value={formData.expected_delivery}
            onChange={(e) => setFormData(prev => ({ ...prev, expected_delivery: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Order Items</Label>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-end">
              <div>
                <Label>Item</Label>
                <Select 
                  value={item.inventory_item_id} 
                  onValueChange={(value) => {
                    updateItem(index, 'inventory_item_id', value);
                    const selectedItem = inventoryItems.find(i => i.id === value);
                    if (selectedItem) {
                      updateItem(index, 'unit_price', selectedItem.cost_per_unit);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((inventoryItem) => (
                      <SelectItem key={inventoryItem.id} value={inventoryItem.id}>
                        {inventoryItem.name} ({inventoryItem.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Total: ${(item.quantity * item.unit_price).toFixed(2)}
                </span>
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold">
          Total Order Value: ${formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
        </p>
      </div>

      <Button type="submit" className="w-full">
        Create Purchase Order
      </Button>
    </form>
  );
};

export default CreateOrderForm;
