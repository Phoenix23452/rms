
import React from "react";
import { Card } from "@/components/ui/card";
import { useReviews } from "@/hooks/customer/use-reviews";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export const ReviewsSection = () => {
  const { reviews, loading, error } = useReviews();
  
  if (loading) {
    return (
      <Card className="p-4 flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }
  
  if (error || reviews.length === 0) {
    return (
      <Card className="p-4">
        <h2 className="font-bold text-lg mb-4">Customer Reviews</h2>
        <p className="text-gray-500 text-center">No reviews available yet.</p>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <h2 className="font-bold text-lg mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map(review => {
          // Format the user name for display
          const userName = review.user?.first_name 
            ? `${review.user.first_name} ${review.user.last_name?.charAt(0) || ''}.` 
            : "Anonymous User";
          
          // Format the date
          const reviewDate = review.created_at 
            ? format(new Date(review.created_at), 'MMM dd, yyyy')
            : '';
          
          return (
            <div key={review.id} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-gray-500">{reviewDate}</span>
              </div>
              <div className="flex my-1">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
