
import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartCount, setCartCount] = useState(0);

  // Update cart count in local storage and UI
  const updateCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (!cart) return 0;
    
    try {
      const parsedCart = JSON.parse(cart);
      const count = Array.isArray(parsedCart) 
        ? parsedCart.reduce((total, item) => total + (item.quantity || 0), 0)
        : 0;
      
      setCartCount(count);
      return count;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    // Initialize cart count
    updateCartCount();

    // Set up storage event listener to update cart count when it changes in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return {
    cartCount,
    updateCartCount
  };
};

export default useCart;
