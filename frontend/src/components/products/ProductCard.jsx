import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product._id, 1);
    setAdding(false);
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="card group flex flex-col overflow-hidden animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-1">
          {product.category?.name || 'General'}
        </p>
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
          <span className="text-xs text-gray-500">/{product.unit}</span>
        </div>

        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2 mt-auto"
        >
          {adding ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
          ) : (
            <><span>🛒</span> Add to Cart</>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
