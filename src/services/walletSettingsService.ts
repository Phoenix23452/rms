
import { supabase } from "@/integrations/supabase/client";
import { WalletSettings } from "@/types/settings";

export const fetchWalletSettings = async (): Promise<WalletSettings | null> => {
  const { data, error } = await supabase
    .from('wallet_settings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching wallet settings:', error);
    return null;
  }

  return data;
};

export const updateWalletSettings = async (settings: Partial<WalletSettings>): Promise<WalletSettings | null> => {
  const { data, error } = await supabase
    .from('wallet_settings')
    .update(settings)
    .eq('id', settings.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating wallet settings:', error);
    throw error;
  }

  return data;
};
