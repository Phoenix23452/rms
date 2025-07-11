
import React from "react";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "@/components/customer/menu/ViewToggle";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface MenuControlsProps {
  cartCount: number;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const MenuControls = ({ cartCount, isGridView, setIsGridView }: MenuControlsProps) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline"
      onClick={() => navigate('/cart')}
      className="relative w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/80 border-none"
    >
      <ShoppingCart className="h-5 w-5" />
      View Cart
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Button>
  );
};

export default MenuControls;
