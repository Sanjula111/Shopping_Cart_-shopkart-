import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { PageLoader, EmptyState } from '../components/common/Loader';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch]         = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sort, setSort]             = useState('-createdAt');
  const [page, setPage]             = useState(1);

  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data.categories)); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search)      params.search   = search;
      if (selectedCat) params.category = selectedCat;

      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPagination({ current: data.currentPage, total: data.totalPages, count: data.total });
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [page, sort, search, selectedCat]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCategoryFilter = (catId) => {
    setSelectedCat(catId);
    setPage(1);
    const params = {};
    if (catId) params.category = catId;
    if (search) params.search  = search;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-1">{pagination.count || 0} products available</p>
      </div>

      {/* ── Filters Bar ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input flex-1"
          />
          <button type="submit" className="btn-primary px-4 py-2">🔍</button>
        </form>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="md:w-52 flex-shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCat ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategoryFilter(cat._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCat === cat._id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Product Grid ─────────────────────────────── */}
        <div className="flex-1">
          {loading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <EmptyState icon="🔍" title="No products found"
              message="Try adjusting your search or filters." />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.total > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
                    ← Prev
                  </button>
                  {Array.from({ length: pagination.total }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium ${
                        page === p ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page === pagination.total} onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
