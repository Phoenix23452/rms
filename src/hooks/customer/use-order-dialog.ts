"use client";
import { useState } from "react";

export const useOrderDialog = (navigate: any, toast: any) => {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedOptionals, setSelectedOptionals] = useState({});

  const getCart = () => {
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

  const saveCart = (cart: any[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleOrderNow = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedVariation(null);
    setSelectedOptionals({});
  };

  const handleConfirmOrder = () => {
    // Get current cart from localStorage
    const cart = getCart();

    // Create the new order item with all selected options
    if (!selectedItem) return;
    const orderItem = {
      ...selectedItem,
      quantity: quantity,
      totalPrice: selectedItem.regularPrice * quantity,
      // Add selected variation and optionals if implemented
      options: {
        variation: selectedVariation,
        optionals: selectedOptionals,
      },
    };

    // Add the new item to cart
    cart.push(orderItem);

    // Save back to localStorage
    saveCart(cart);

    toast.success(`Added ${selectedItem.name} to cart`);

    // Close the dialog and stay on the same screen
    setSelectedItem(null);

    // Trigger a custom event to update cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleAddToCart = (item: any) => {
    // Get current cart from localStorage
    const cart = getCart();

    // Create the new cart item
    const cartItem = {
      ...item,
      quantity: 1,
      totalPrice: item.price,
    };

    // Add the new item to cart
    cart.push(cartItem);

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
    selectedVariation,
    setSelectedVariation,
    selectedOptionals,
    setSelectedOptionals,
  };
};

export default useOrderDialog;
