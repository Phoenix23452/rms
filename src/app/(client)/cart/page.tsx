"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

// Promotion codes
const promotionCodes = [
  { code: "WELCOME10", discount: 0.1, description: "10% off your first order" },
  {
    code: "FREESHIP",
    discount: 3.5,
    description: "Free delivery",
    type: "shipping",
  },
];

// 🛠 helper: read + validate cart
const getCartFromStorage = () => {
  if (typeof window === "undefined") return [];
  const savedCart = localStorage.getItem("cart");
  if (!savedCart) return [];
  try {
    const parsedCart = JSON.parse(savedCart);
    return parsedCart.map((item: any) => ({
      ...item,
      quantity: item.quantity || 1,
      price: item.regularPrice || item.price || 0,
      totalPrice: item.totalPrice || (item.price || 0) * (item.quantity || 1),
      options: item.options || [],
    }));
  } catch (error) {
    console.error("Error parsing cart data:", error);
    return [];
  }
};
const CartPage = () => {
  const [cartItems, setCartItems] = useState<any>(getCartFromStorage());
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);

  // Calculate subtotal
  const subtotal =
    cartItems.length > 0
      ? cartItems.reduce(
          (total: any, item: any) =>
            total + (item.totalPrice || item.price * item.quantity),
          0,
        )
      : 0;

  // Delivery fee (could be dynamic based on location)
  const deliveryFee = 3.5;

  // Calculate tax
  const tax = subtotal * 0.08;

  // Calculate discount
  const discount = appliedPromo
    ? appliedPromo.type === "shipping"
      ? 0
      : subtotal * appliedPromo.discount
    : 0;

  // Calculate shipping discount
  const shippingDiscount =
    appliedPromo && appliedPromo.type === "shipping" ? deliveryFee : 0;

  // Calculate total
  const total = subtotal + deliveryFee + tax - discount - shippingDiscount;

  // Update item quantity
  const updateQuantity = (id: any, newQuantity: any) => {
    if (newQuantity < 1) return;

    setCartItems(
      cartItems?.map((item: any) => {
        if (item.id === id) {
          const unitPrice = item.price;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      }),
    );
  };

  // Remove item from cart
  const removeItem = (id: any) => {
    setCartItems(cartItems.filter((item: any) => item.id !== id));

    toast.info("Item removed", {
      description: "Item has been removed from your cart.",
    });
  };

  //   // Apply promotion code
  //   const applyPromoCode = () => {
  //     const foundPromo = promotionCodes.find(
  //       (promo) => promo.code.toLowerCase() === promoCode.toLowerCase(),
  //     );

  //     if (foundPromo) {
  //       setAppliedPromo(foundPromo);
  //       toast({
  //         title: "Promotion applied!",
  //         description: foundPromo.description,
  //       });
  //     } else {
  //       toast({
  //         title: "Invalid promotion code",
  //         description: "Please check your code and try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   };

  //   // Remove promotion code
  //   const removePromoCode = () => {
  //     setAppliedPromo(null);
  //     setPromoCode("");

  //     toast({
  //       title: "Promotion removed",
  //       description: "The promotion code has been removed from your order.",
  //     });
  //   };

  // Update local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }, [cartItems]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Cart Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex space-x-4">
                      <img
                        src={item.image || "https://placehold.co/100x100"}
                        alt={item.name}
                        className="h-24 w-24 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className="font-medium">
                            {formatCurrency(
                              item.totalPrice || item.price * item.quantity,
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description || ""}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.options &&
                            item.options.length > 0 &&
                            item.options.map((option: any, idx: any) => (
                              <Badge variant="secondary" key={idx}>
                                {option}
                              </Badge>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={"/menu"}>
                  <Button variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setCartItems([])}>
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>
                      {shippingDiscount > 0 ? (
                        <span className="line-through text-muted-foreground">
                          {formatCurrency(deliveryFee)}
                        </span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                      {shippingDiscount > 0 && (
                        <span className="ml-2 text-green-600">
                          {formatCurrency(0)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {/* <div className="pt-4">
                  <label className="block text-sm font-medium mb-2">
                    Promotion Code
                  </label>
                  <div className="flex">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      disabled={appliedPromo !== null}
                      className="rounded-r-none"
                    />
                    {appliedPromo ? (
                      <Button
                        variant="outline"
                        className="rounded-l-none text-red-500"
                        onClick={removePromoCode}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-l-none"
                        onClick={applyPromoCode}
                        disabled={!promoCode}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 text-sm text-green-600">
                      Applied: {appliedPromo.description}
                    </div>
                  )}
                </div> */}

                <Link href={"/checkout"}>
                  <Button className="w-full mt-6" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">Your cart is empty</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href={"/menu"}>
            <Button className="mt-6">
              Browse Menu
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
