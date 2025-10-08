import { useState, useEffect } from "react";

export interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Fake delay to simulate API call
        await new Promise((res) => setTimeout(res, 500));

        // Directly use mock data
        const mockData = getMockReviews();
        setReviews(mockData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
        setReviews(getMockReviews()); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Mock reviews as fallback
  const getMockReviews = (): Review[] => {
    return [
      {
        id: "1",
        user_id: "1",
        rating: 5,
        comment: "The food was delivered hot and fresh. Excellent service!",
        created_at: "2025-05-15T00:00:00Z",
        user: {
          first_name: "John",
          last_name: "D.",
          email: "john.d@example.com",
        },
      },
      {
        id: "2",
        user_id: "2",
        rating: 4,
        comment:
          "Great food but took a bit longer than expected. Would order again.",
        created_at: "2025-05-12T00:00:00Z",
        user: {
          first_name: "Sarah",
          last_name: "M.",
          email: "sarah.m@example.com",
        },
      },
      {
        id: "3",
        user_id: "3",
        rating: 5,
        comment: "Best burger I've ever had! Will definitely order again.",
        created_at: "2025-05-10T00:00:00Z",
        user: {
          first_name: "Mike",
          last_name: "R.",
          email: "mike.r@example.com",
        },
      },
    ];
  };

  return { reviews, loading, error };
};
