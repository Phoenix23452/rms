
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Deal {
  id: string;
  name: string;
  description: string;
  deal_price: number;
  regular_price: number;
  image_url: string;
  is_active: boolean;
  ends_at: string | null;
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setDeals(data || []);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals');
        // Fall back to mock deals if there's an error
        setDeals(getMockDeals());
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Mock deals as fallback
  const getMockDeals = (): Deal[] => {
    return [
      {
        id: '1',
        name: "Family Bundle",
        description: "2 Large pizzas, 4 sides, and 2 drinks",
        deal_price: 29.99,
        regular_price: 39.99,
        image_url: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGl6emF8ZW58MHx8MHx8fDA%3D",
        is_active: true,
        ends_at: null
      },
      {
        id: '2',
        name: "Lunch Special",
        description: "Get any burger with fries and drink",
        deal_price: 12.99,
        regular_price: 16.99,
        image_url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww",
        is_active: true,
        ends_at: null
      }
    ];
  };

  return { deals, loading, error };
};
