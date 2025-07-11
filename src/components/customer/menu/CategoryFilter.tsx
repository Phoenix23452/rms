
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

export const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: CategoryFilterProps) => {
  return (
    <div className="relative">
      <h2 className="font-bold text-lg mb-4 border-b border-primary pb-1 w-fit">
        Categories
      </h2>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {categories.map((category) => (
            <CarouselItem key={category.id} className="pl-2 basis-auto">
              <div 
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-4 py-2 rounded-md whitespace-nowrap cursor-pointer transition-colors
                  ${activeCategory === category.id ? 
                    'bg-primary text-white' : 
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {category.name}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-primary text-white hover:bg-primary/80" />
        <CarouselNext className="right-0 bg-primary text-white hover:bg-primary/80" />
      </Carousel>
    </div>
  );
};
