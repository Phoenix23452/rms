
import { supabase } from "@/integrations/supabase/client";
import { RestaurantLocation, NewRestaurantLocation } from "@/types/settings";

export const fetchRestaurantLocations = async (): Promise<RestaurantLocation[]> => {
  const { data, error } = await supabase
    .from('restaurant_locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching restaurant locations:', error);
    throw error;
  }

  return data || [];
};

export const updateRestaurantLocation = async (location: Partial<RestaurantLocation>): Promise<RestaurantLocation | null> => {
  const { data, error } = await supabase
    .from('restaurant_locations')
    .update({
      ...location,
      updated_at: new Date().toISOString()
    })
    .eq('id', location.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating restaurant location:', error);
    throw error;
  }

  return data;
};

export const createRestaurantLocation = async (location: NewRestaurantLocation): Promise<RestaurantLocation> => {
  const { data, error } = await supabase
    .from('restaurant_locations')
    .insert([{
      ...location,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating restaurant location:', error);
    throw error;
  }

  return data;
};
