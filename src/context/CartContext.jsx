import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // --- NEW: Helper to get the correct storage key based on who is logged in ---
  const getStorageKey = () => {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? `b2b_cart_${userEmail}` : 'b2b_cart_guest';
  };

  // Initialize cart based on the specific user's storage key
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(getStorageKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(cart));
  }, [cart]);

  // --- NEW: Call this when a user logs in or logs out to swap the cart! ---
  const reloadCart = () => {
    const savedCart = localStorage.getItem(getStorageKey());
    setCart(savedCart ? JSON.parse(savedCart) : []);
  };

  const addToCart = (product, quantity) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.basePrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, reloadCart, totalQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);