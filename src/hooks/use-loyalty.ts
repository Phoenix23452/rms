
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLoyalty = () => {
  const queryClient = useQueryClient();

  const { data: loyaltyPoints, isLoading: isLoadingPoints } = useQuery({
    queryKey: ['loyalty-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!supabase.auth.getSession(),
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['loyalty-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supabase.auth.getSession(),
  });

  const redeemPoints = useMutation({
    mutationFn: async (points: number) => {
      // Get the current user's ID
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) {
        throw new Error("User must be logged in to redeem points");
      }
      
      const { error } = await supabase
        .from('loyalty_transactions')
        .insert({
          points: -points,
          type: 'redeem',
          description: 'Points redeemed for discount',
          user_id: userId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-points'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });
      toast.success('Points redeemed successfully');
    },
    onError: (error) => {
      toast.error('Failed to redeem points: ' + error.message);
    }
  });

  return {
    points: loyaltyPoints?.points || 0,
    lifetimePoints: loyaltyPoints?.lifetime_points || 0,
    transactions,
    isLoading: isLoadingPoints || isLoadingTransactions,
    redeemPoints
  };
};
