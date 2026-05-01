import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';
import { EmptyState } from '../components/common/Loader';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({
    street: '', city: '', state: '', zipCode: '', paymentMethod: 'cod',
  });

  const shipping  = cartTotal > 1000 ? 0 : cartTotal > 0 ? 100 : 0;
  const grandTotal = cartTotal + shipping;

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.zipCode) {
      toast.error('Please fill all address fields.');
      return;
    }
    setPlacing(true);
    try {
      const { data } = await orderAPI.place({
        shippingAddress: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode },
        paymentMethod: form.paymentMethod,
      });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some fresh products to get started!"
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Shopping Cart <span className="text-gray-400 text-xl font-sans">({cart.items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.product?._id || item._id} item={item} />
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
            🗑 Clear entire cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-gray-900'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add ₹{(1000 - cartTotal).toFixed(0)} more for free shipping</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-700">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {!showCheckout ? (
              <button onClick={() => { if (!isLoggedIn) { toast.error('Please login to checkout.'); return; } setShowCheckout(true); }}
                className="btn-primary w-full mt-5">
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleOrder} className="mt-5 space-y-3">
                <p className="font-semibold text-gray-800 text-sm">Shipping Address</p>
                {[
                  { name: 'street',  placeholder: 'Street Address' },
                  { name: 'city',    placeholder: 'City' },
                  { name: 'state',   placeholder: 'State' },
                  { name: 'zipCode', placeholder: 'ZIP Code' },
                ].map(f => (
                  <input key={f.name} className="input text-sm" placeholder={f.placeholder}
                    value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })} />
                ))}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Payment Method</label>
                  <select className="input text-sm" value={form.paymentMethod}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
                <button type="submit" disabled={placing} className="btn-primary w-full">
                  {placing
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing Order...</span>
                    : `Place Order · ₹${grandTotal.toFixed(2)}`
                  }
                </button>
                <button type="button" onClick={() => setShowCheckout(false)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 text-center">
                  ← Back to Cart
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
