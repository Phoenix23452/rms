"use client";
import { useState } from "react";

export const useOrderDialog = (navigate: any, toast: any) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedOptionals, setSelectedOptionals] = useState({});

  const handleOrderNow = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedVariation(null);
    setSelectedOptionals({});
  };

  const handleConfirmOrder = () => {
    // Get current cart from localStorage
    let cart = [];
    const existingCart = localStorage.getItem("cart");

    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
        if (!Array.isArray(cart)) {
          cart = []; // Reset if not an array
        }
      } catch (e) {
        cart = []; // Reset on parse error
      }
    }

    // Create the new order item with all selected options
    const orderItem = {
      ...selectedItem,
      quantity: quantity,
      totalPrice: selectedItem.price * quantity,
      // Add selected variation and optionals if implemented
      options: {
        variation: selectedVariation,
        optionals: selectedOptionals,
      },
    };

    // Add the new item to cart
    cart.push(orderItem);

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    toast({
      description: `Added ${selectedItem.name} to cart`,
    });

    // Close the dialog and stay on the same screen
    setSelectedItem(null);

    // Trigger a custom event to update cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleAddToCart = (item) => {
    // Get current cart from localStorage
    let cart = [];
    const existingCart = localStorage.getItem("cart");

    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
        if (!Array.isArray(cart)) {
          cart = []; // Reset if not an array
        }
      } catch (e) {
        cart = []; // Reset on parse error
      }
    }

    // Create the new cart item
    const cartItem = {
      ...item,
      quantity: 1,
      totalPrice: item.price,
    };

    // Add the new item to cart
    cart.push(cartItem);

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    toast({
      description: `Added ${item.name} to cart`,
    });
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
