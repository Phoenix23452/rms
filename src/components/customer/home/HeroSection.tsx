
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section 
      className="relative h-[600px] bg-cover bg-center"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"})` 
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Tasty Bites
          </h1>
          <p className="text-xl mb-8">
            Experience authentic flavors crafted with passion. Our restaurant brings you 
            carefully selected ingredients transformed into memorable culinary experiences.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/menu')} 
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Browse Menu
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/reservation')} 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Reserve a Table
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
