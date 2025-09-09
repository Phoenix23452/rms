
import { supabase } from "@/integrations/supabase/client";

export interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sent';
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  type: string;
  status: string;
  error: string | null;
  created_at: string;
}

export const fetchEmailCampaigns = async (): Promise<EmailCampaign[]> => {
  const { data, error } = await supabase
    .from('email_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching email campaigns:', error);
    throw error;
  }

  // Ensure data conforms to EmailCampaign type
  return (data || []).map(campaign => ({
    ...campaign,
    status: campaign.status as 'draft' | 'scheduled' | 'sent'
  }));
};

export const createEmailCampaign = async (campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<EmailCampaign> => {
  const { data, error } = await supabase
    .from('email_campaigns')
    .insert([campaign])
    .select()
    .single();

  if (error) {
    console.error('Error creating email campaign:', error);
    throw error;
  }

  return {
    ...data,
    status: data.status as 'draft' | 'scheduled' | 'sent'
  };
};
