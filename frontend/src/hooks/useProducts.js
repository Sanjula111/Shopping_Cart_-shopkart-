import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';

/**
 * Hook to fetch and manage products list with filters
 */
export const useProducts = (initialParams = {}) => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0 });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productAPI.getAll({ ...initialParams, ...params });
      setProducts(data.products);
      setPagination({
        current:    data.currentPage,
        total:      data.totalPages,
        count:      data.total,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, pagination, fetchProducts };
};

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productAPI.getOne(id)
      .then(r => setProduct(r.data.product))
      .catch(err => setError(err.response?.data?.message || 'Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
};
