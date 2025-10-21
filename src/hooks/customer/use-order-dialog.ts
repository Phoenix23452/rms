"use client";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOrderDialog = (navigate: any, toast: any) => {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedOptionals, setSelectedOptionals] = useState<Variant[]>([]);

  const getCart = (): CartItem[] => {
    if (typeof window === "undefined") return []; // SSR safety
    try {
      const existingCart = localStorage.getItem("cart");
      if (existingCart) {
        const parsed = JSON.parse(existingCart);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
    }
    return [];
  };

  const saveCart = (cart: CartItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const calculateUnitPrice = (
    product: Product,
    variant: Variant | null,
  ): number => {
    let basePrice = variant ? variant.price : product.regularPrice;
    if (product.discountPercentage) {
      basePrice = basePrice - (basePrice * product.discountPercentage) / 100;
    }
    return basePrice;
  };

  const handleOrderNow = (item: Product) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedVariant(item.variants[0]);
    setSelectedOptionals([]);
  };

  const handleConfirmOrder = () => {
    // Get current cart from localStorage
    const cart = getCart();

    // determine unit price
    // Create the new order item with all selected options
    if (!selectedItem) return;
    if (!selectedVariant) return;
    const unitPrice = calculateUnitPrice(selectedItem, selectedVariant);
    let totalPrice = unitPrice * quantity;
    // Add price of optional items, if any
    if (selectedOptionals && selectedOptionals.length > 0) {
      selectedOptionals.forEach((optionalItem) => {
        // Assuming optionalItem.price gives the price of the optional variant
        totalPrice += optionalItem.price;
      });
    }

    const orderItem: CartItem = {
      product: selectedItem,
      quantity: quantity,
      price: totalPrice,
      unitPrice,
      regularPrice: selectedVariant.price,
      discountPercentage: selectedItem.discountPercentage,
      variantId: selectedVariant?.id,
      variant: selectedVariant,
      optionalItems: selectedOptionals,
      // Add selected variation and optionals if implemented
    };
    const existingIndex = cart.findIndex(
      (c) =>
        c.variantId === orderItem.variantId &&
        (!c.variantId || c.variantId === orderItem.variantId),
    );
    if (existingIndex >= 0) {
      // update quantity and price
      cart[existingIndex].quantity += quantity;
      cart[existingIndex].price =
        cart[existingIndex].unitPrice * cart[existingIndex].quantity;
    } else {
      cart.push(orderItem);
    }
    // Add the new item to cart
    console.log("Cart", orderItem);
    // Save back to localStorage
    saveCart(cart);

    toast.success(`Added ${selectedItem.name} to cart`);

    // Close the dialog and stay on the same screen
    setSelectedItem(null);

    // Trigger a custom event to update cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleAddToCart = (item: Product) => {
    // Get current cart from localStorage
    const cart = getCart();

    const unitPrice = calculateUnitPrice(item, item.variants[0]);
    // Create the new cart item
    const cartItem: CartItem = {
      product: item,
      quantity: 1,
      unitPrice,
      price: unitPrice,
      regularPrice: item.regularPrice,
      discountPercentage: item.discountPercentage,
      optionalItems: [],
    };

    // check if same product (no variant)
    const existingIndex = cart.findIndex(
      (c) => !c.variantId && item.id === c.variant?.productId,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
      cart[existingIndex].price =
        cart[existingIndex].unitPrice * cart[existingIndex].quantity;
    } else {
      cart.push(cartItem);
    }

    // Save back to localStorage
    saveCart(cart);
    toast.success(`Added ${item.name} to cart`);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return {
    selectedItem,
    setSelectedItem,
    quantity,
    handleOrderNow,
    increaseQuantity,
    decreaseQuantity,
    handleConfirmOrder,
    handleAddToCart,
    selectedVariant,
    setSelectedVariant,
    selectedOptionals,
    setSelectedOptionals,
  };
};

export default useOrderDialog;
