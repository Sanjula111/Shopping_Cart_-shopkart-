import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem, loading } = useCart();
  const { product, quantity, price } = item;

  if (!product) return null;

  return (
    <div className="card p-4 flex gap-4 animate-fade-in">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=N/A'; }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm leading-snug truncate">{product.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">₹{price} per unit</p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => quantity > 1 ? updateQuantity(product._id, quantity - 1) : removeItem(product._id)}
              disabled={loading}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 font-bold text-gray-700 transition"
            >
              {quantity === 1 ? '🗑' : '−'}
            </button>
            <span className="w-8 text-center text-sm font-bold text-gray-800">{quantity}</span>
            <button
              onClick={() => updateQuantity(product._id, quantity + 1)}
              disabled={loading || quantity >= product.stock}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 font-bold text-gray-700 transition disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-bold text-gray-900">₹{(price * quantity).toFixed(2)}</p>
            <button
              onClick={() => removeItem(product._id)}
              className="text-xs text-red-500 hover:text-red-700 mt-0.5"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
