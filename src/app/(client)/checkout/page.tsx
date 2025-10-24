"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Home,
  Building,
  CreditCard,
  Smartphone,
  DollarSign,
  Clock,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

// Mock delivery areas
// const deliveryAreas = [
//   { id: 1, name: "Downtown", fee: 3.5, time: 20 },
//   { id: 2, name: "Westside", fee: 4.0, time: 25 },
//   { id: 3, name: "Eastside", fee: 4.5, time: 30 },
//   { id: 4, name: "Northend", fee: 5.0, time: 35 },
//   { id: 5, name: "Southside", fee: 5.5, time: 40 },
// ];

// 🛠 helper: read + validate cart
const getCartFromStorage = () => {
  if (typeof window === "undefined") return [];
  const savedCart = localStorage.getItem("cart");
  if (!savedCart) return [];
  try {
    const parsedCart = JSON.parse(savedCart);
    return parsedCart.map((item: CartItem) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
  } catch (error) {
    console.error("Error parsing cart data:", error);
    return [];
  }
};
const computeTotalDiscount = (cartItems: CartItem[]) => {
  const discount = cartItems.reduce((acc, item) => {
    const regularPrice = item.regularPrice;
    const unitPrice = item.unitPrice;

    // (regularPrice - unitPrice) * quantity
    const itemDiscount = (regularPrice - unitPrice) * item.quantity;

    return acc + itemDiscount;
  }, 0);

  return discount;
};
const CheckoutPage = () => {
  const router = useRouter();
  // Form state
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage());
  console.log("Cart Items:", cartItems);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [addressType, setAddressType] = useState("home");
  const [selectedArea, setSelectedArea] = useState("1");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Calculate order totals
  // const subtotal = cartItems.reduce(
  //   (total, item) => total + item.totalPrice,
  //   0,
  // );
  const subtotal =
    cartItems.length > 0
      ? cartItems.reduce((total, item) => total + item.price, 0)
      : 0;
  // const selectedAreaObj = deliveryAreas.find(
  //   (area) => area.id.toString() === selectedArea,
  // );
  // const deliveryFee =
  //   deliveryOption === "delivery"
  //     ? selectedAreaObj || 0
  //       ? selectedAreaObj.fee
  //       : 0
  //     : 0;
  const deliveryFee = deliveryOption === "delivery" ? 5.0 : 2.0;

  const discount = computeTotalDiscount(cartItems);
  const tax = subtotal * 0.0;
  const total = subtotal + deliveryFee + tax;

  // Get estimated delivery time
  // const estimatedTime =
  //   deliveryOption === "delivery"
  //     ? selectedAreaObj
  //       ? selectedAreaObj.time
  //       : 0
  //     : 15;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name || !phone || !email) {
      toast.error("Missing information", {
        description: "Please fill in all required contact fields.",
      });
      return;
    }

    if (deliveryOption === "delivery" && !address) {
      toast.error("Address required", {
        description: "Please enter your delivery address.",
      });
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCVV)) {
      toast.error("Payment information required", {
        description: "Please enter your card details.",
      });
      return;
    }

    // Process order (would normally send to API)
    toast("Order placed successfully!", {
      description: "Your order has been received and is being processed.",
    });

    // Navigate to order tracking page with a mock order ID
    router.push("/track/ORD-5291");
  };

  // Format card number as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
  };

  // Format card expiry as user types
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setCardExpiry(value);
    } else {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your order details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={deliveryOption}
                  onValueChange={setDeliveryOption}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${deliveryOption === "delivery" ? "border-primary" : "border-border"}`}
                  >
                    <RadioGroupItem
                      value="delivery"
                      id="delivery"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="delivery"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="h-6 w-6" />
                      <div className="font-medium">Delivery</div>
                      <div className="text-xs text-center text-muted-foreground">
                        Deliver to your location
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${deliveryOption === "pickup" ? "border-primary" : "border-border"}`}
                  >
                    <RadioGroupItem
                      value="pickup"
                      id="pickup"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="pickup"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="h-6 w-6" />
                      <div className="font-medium">Pickup</div>
                      <div className="text-xs text-center text-muted-foreground">
                        Pickup from restaurant
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${deliveryOption === "dine-in" ? "border-primary" : "border-border"}`}
                  >
                    <RadioGroupItem
                      value="dine-in"
                      id="dine-in"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="dine-in"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <Building className="h-6 w-6" />
                      <div className="font-medium">Dine-in</div>
                      <div className="text-xs text-center text-muted-foreground">
                        Eat at restaurant
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryOption === "delivery" && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Delivery area selection removed */}
                      {/* <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="area" className="block mb-2">
                          Delivery Area
                        </Label>
                        <Select
                          value={selectedArea}
                          onValueChange={setSelectedArea}
                        >
                          <SelectTrigger id="area" className="w-full">
                            <SelectValue
                              placeholder="Select area"
                              className="w-full"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryAreas.map((area) => (
                              <SelectItem
                                key={area.id}
                                value={area.id.toString()}
                              >
                                {area.name} ({formatCurrency(area.fee)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div> */}
                      <div className="col-span-2 md:col-span-1">
                        <Label className="block mb-2">Address Type</Label>
                        <div className="flex space-x-4">
                          <div
                            className={`flex-1 border rounded-md p-3 cursor-pointer ${addressType === "home" ? "border-primary" : "border-border"}`}
                            onClick={() => setAddressType("home")}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Home className="h-4 w-4" />
                              <span>Home</span>
                            </div>
                          </div>
                          <div
                            className={`flex-1 border rounded-md p-3 cursor-pointer ${addressType === "work" ? "border-primary" : "border-border"}`}
                            onClick={() => setAddressType("work")}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>Work</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address" className="block mb-2">
                        Delivery Address
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructions" className="block mb-2">
                        Delivery Instructions (Optional)
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Add any special instructions for delivery"
                        rows={2}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {deliveryOption === "pickup" && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>
                        Estimated pickup time: 15-20 minutes after order
                        placement
                      </span>
                    </div>
                    <div className="mt-4">
                      <Label
                        htmlFor="pickupInstructions"
                        className="block mb-2"
                      >
                        Pickup Instructions (Optional)
                      </Label>
                      <Textarea
                        id="pickupInstructions"
                        placeholder="Add any special instructions for pickup"
                        rows={2}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {deliveryOption === "dine-in" && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>
                        Your order will be prepared when you arrive at the
                        restaurant
                      </span>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="dineInstructions" className="block mb-2">
                        Special Instructions (Optional)
                      </Label>
                      <Textarea
                        id="dineInstructions"
                        placeholder="Add any special requests or notes"
                        rows={2}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="block mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block mb-2">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="block mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "card" ? "border-primary" : "border-border"}`}
                  >
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-6 w-6" />
                      <div className="font-medium">Credit/Debit Card</div>
                    </Label>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "mobile" ? "border-primary" : "border-border"}`}
                  >
                    <RadioGroupItem
                      value="mobile"
                      id="mobile"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="mobile"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="h-6 w-6" />
                      <div className="font-medium">Mobile Payment</div>
                    </Label>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "cash" ? "border-primary" : "border-border"}`}
                  >
                    <RadioGroupItem
                      value="cash"
                      id="cash"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <DollarSign className="h-6 w-6" />
                      <div className="font-medium">Cash on Delivery</div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4 min-h-36">
                    <div>
                      <Label htmlFor="cardNumber" className="block mb-2">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="block mb-2">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="block mb-2">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardCVV}
                          onChange={(e) =>
                            setCardCVV(e.target.value.replace(/\D/g, ""))
                          }
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "mobile" && (
                  <div className="mt-4 text-center min-h-36">
                    <p className="text-muted-foreground">
                      You&apos;ll be redirected to complete payment through your
                      mobile payment provider after placing your order.
                    </p>
                  </div>
                )}

                {paymentMethod === "cash" && (
                  <div className="mt-4 text-center min-h-36">
                    <p className="text-muted-foreground">
                      Please have the exact amount ready for the delivery
                      driver.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Link href={"/cart"}>
                <Button type="button" variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Cart
                </Button>
              </Link>
              <Button type="submit">
                Place Order
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                {cartItems.map((item) => (
                  <div key={item.variantId}>
                    <div className="flex justify-between py-1">
                      <div>
                        <span className="font-medium">{item.quantity}x </span>
                        <span>{item.product.name}</span>
                        <span className="ml-2 font-light text-sm ">
                          ({item.variant?.name})
                        </span>
                      </div>
                      <span>
                        {formatCurrency(item.regularPrice * item.quantity)}
                      </span>
                    </div>
                    {item.optionalItems && item.optionalItems.length > 0 && (
                      <div className="ml-4 text-sm text-muted-foreground ">
                        {item.optionalItems.map((option, index) => (
                          <div key={index} className="flex justify-between">
                            <span>- {option.name}</span>
                            <span>{formatCurrency(option.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                {/* <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div> */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {deliveryOption === "delivery"
                      ? "Delivery Fee"
                      : "Service Fee"}
                  </span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="mt-4 bg-muted p-3 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {deliveryOption === "delivery" ? (
                      <span>
                        Estimated delivery time:{" "}
                        {/* <strong>{estimatedTime } minutes</strong> */}
                        <strong>{30} minutes</strong>
                      </span>
                    ) : deliveryOption === "pickup" ? (
                      <span>
                        Estimated pickup time: <strong>15-20 minutes</strong>
                      </span>
                    ) : (
                      <span>Your order will be ready when you arrive</span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
