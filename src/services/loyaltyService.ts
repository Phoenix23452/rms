
import { supabase } from "@/integrations/supabase/client";

export interface LoyaltyPoints {
  id: string;
  user_id: string;
  points: number;
  lifetime_points: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earn' | 'redeem' | 'expire' | 'bonus';
  description: string | null;
  order_id: string | null;
  created_at: string;
}

/**
 * Get loyalty points for the current logged-in user
 */
export const getUserLoyaltyPoints = async (): Promise<LoyaltyPoints | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;
  
  const { data, error } = await supabase
    .from('loyalty_points')
    .select('*')
    .eq('user_id', user.user.id)
    .single();

  if (error) {
    console.error('Error fetching loyalty points:', error);
    return null;
  }

  return data;
};

/**
 * Get loyalty transactions for the current logged-in user
 */
export const getUserLoyaltyTransactions = async (limit = 10): Promise<LoyaltyTransaction[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];
  
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching loyalty transactions:', error);
    return [];
  }

  // Type assertion to ensure the data matches our interface
  return (data || []) as LoyaltyTransaction[];
};

/**
 * Add loyalty points for a purchase
 * This would typically be called server-side
 */
export const addLoyaltyPointsForPurchase = async (
  userId: string, 
  orderId: string, 
  amount: number, 
  pointsToAward: number
): Promise<boolean> => {
  try {
    // First get the current points
    const { data: currentPointsData } = await supabase
      .from('loyalty_points')
      .select('points, lifetime_points')
      .eq('user_id', userId)
      .single();
    
    if (!currentPointsData) {
      console.error('User loyalty points not found');
      return false;
    }

    // 1. Insert the transaction
    const { error: transactionError } = await supabase
      .from('loyalty_transactions')
      .insert([{
        user_id: userId,
        points: pointsToAward,
        type: 'earn',
        description: `Points earned for order #${orderId.slice(0, 8)} ($${amount.toFixed(2)})`,
        order_id: orderId
      }]);

    if (transactionError) throw transactionError;

    // 2. Update user's points balance with calculated values
    const newPoints = currentPointsData.points + pointsToAward;
    const newLifetimePoints = currentPointsData.lifetime_points + pointsToAward;
    
    const { error: pointsError } = await supabase
      .from('loyalty_points')
      .update({
        points: newPoints,
        lifetime_points: newLifetimePoints,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (pointsError) throw pointsError;

    return true;
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    return false;
  }
};

/**
 * Redeem loyalty points
 */
export const redeemLoyaltyPoints = async (
  points: number, 
  description: string = 'Points redeemed for reward'
): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    const userId = user.user.id;
    
    // Get current points
    const { data: loyaltyData } = await supabase
      .from('loyalty_points')
      .select('points')
      .eq('user_id', userId)
      .single();
    
    if (!loyaltyData || loyaltyData.points < points) {
      throw new Error('Not enough points');
    }
    
    // 1. Insert the transaction
    const { error: transactionError } = await supabase
      .from('loyalty_transactions')
      .insert([{
        user_id: userId,
        points: -points,
        type: 'redeem',
        description
      }]);

    if (transactionError) throw transactionError;

    // 2. Update user's points balance
    const { error: pointsError } = await supabase
      .from('loyalty_points')
      .update({
        points: loyaltyData.points - points,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (pointsError) throw pointsError;

    return true;
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    return false;
  }
};
