
import { supabase } from "@/integrations/supabase/client";
import { DeliveryZone, NewDeliveryZone } from "@/types/settings";

export const fetchDeliveryZones = async (): Promise<DeliveryZone[]> => {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching delivery zones:', error);
    throw error;
  }

  return data || [];
};

export const updateDeliveryZone = async (zone: Partial<DeliveryZone>): Promise<DeliveryZone | null> => {
  const { data, error } = await supabase
    .from('delivery_zones')
    .update(zone)
    .eq('id', zone.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating delivery zone:', error);
    throw error;
  }

  return data;
};

export const createDeliveryZone = async (zone: NewDeliveryZone): Promise<DeliveryZone> => {
  const { data, error } = await supabase
    .from('delivery_zones')
    .insert([zone])
    .select()
    .single();

  if (error) {
    console.error('Error creating delivery zone:', error);
    throw error;
  }

  return data;
};
