import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

// Special deals data
const specialDeals = [
  {
    id: 1,
    name: "Family Feast",
    description:
      "2 large pizzas, 4 sides, and 2 liters of soda. Perfect for family dinner!",
    originalPrice: 49.99,
    discountedPrice: 39.99,
    discount: "20%",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    validUntil: "Limited time offer",
  },
  {
    id: 2,
    name: "Lunch Special",
    description:
      "Any burger with fries and a drink. Available Monday-Friday, 11am-3pm.",
    originalPrice: 15.99,
    discountedPrice: 11.99,
    discount: "25%",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    validUntil: "Weekdays only",
  },
  {
    id: 3,
    name: "Date Night Bundle",
    description:
      "2 entrees, 1 appetizer, and 2 desserts. Perfect for a romantic evening.",
    originalPrice: 55.99,
    discountedPrice: 45.99,
    discount: "18%",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    validUntil: "Every Friday & Saturday",
  },
];

const SpecialDealsSection: React.FC = () => {
  const navigate = useRouter();
  const { isMobile } = useIsMobile();

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Special Deals</h2>
        <Button
          variant="link"
          onClick={() => navigate.push("/menu")}
          className="text-orange-500 hover:text-orange-600 flex items-center"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div
        className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-3 gap-8"}`}
      >
        {specialDeals.map((deal) => (
          <Card
            key={deal.id}
            className="overflow-hidden py-0 border-none shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-60 object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                SAVE {deal.discount}
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">{deal.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {deal.description}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">{deal.validUntil}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-orange-500">
                    ${deal.discountedPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                </div>
                <Button onClick={() => navigate.push("/menu")}>
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SpecialDealsSection;
