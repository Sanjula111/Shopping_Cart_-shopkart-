import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('shopkart_user') || 'null'));
  const [token, setToken]     = useState(() => localStorage.getItem('shopkart_token') || null);
  const [loading, setLoading] = useState(false);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user)  localStorage.setItem('shopkart_user', JSON.stringify(user));
    else       localStorage.removeItem('shopkart_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('shopkart_token', token);
    else       localStorage.removeItem('shopkart_token');
  }, [token]);

  const saveAuth = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      saveAuth(data);
      toast.success(data.message || 'Account created!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      saveAuth(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true, role: data.user.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      toast.error(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully.');
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
    } catch {
      logout();
    }
  };

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, isLoggedIn, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
