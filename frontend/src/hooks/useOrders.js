import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

/**
 * Hook to fetch current user's orders
 */
export const useMyOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    orderAPI.getMy()
      .then(r => setOrders(r.data.orders))
      .catch(err => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error };
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (id) => {
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    orderAPI.getOne(id)
      .then(r => setOrder(r.data.order))
      .catch(err => setError(err.response?.data?.message || 'Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { order, loading, error };
};
