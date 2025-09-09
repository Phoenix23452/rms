
import { supabase } from "@/integrations/supabase/client";
import { AppSettings } from "@/types/settings";

export const fetchSettings = async (): Promise<AppSettings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }

  return data;
};

export const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings | null> => {
  // If no settings exist, create new ones
  if (!settings.id) {
    const { data, error } = await supabase
      .from('settings')
      .insert([{
        ...settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating settings:', error);
      throw error;
    }

    return data;
  }

  // Update existing settings
  const { data, error } = await supabase
    .from('settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', settings.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }

  return data;
};
