import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { fetchSliderImages, SliderImage } from "@/services/sliderService";

export const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<SliderImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSliderImages = async () => {
      try {
        setIsLoading(true);
        const images = await fetchSliderImages("menu");
        setSlides(images);
      } catch (error) {
        console.error("Error loading slider images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSliderImages();
  }, []);

  // Fallback data if no slides are available from API
  useEffect(() => {
    if (!isLoading && slides.length === 0) {
      setSlides([
        {
          id: "1",
          title: "Explore Our Delicious Menu",
          description:
            "Discover a wide variety of mouthwatering dishes crafted with the freshest ingredients.",
          image_url:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          type: "menu",
          button_text: "Order Now",
          button_link: "#menu",
        },
        {
          id: "2",
          title: "Special Deals & Offers",
          description:
            "Take advantage of our special promotions and combos for great value.",
          image_url:
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1469&auto=format&fit=crop",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          type: "menu",
          button_text: "View Specials",
          button_link: "#deals",
        },
      ] as SliderImage[]);
    }
  }, [isLoading, slides]);

  return (
    <Carousel className="w-full mb-8">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />

              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 text-white">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base lg:text-lg mb-4 max-w-lg">
                  {slide.description}
                </p>
                {slide.button_text && (
                  <a
                    href={slide.button_link || "#"}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "px-4 py-2 rounded-md bg-primary text-primary-foreground",
                      "text-sm font-medium transition-all",
                      "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                      "w-fit",
                    )}
                  >
                    {slide.button_text}
                  </a>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
