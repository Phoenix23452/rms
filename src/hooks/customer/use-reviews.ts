import { useState, useEffect } from "react";
// import { supabase } from "@/integrations/supabase/client";

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
        // Fetch reviews joined with profiles
        // const { data, error } = await supabase
        //   .from('reviews')
        //   .select(`
        //     id,
        //     user_id,
        //     rating,
        //     comment,
        //     created_at,
        //     profiles:user_id (first_name, last_name, email)
        //   `)
        //   .order('created_at', { ascending: false })
        //   .limit(5);

        if (error) throw error;
        setReviews(getMockReviews());

        // Properly format the reviews with user information
        const formattedReviews: Review[] = reviews.map((review) => {
          // Safely extract user data from profiles
          let userData = null;
          // Check if profiles exists before accessing its properties
          if (review.profiles && typeof review.profiles === "object") {
            // Now TypeScript knows review.profiles is not null
            const profiles = review.profiles as any;
            userData = {
              first_name: profiles?.first_name ?? undefined,
              last_name: profiles?.last_name ?? undefined,
              email: profiles?.email ?? undefined,
            };
          }

          return {
            id: review.id,
            user_id: review.user_id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user: userData,
          };
        });

        setReviews(formattedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
        // Fall back to mock reviews if there's an error
        setReviews(getMockReviews());
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
