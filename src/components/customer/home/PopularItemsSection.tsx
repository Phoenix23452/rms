import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingCart, Plus, Star } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PopularItemsSectionProps {
  isMobile: Boolean;
  popularItems: Product[];
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  isMobile,
  popularItems: popularItems,
}) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Popular Items</h2>
        <Link href={"/menu"}>
          <Button
            variant="link"
            className="text-orange-500 hover:text-orange-600 flex items-center"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="">
          {popularItems?.map((item) => (
            <CarouselItem
              className="lg:basis-1/3 md:basis-1/2 basis-full "
              key={item.id}
            >
              <Card className="overflow-hidden py-0  border-none shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={item.image || ""}
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
                      ${item.regularPrice.toFixed(2)}
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
                  <div className="flex w-full justify-between items-center">
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                      onClick={() => {}}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-10 w-10 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                      onClick={() => {}}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default PopularItemsSection;
