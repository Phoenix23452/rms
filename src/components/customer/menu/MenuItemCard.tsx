import React from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Heart } from "lucide-react";

interface MenuItemProps {
  item: Product;
  handleOrderNow: (item: any) => void;
}

export const MenuItemCard = ({ item, handleOrderNow }: MenuItemProps) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div
      key={item.id}
      className="bg-white rounded-md shadow-sm overflow-hidden"
    >
      <div className="flex p-3 gap-4">
        <div className="relative">
          <img
            src={item.image || ""}
            alt={item.name}
            className="h-24 w-24 object-cover rounded-md"
          />
          <button
            className="absolute top-1 right-1 h-6 w-6 bg-white/90 rounded-full flex items-center justify-center"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : "text-gray-500"}`}
            />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-md">{item.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>
            {item.category && (
              <p className="text-xs text-gray-400 mt-1">{item.category.name}</p>
            )}
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="font-bold text-primary">
                Rs {item.regularPrice.toFixed(0)}
              </p>
            </div>

            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/80 text-white text-sm"
                    onClick={() => handleOrderNow(item)}
                  >
                    Order now
                  </Button>
                </AlertDialogTrigger>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
