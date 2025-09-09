import React from "react";
// import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useDeals } from "@/hooks/customer/use-deals";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const DealsSection = () => {
  const { deals, loading, error } = useDeals();

  if (loading) {
    return (
      <Card className="p-4 mb-4 flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error || deals.length === 0) {
    return (
      <Card className="p-4 mb-4">
        <h2 className="font-bold text-lg mb-4">Special Deals</h2>
        <p className="text-gray-500 text-center">
          No active deals available at the moment.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-4">
      <h2 className="font-bold text-lg mb-4">Special Deals</h2>
      <div className="space-y-4">
        {deals.map((deal) => {
          const discountPercentage = Math.round(
            (1 - deal.deal_price / deal.regular_price) * 100,
          );

          return (
            <div
              key={deal.id}
              className="flex gap-4 border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
            >
              <img
                src={
                  deal.image_url ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
                }
                alt={deal.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">{deal.name}</h3>
                <p className="text-sm text-gray-500">{deal.description}</p>
                <div className="flex items-center mt-2">
                  <span className="font-bold text-primary mr-2">
                    Rs {deal.deal_price}
                  </span>
                  <span className="text-xs line-through text-gray-400">
                    Rs {deal.regular_price}
                  </span>
                  <span className="ml-auto bg-red-100 text-primary text-xs px-2 py-1 rounded">
                    Save {discountPercentage}%
                  </span>
                </div>
                <Link
                  className="mt-2 bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/80"
                  href={"/cart"}
                >
                  Add to Order
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
