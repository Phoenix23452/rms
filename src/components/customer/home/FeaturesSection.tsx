import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const features = [
  {
    title: "Fast Delivery",
    description: "Get your food delivered quickly to your doorstep",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Fresh Food",
    description: "We prepare all our dishes with the freshest ingredients",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    title: "Online Ordering",
    description: "Order online with our easy to use platform",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
];
interface FeatureSectionProps {
  isMobile: Boolean;
}

const FeaturesSection: React.FC<FeatureSectionProps> = ({ isMobile }) => {
  if (isMobile) return null;

  return (
    <section className="bg-slate-50 dark:bg-slate-900/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow`}
            >
              <h3 className="font-bold text-2xl mb-4">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
