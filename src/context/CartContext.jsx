import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('freshlync_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    return []; // Array of cart items
  });

  useEffect(() => {
    localStorage.setItem('freshlync_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, addQty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item => 
          item.name === product.name 
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      }
      return [...prev, { ...product, quantity: addQty }];
    });
  };

  const removeFromCart = (productName) => {
    setCart(prev => prev.filter(item => item.name !== productName));
  };

  const clearCart = () => setCart([]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
