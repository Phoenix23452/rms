
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Categories data
const categories = [
  { id: 1, name: "Burgers", description: "Delicious handcrafted burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Pizza", description: "Fresh oven-baked pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Pasta", description: "Authentic Italian pasta", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Salads", description: "Fresh and healthy salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Desserts", description: "Sweet treats and desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "Drinks", description: "Refreshing beverages", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
];

const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  
  return (
    <section className="bg-slate-50 dark:bg-slate-900/30 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Categories</h2>
          <Button 
            variant="link" 
            onClick={() => navigate('/menu')}
            className="text-orange-500 hover:text-orange-600 flex items-center"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-6 gap-6'}`}>
          {categories.map(category => (
            <Card 
              key={category.id}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/menu?category=${category.name.toLowerCase()}`)}
            >
              <div className="aspect-square relative">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                  <h3 className="font-bold text-white text-xl mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
