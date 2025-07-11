
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, 
  User, 
  Calculator, 
  Printer, 
  CreditCard,
  Clock,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import POSCategories from "./POSCategories";
import POSProducts from "./POSProducts";
import POSCart from "./POSCart";
import POSPayment from "./POSPayment";
import POSHeader from "./POSHeader";
import { usePOSStore } from "@/hooks/pos/use-pos-store";
import { usePOSAuth } from "./hooks/use-pos-auth";
import { toast } from "sonner";

type OrderType = 'dine_in' | 'takeaway' | 'delivery';

const POSLayout = () => {
  const { 
    currentOrder, 
    selectedCategory, 
    setSelectedCategory,
    activeTable,
    orderType,
    setOrderType 
  } = usePOSStore();
  
  const { currentStaff, logout, canVoidOrders, canApplyDiscounts } = usePOSAuth();
  const [showPayment, setShowPayment] = useState(false);

  const orderTypes: Array<{ id: OrderType; label: string; icon: any }> = [
    { id: 'dine_in', label: 'Dine In', icon: Users },
    { id: 'takeaway', label: 'Take Away', icon: ShoppingCart },
    { id: 'delivery', label: 'Delivery', icon: Clock }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <POSHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Categories & Products */}
        <div className="flex-1 flex flex-col bg-white border-r">
          {/* Order Type Selector */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {orderTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={orderType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrderType(type.id)}
                    className="flex items-center gap-2"
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentStaff?.profiles?.first_name} ({currentStaff?.role})
                </Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
            
            {activeTable && (
              <Badge variant="secondary" className="mt-2">
                Table {activeTable.table_number}
              </Badge>
            )}
          </div>

          {/* Categories */}
          <POSCategories 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Products Grid */}
          <div className="flex-1 overflow-hidden">
            <POSProducts categoryId={selectedCategory} />
          </div>
        </div>

        {/* Right Panel - Cart & Actions */}
        <div className="w-96 bg-white flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Current Order</h2>
              <Badge variant="outline">
                {currentOrder?.items?.length || 0} items
              </Badge>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-hidden">
            <POSCart />
          </div>

          {/* Order Summary & Actions */}
          <div className="border-t bg-gray-50 p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${currentOrder?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${currentOrder?.tax_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-${currentOrder?.discount_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-lg">${currentOrder?.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!canApplyDiscounts()}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Discount
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
              
              <Button 
                className="w-full mt-2" 
                size="lg"
                disabled={!currentOrder?.items?.length}
                onClick={() => setShowPayment(true)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Process Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <POSPayment 
          order={currentOrder}
          onClose={() => setShowPayment(false)}
          onComplete={() => {
            setShowPayment(false);
            // Reset order after successful payment
          }}
        />
      )}
    </div>
  );
};

export default POSLayout;
