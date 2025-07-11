
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InventoryItem } from "../types";

export const useInventoryData = () => {
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  const saveItemMutation = useMutation({
    mutationFn: async (item: Partial<InventoryItem> & { name: string; category: string; unit: string; location: string }) => {
      if (item.id) {
        const { error } = await supabase
          .from('inventory_items')
          .update(item)
          .eq('id', item.id);
        if (error) throw error;
      } else {
        const { id, created_at, updated_at, ...insertData } = item;
        const { error } = await supabase
          .from('inventory_items')
          .insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Item saved successfully');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to save item');
    }
  });

  return {
    inventory,
    isLoading,
    saveItemMutation
  };
};
