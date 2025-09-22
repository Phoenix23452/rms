import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  // const { isMobile }: { isMobile: Boolean } = useIsMobile();

  return (
    <section className="bg-slate-50 dark:bg-slate-900/30 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Categories</h2>
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
          className="w-full "
        >
          <CarouselContent>
            {categories?.map((category) => (
              <CarouselItem
                className="lg:basis-1/6 md:basis-1/4 basis-1/3"
                key={category.id}
              >
                <Link href={`/menu?category=${category.name.toLowerCase()}`}>
                  <Card className="overflow-hidden py-0 border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="aspect-square h-fit relative">
                      <img
                        src={
                          category?.image ||
                          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                        <h3 className="font-bold text-white text-xl mb-1">
                          {category.name}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoriesSection;
