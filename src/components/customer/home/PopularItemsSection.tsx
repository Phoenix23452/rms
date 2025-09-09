import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingCart, Plus, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

// Popular items data
const popularItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, cheese, and special sauce",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, and basil",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with chocolate ganache",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const PopularItemsSection: React.FC = () => {
  const navigate = useRouter();
  const { isMobile } = useIsMobile();

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Popular Items</h2>
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
        {popularItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden py-0  border-none shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-72 object-cover"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full">
                Popular
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <span className="text-xl text-orange-500 font-bold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center text-yellow-400 mb-3">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                  (120+)
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  onClick={() => {
                    /* Add to cart logic */
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-10 w-10 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  onClick={() => {
                    /* Add quantity logic */
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PopularItemsSection;
