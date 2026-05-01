import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="font-display text-xl font-bold text-white">ShopKart</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Your one-stop shop for fresh vegetables, fruits, cakes, and biscuits. Quality guaranteed, delivered fresh.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/"         className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Shop</Link></li>
            <li><Link to="/cart"     className="hover:text-white transition-colors">Cart</Link></li>
            <li><Link to="/orders"   className="hover:text-white transition-colors">Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['Vegetables', 'Fruits', 'Cakes', 'Biscuits'].map((c) => (
              <li key={c}>
                <Link to={`/products?search=${c}`} className="hover:text-white transition-colors">{c}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShopKart. Built with ❤️ using React + Node.js + MongoDB.
      </div>
    </div>
  </footer>
);

export default Footer;
