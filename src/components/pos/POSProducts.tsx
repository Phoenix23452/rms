
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, Star, Utensils } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePOSStore } from "@/hooks/pos/use-pos-store";

interface POSProductsProps {
  categoryId: string | null;
}

const POSProducts = ({ categoryId }: POSProductsProps) => {
  const { addToCart, getItemQuantity } = usePOSStore();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['pos-products', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          inventory:pos_inventory(current_stock)
        `)
        .eq('is_available', true);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      unit_price: product.sale_price || product.price,
      quantity: 1,
      modifiers: null
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => {
          const quantity = getItemQuantity(product.id);
          const stock = product.inventory?.[0]?.current_stock || 0;
          const isOutOfStock = stock <= 0;
          const price = product.sale_price || product.price;
          
          return (
            <Card 
              key={product.id} 
              className={`group cursor-pointer transition-all hover:shadow-md ${
                isOutOfStock ? 'opacity-50' : ''
              } ${quantity > 0 ? 'ring-2 ring-primary' : ''}`}
              onClick={() => !isOutOfStock && handleAddToCart(product)}
            >
              <div className="p-3">
                {/* Product Image */}
                <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Utensils className="w-8 h-8" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_popular && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {product.is_special_deal && (
                      <Badge variant="destructive" className="text-xs">
                        Deal
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stock indicator */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                  
                  {/* Quantity badge */}
                  {quantity > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="min-w-[24px] h-6 rounded-full">
                        {quantity}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">
                        ${price.toFixed(2)}
                      </span>
                      {product.sale_price && product.sale_price < product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Stock: {stock}
                    </div>
                  </div>
                  
                  {/* Quick add button for touch devices */}
                  <Button 
                    size="sm" 
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default POSProducts;
