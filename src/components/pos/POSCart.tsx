
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, Edit, ShoppingCart } from "lucide-react";
import { usePOSStore } from "@/hooks/pos/use-pos-store";

const POSCart = () => {
  const { 
    currentOrder, 
    updateItemQuantity, 
    removeFromCart, 
    clearCart 
  } = usePOSStore();

  if (!currentOrder?.items?.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <p className="text-sm">No items in cart</p>
          <p className="text-xs text-gray-300 mt-1">Add items to start an order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {currentOrder.items.map((item, index) => (
            <div key={`${item.product_id}-${index}`} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product_name}</h4>
                  <p className="text-xs text-gray-600">${item.unit_price.toFixed(2)} each</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              {/* Modifiers */}
              {item.modifiers && (
                <div className="mb-2">
                  <div className="text-xs text-gray-600 space-y-1">
                    {Object.entries(item.modifiers as any).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>+ {key}</span>
                        <span>${(value as number).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateItemQuantity(index, item.quantity - 1)}
                    className="h-8 w-8 p-0"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  <Badge variant="outline" className="min-w-[40px] justify-center">
                    {item.quantity}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateItemQuantity(index, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">${item.total_price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Cart Actions */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearCart}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default POSCart;
