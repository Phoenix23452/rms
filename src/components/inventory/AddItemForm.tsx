
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddItemFormProps {
  onSuccess: () => void;
}

const AddItemForm = ({ onSuccess }: AddItemFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    current_stock: 0,
    min_stock: 0,
    unit: '',
    cost_per_unit: 0,
    location: '',
    expiry_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert([formData]);

      if (error) throw error;
      
      toast.success('Item added successfully');
      onSuccess();
    } catch (error) {
      console.error('Add item error:', error);
      toast.error('Failed to add item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="current_stock">Current Stock *</Label>
          <Input
            id="current_stock"
            type="number"
            value={formData.current_stock}
            onChange={(e) => setFormData(prev => ({ ...prev, current_stock: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="min_stock">Min Stock *</Label>
          <Input
            id="min_stock"
            type="number"
            value={formData.min_stock}
            onChange={(e) => setFormData(prev => ({ ...prev, min_stock: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit">Unit *</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
              <SelectItem value="lb">Pounds (lb)</SelectItem>
              <SelectItem value="pcs">Pieces (pcs)</SelectItem>
              <SelectItem value="liters">Liters (L)</SelectItem>
              <SelectItem value="bottles">Bottles</SelectItem>
              <SelectItem value="cans">Cans</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
              <SelectItem value="boxes">Boxes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cost_per_unit">Cost per Unit *</Label>
          <Input
            id="cost_per_unit"
            type="number"
            step="0.01"
            value={formData.cost_per_unit}
            onChange={(e) => setFormData(prev => ({ ...prev, cost_per_unit: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Storage Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="e.g., Main Storage, Freezer, Dry Storage"
          required
        />
      </div>

      <div>
        <Label htmlFor="expiry_date">Expiry Date</Label>
        <Input
          id="expiry_date"
          type="date"
          value={formData.expiry_date}
          onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Item
      </Button>
    </form>
  );
};

export default AddItemForm;
