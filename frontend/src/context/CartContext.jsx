import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cart, setCart]       = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setCart({ items: [], totalAmount: 0, totalItems: 0 }); return; }
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch { /* silent */ }
  }, [isLoggedIn]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn) { toast.error('Please login to add items to cart.'); return false; }
    setLoading(true);
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data.cart);
      toast.success('Added to cart! 🛒');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.update(productId, quantity);
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.remove(productId);
      setCart(data.cart);
      toast.success('Item removed.');
    } catch {
      toast.error('Failed to remove item.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } catch { /* silent */ }
  };

  // Computed values
  const cartCount   = cart.items?.reduce((t, i) => t + i.quantity, 0) || 0;
  const cartTotal   = cart.items?.reduce((t, i) => t + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
