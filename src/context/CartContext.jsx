import { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase inside the context
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cloud Sync: Fetch cart from Supabase
  const reloadCart = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setCart([]);
      return;
    }
    const { data, error } = await supabase.from('user_cart').select('*').eq('user_email', email);
    if (!error && data) {
      // Rebuild the cart array format the UI expects
      const formattedCart = data.map(row => ({
        ...row.product_details,
        quantity: row.quantity
      }));
      setCart(formattedCart);
    }
  };

  // Initial load
  useEffect(() => {
    reloadCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        // Update Supabase in the background
        supabase.from('user_cart')
          .update({ quantity: existing.quantity + quantity })
          .match({ user_email: email, product_id: product.id })
          .then();
          
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      
      // Insert into Supabase in the background
      supabase.from('user_cart')
        .insert([{ user_email: email, product_id: product.id, quantity: quantity, product_details: product }])
        .then();
        
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateQuantity = async (productId, newQuantity) => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    
    await supabase.from('user_cart')
      .update({ quantity: newQuantity })
      .match({ user_email: email, product_id: productId });
  };

  const removeFromCart = async (productId) => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    
    await supabase.from('user_cart')
      .delete()
      .match({ user_email: email, product_id: productId });
  };

  const clearCart = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    setCart([]);
    await supabase.from('user_cart').delete().eq('user_email', email);
  };

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.basePrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, totalQuantity, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart, reloadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}