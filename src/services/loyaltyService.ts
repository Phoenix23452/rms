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
  type: "earn" | "redeem" | "expire" | "bonus";
  description: string | null;
  order_id: string | null;
  created_at: string;
}

// Mock database
let mockLoyaltyPoints: LoyaltyPoints = {
  id: "lp1",
  user_id: "user1",
  points: 120,
  lifetime_points: 300,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let mockLoyaltyTransactions: LoyaltyTransaction[] = [
  {
    id: "lt1",
    user_id: "user1",
    points: 50,
    type: "earn",
    description: "Points earned for order #1234",
    order_id: "order1234",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "lt2",
    user_id: "user1",
    points: -30,
    type: "redeem",
    description: "Points redeemed for reward",
    order_id: null,
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
];

// Simulate getting current logged-in user ID (dummy)
const getCurrentUserId = () => "user1";

/**
 * Get loyalty points for the current logged-in user
 */
export const getUserLoyaltyPoints = async (): Promise<LoyaltyPoints | null> => {
  await new Promise((r) => setTimeout(r, 300)); // simulate network delay
  const userId = getCurrentUserId();
  if (mockLoyaltyPoints.user_id === userId) {
    return mockLoyaltyPoints;
  }
  return null;
};

/**
 * Get loyalty transactions for the current logged-in user
 */
export const getUserLoyaltyTransactions = async (
  limit = 10,
): Promise<LoyaltyTransaction[]> => {
  await new Promise((r) => setTimeout(r, 300)); // simulate network delay
  const userId = getCurrentUserId();
  return mockLoyaltyTransactions
    .filter((tx) => tx.user_id === userId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, limit);
};

/**
 * Add loyalty points for a purchase
 */
export const addLoyaltyPointsForPurchase = async (
  userId: string,
  orderId: string,
  amount: number,
  pointsToAward: number,
): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 300)); // simulate network delay
  try {
    if (mockLoyaltyPoints.user_id !== userId) return false;

    // Insert transaction
    const newTransaction: LoyaltyTransaction = {
      id: `lt${Date.now()}`,
      user_id: userId,
      points: pointsToAward,
      type: "earn",
      description: `Points earned for order #${orderId.slice(0, 8)} ($${amount.toFixed(2)})`,
      order_id: orderId,
      created_at: new Date().toISOString(),
    };
    mockLoyaltyTransactions.unshift(newTransaction);

    // Update points
    mockLoyaltyPoints.points += pointsToAward;
    mockLoyaltyPoints.lifetime_points += pointsToAward;
    mockLoyaltyPoints.updated_at = new Date().toISOString();

    return true;
  } catch {
    return false;
  }
};

/**
 * Redeem loyalty points
 */
export const redeemLoyaltyPoints = async (
  points: number,
  description: string = "Points redeemed for reward",
): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 300)); // simulate network delay
  const userId = getCurrentUserId();
  if (mockLoyaltyPoints.user_id !== userId) return false;

  if (mockLoyaltyPoints.points < points) {
    console.error("Not enough points to redeem");
    return false;
  }

  // Insert transaction
  const newTransaction: LoyaltyTransaction = {
    id: `lt${Date.now()}`,
    user_id: userId,
    points: -points,
    type: "redeem",
    description,
    order_id: null,
    created_at: new Date().toISOString(),
  };
  mockLoyaltyTransactions.unshift(newTransaction);

  // Update points
  mockLoyaltyPoints.points -= points;
  mockLoyaltyPoints.updated_at = new Date().toISOString();

  return true;
};
