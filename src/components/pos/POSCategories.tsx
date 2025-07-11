
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Utensils, Coffee, Pizza, Sandwich, IceCream } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface POSCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const POSCategories = ({ selectedCategory, onSelectCategory }: POSCategoriesProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['pos-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('drink') || name.includes('beverage')) return Coffee;
    if (name.includes('pizza')) return Pizza;
    if (name.includes('sandwich') || name.includes('burger')) return Sandwich;
    if (name.includes('dessert') || name.includes('ice')) return IceCream;
    return Utensils;
  };

  if (isLoading) {
    return (
      <div className="p-4 border-b">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b bg-gray-50">
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(null)}
            className="whitespace-nowrap"
          >
            <Utensils className="w-4 h-4 mr-2" />
            All Items
          </Button>
          
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory(category.id)}
                className="whitespace-nowrap flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default POSCategories;
