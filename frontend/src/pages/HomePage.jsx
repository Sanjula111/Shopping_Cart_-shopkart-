import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { PageLoader } from '../components/common/Loader';

const CATEGORY_ICONS = { Vegetables: '🥦', Fruits: '🍎', Cakes: '🎂', Biscuits: '🍪' };

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured]     = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll({ limit: 8, sort: '-createdAt' }),
        ]);
        setCategories(catRes.data.categories);
        setFeatured(prodRes.data.products);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🥦</div>
          <div className="absolute top-5 right-20 text-8xl">🍎</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🎂</div>
          <div className="absolute bottom-5 right-10 text-8xl">🍪</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🚀 Fresh Arrivals Daily
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
            Fresh, Fast &<br className="hidden md:block" /> Delivered to You
          </h1>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Shop fresh vegetables, seasonal fruits, artisan cakes, and crispy biscuits — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Shop Now →
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Join Free
            </Link>
          </div>
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[['100+', 'Products'], ['50+', 'Daily Orders'], ['4.8★', 'Rating']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold">{n}</div>
                <div className="text-primary-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-1">Browse our hand-picked selections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="card p-6 text-center group hover:border-primary-200 hover:bg-primary-50 transition-all"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {CATEGORY_ICONS[cat.name] || '🏪'}
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-primary-700">{cat.name}</h3>
              {cat.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Our most popular items this week</p>
          </div>
          <Link to="/products" className="btn-outline text-sm hidden sm:block">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="bg-accent-50 border-t border-accent-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            🚚 Free Delivery on Orders Above ₹1000
          </h2>
          <p className="text-gray-600 mb-5">Use code <strong>FRESH10</strong> for 10% off your first order</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
