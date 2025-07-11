
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Gift,
  Calculator,
  Receipt,
  Check
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface POSPaymentProps {
  order: any;
  onClose: () => void;
  onComplete: () => void;
}

type PaymentMethod = 'cash' | 'card' | 'wallet' | 'loyalty_points';

const POSPayment = ({ order, onClose, onComplete }: POSPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: Array<{ id: PaymentMethod; label: string; icon: any; color: string }> = [
    { id: 'cash', label: 'Cash', icon: DollarSign, color: 'bg-green-500' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'wallet', label: 'Wallet', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'loyalty_points', label: 'Points', icon: Gift, color: 'bg-orange-500' }
  ];

  const totalWithTip = (order?.total_amount || 0) + tipAmount;
  const change = selectedMethod === 'cash' ? Math.max(0, parseFloat(cashReceived || '0') - totalWithTip) : 0;

  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      // First create the POS order
      const { data: posOrder, error: orderError } = await supabase
        .from('pos_orders')
        .insert({
          order_number: `POS-${Date.now()}`,
          order_type: order.type || 'dine_in',
          subtotal: order.subtotal,
          tax_amount: order.tax_amount,
          discount_amount: order.discount_amount || 0,
          tip_amount: tipAmount,
          total_amount: totalWithTip,
          payment_status: 'completed',
          branch_id: order.branch_id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = order.items.map((item: any) => ({
        pos_order_id: posOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        modifiers: item.modifiers
      }));

      const { error: itemsError } = await supabase
        .from('pos_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Record payment
      const { error: paymentError } = await supabase
        .from('pos_payments')
        .insert({
          pos_order_id: posOrder.id,
          payment_method: selectedMethod,
          amount: totalWithTip,
          tip_amount: tipAmount,
          status: 'completed',
          processed_at: new Date().toISOString()
        });

      if (paymentError) throw paymentError;

      return posOrder;
    },
    onSuccess: () => {
      toast.success("Payment processed successfully!");
      onComplete();
    },
    onError: (error) => {
      console.error('Payment error:', error);
      toast.error("Failed to process payment");
    }
  });

  const handleProcessPayment = () => {
    if (selectedMethod === 'cash' && parseFloat(cashReceived) < totalWithTip) {
      toast.error("Insufficient cash received");
      return;
    }
    
    setIsProcessing(true);
    processPaymentMutation.mutate();
  };

  const quickTipAmounts = [0, 2, 5, 10, 15, 20];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left - Payment Methods & Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={selectedMethod === method.id ? "default" : "outline"}
                    className="h-16 flex-col gap-2"
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <method.icon className="w-6 h-6" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Cash Payment Details */}
            {selectedMethod === 'cash' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cashReceived">Cash Received</Label>
                  <Input
                    id="cashReceived"
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="text-lg"
                  />
                </div>
                
                {change > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">Change Due</div>
                    <div className="text-2xl font-bold text-green-800">
                      ${change.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tip Section */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Tip Amount</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {quickTipAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipAmount(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                step="0.01"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                placeholder="Custom tip amount"
              />
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Order Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order?.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order?.tax_amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${order?.discount_amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip:</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${totalWithTip.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <h4 className="font-medium mb-2">Items ({order?.items?.length || 0})</h4>
              <div className="space-y-2">
                {order?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product_name}</span>
                    <span>${item.total_price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleProcessPayment}
            disabled={isProcessing || (selectedMethod === 'cash' && parseFloat(cashReceived) < totalWithTip)}
            className="flex-1"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Payment
              </>
            )}
          </Button>
          <Button variant="outline">
            <Receipt className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POSPayment;
