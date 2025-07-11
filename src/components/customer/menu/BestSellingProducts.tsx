
import React from "react";
import { Card } from "@/components/ui/card";
import { MenuData } from "@/components/customer/menu/MenuData";

interface BestSellingProductsProps {
  handleOrderNow: (item: any) => void;
}

export const BestSellingProducts = ({ handleOrderNow }: BestSellingProductsProps) => {
  return (
    <Card className="p-4 mb-4">
      <h2 className="font-bold text-lg mb-4">Best Selling Products</h2>
      <div className="space-y-4">
        {MenuData.menuItems
          .filter(item => item.isSpecial)
          .slice(0, 2)
          .map(item => (
            <div key={item.id} className="mb-4">
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 rounded-md" />
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="font-medium">{item.name}</p>
              <div className="flex justify-between items-center my-2">
                <div>
                  <p className="font-bold text-primary">Rs {item.price}</p>
                  <p className="text-xs line-through">Rs {(item.price * 1.1).toFixed(0)}</p>
                </div>
                <span className="bg-red-100 text-primary text-xs px-2 py-1 rounded">-10%</span>
              </div>
              <button 
                className="w-full bg-primary text-white py-2 rounded text-sm hover:bg-primary/80"
                onClick={() => handleOrderNow(item)}
              >
                Order now
              </button>
            </div>
          ))}
        
        {/* Pagination dots */}
        <div className="flex justify-center gap-2">
          <span className="h-2 w-2 bg-primary rounded-full"></span>
          <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>
    </Card>
  );
};
