"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (item: Omit<CartItem, "quantity">, restId: string, restName: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount (hydration-safe)
  useEffect(() => {
    const savedCart = localStorage.getItem("cravebite_cart");
    const savedRestId = localStorage.getItem("cravebite_cart_rest_id");
    const savedRestName = localStorage.getItem("cravebite_cart_rest_name");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedRestId) setRestaurantId(savedRestId);
    if (savedRestName) setRestaurantName(savedRestName);
    
    setMounted(true);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cravebite_cart", JSON.stringify(cartItems));
      if (restaurantId) {
        localStorage.setItem("cravebite_cart_rest_id", restaurantId);
        localStorage.setItem("cravebite_cart_rest_name", restaurantName || "");
      } else {
        localStorage.removeItem("cravebite_cart_rest_id");
        localStorage.removeItem("cravebite_cart_rest_name");
      }
    }
  }, [cartItems, restaurantId, restaurantName, mounted]);

  const addToCart = (item: Omit<CartItem, "quantity">, restId: string, restName: string) => {
    // If adding from a different restaurant, prompt/clear cart
    if (restaurantId && restaurantId !== restId) {
      if (
        window.confirm(
          `You already have items from "${restaurantName}" in your cart. Clear cart and add items from "${restName}"?`
        )
      ) {
        setCartItems([{ ...item, quantity: 1 }]);
        setRestaurantId(restId);
        setRestaurantName(restName);
      }
      return;
    }

    if (!restaurantId) {
      setRestaurantId(restId);
      setRestaurantName(restName);
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== itemId);
      if (updated.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return updated;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
