import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, ChefHat, User, Users, Star, Coffee } from "lucide-react";
import { Collapse } from "@/components/ui/collapse";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type Preference = "spicy" | "sweet" | "savory" | "healthy" | "comfort" | "vegetarian";
type Occasion = "casual" | "celebration" | "date" | "business";

type RecommendedItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  serving: "individual" | "sharing";
  preferences: Preference[];
  category: string;
};

const recommendedItems: RecommendedItem[] = [
  {
    id: 1,
    name: "House Special Platter",
    description: "A selection of our signature appetizers, perfect for sharing with 2-4 people",
    price: 24.99,
    image: "https://placehold.co/300x200/FFD700/333?text=Platter",
    rating: 4.9,
    serving: "sharing",
    preferences: ["savory", "comfort"],
    category: "Appetizers"
  },
  {
    id: 2,
    name: "Grilled Salmon with Roasted Vegetables",
    description: "Fresh salmon fillet with seasonal vegetables in a lemon butter sauce",
    price: 18.99,
    image: "https://placehold.co/300x200/90EE90/333?text=Salmon",
    rating: 4.8,
    serving: "individual",
    preferences: ["healthy", "savory"],
    category: "Mains"
  },
  {
    id: 3,
    name: "Vegetable Paella",
    description: "Traditional Spanish rice dish with seasonal vegetables and aromatic spices",
    price: 16.99,
    image: "https://placehold.co/300x200/FFD700/333?text=Paella",
    rating: 4.7,
    serving: "sharing",
    preferences: ["vegetarian", "savory"],
    category: "Mains"
  },
  {
    id: 4,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 7.99,
    image: "https://placehold.co/300x200/8B4513/FFF?text=Tiramisu",
    rating: 4.9,
    serving: "individual",
    preferences: ["sweet"],
    category: "Desserts"
  }
];

const FoodRecommender: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [peopleCount, setPeopleCount] = useState("2");
  const [occasion, setOccasion] = useState<Occasion>("casual");
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handlePreferenceChange = (preference: Preference, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, preference]);
    } else {
      setPreferences(preferences.filter(p => p !== preference));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAddToCart = (item: RecommendedItem) => {
    navigate("/menu");
    // In a real app, this would add the item to the cart
  };

  const filteredRecommendations = submitted 
    ? recommendedItems.filter(item => {
        if (parseInt(peopleCount) > 2 && item.serving === "individual") {
          return false;
        }
        
        if (preferences.length > 0) {
          return preferences.some(pref => item.preferences.includes(pref));
        }
        
        return true;
      })
    : [];

  return (
    <Card className="border-primary/20 shadow-sm overflow-hidden">
      <CardHeader 
        className="bg-gradient-to-r from-amber-50/60 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-800/20 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Personal Menu Recommendations</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Let us suggest the perfect meal based on your preferences
        </CardDescription>
      </CardHeader>

      <Collapse isOpen={isOpen}>
        <CardContent className="pt-4">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="peopleCount">How many people are dining?</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="people-1" value="1" checked={peopleCount === "1"} onClick={() => setPeopleCount("1")} />
                    <Label htmlFor="people-1" className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Just me
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="people-2" value="2" checked={peopleCount === "2"} onClick={() => setPeopleCount("2")} />
                    <Label htmlFor="people-2" className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Couple
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="people-group" value="4" checked={peopleCount === "4"} onClick={() => setPeopleCount("4")} />
                    <Label htmlFor="people-group" className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> Group
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>What's the occasion?</Label>
                <RadioGroup value={occasion} onValueChange={(value) => setOccasion(value as Occasion)} className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="casual" id="casual" className="peer sr-only" />
                    <Label 
                      htmlFor="casual"
                      className="px-3 py-1.5 border rounded-full cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                    >
                      Casual Meal
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="celebration" id="celebration" className="peer sr-only" />
                    <Label 
                      htmlFor="celebration"
                      className="px-3 py-1.5 border rounded-full cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                    >
                      Celebration
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="date" id="date" className="peer sr-only" />
                    <Label 
                      htmlFor="date"
                      className="px-3 py-1.5 border rounded-full cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                    >
                      Date Night
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="business" id="business" className="peer sr-only" />
                    <Label 
                      htmlFor="business"
                      className="px-3 py-1.5 border rounded-full cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                    >
                      Business
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Flavor preferences (optional)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pref-spicy" 
                      checked={preferences.includes("spicy")}
                      onCheckedChange={(checked) => handlePreferenceChange("spicy", !!checked)} 
                    />
                    <Label htmlFor="pref-spicy">Spicy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pref-sweet" 
                      checked={preferences.includes("sweet")}
                      onCheckedChange={(checked) => handlePreferenceChange("sweet", !!checked)} 
                    />
                    <Label htmlFor="pref-sweet">Sweet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pref-savory" 
                      checked={preferences.includes("savory")}
                      onCheckedChange={(checked) => handlePreferenceChange("savory", !!checked)} 
                    />
                    <Label htmlFor="pref-savory">Savory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pref-healthy" 
                      checked={preferences.includes("healthy")}
                      onCheckedChange={(checked) => handlePreferenceChange("healthy", !!checked)} 
                    />
                    <Label htmlFor="pref-healthy">Healthy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pref-comfort" 
                      checked={preferences.includes("comfort")}
                      onCheckedChange={(checked) => handlePreferenceChange("comfort", !!checked)} 
                    />
                    <Label htmlFor="pref-comfort">Comfort Food</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pref-vegetarian" 
                      checked={preferences.includes("vegetarian")}
                      onCheckedChange={(checked) => handlePreferenceChange("vegetarian", !!checked)} 
                    />
                    <Label htmlFor="pref-vegetarian">Vegetarian</Label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full">Get Recommendations</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Our Recommendations</h3>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Change Preferences
                </Button>
              </div>
              
              {filteredRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecommendations.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{item.name}</h4>
                          <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span className="ml-1">{item.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2">
                              {item.serving === "sharing" ? "Great for sharing" : "Individual"}
                            </Badge>
                          </div>
                          <Button size="sm" onClick={() => handleAddToCart(item)}>
                            View Item
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      onClick={() => navigate('/menu')}
                    >
                      View Full Menu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Coffee className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h4 className="font-medium">No perfect matches found</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    We couldn't find exact matches for your preferences
                  </p>
                  <Button onClick={() => setSubmitted(false)}>
                    Try Different Preferences
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FoodRecommender;
