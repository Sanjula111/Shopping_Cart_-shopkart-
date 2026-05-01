import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { PageLoader, EmptyState } from '../components/common/Loader';

const STATUS_STYLES = {
  placed:      'badge-blue',
  confirmed:   'badge-blue',
  processing:  'badge-yellow',
  shipped:     'badge-yellow',
  delivered:   'badge-green',
  cancelled:   'badge-red',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMy()
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet"
          message="Place your first order and it will appear here."
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                  <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${STATUS_STYLES[order.orderStatus] || 'badge-blue'} capitalize`}>
                    {order.orderStatus}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/32'; }} />
                    <div>
                      <p className="text-xs font-medium text-gray-700 line-clamp-1 max-w-[80px]">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex-shrink-0 flex items-center px-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-500">
                    +{order.items.length - 4} more
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div>
                  <span className="text-sm text-gray-500">Total: </span>
                  <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 ml-2 capitalize">({order.paymentMethod})</span>
                </div>
                <Link to={`/orders/${order._id}`}
                  className="text-primary-600 text-sm font-semibold hover:underline">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(r => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!order)  return <div className="text-center py-16 text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Link to="/orders" className="text-sm text-primary-600 hover:underline mb-4 block">← Back to Orders</Link>

      <div className="card p-6 mb-5">
        <div className="flex flex-wrap justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`badge ${STATUS_STYLES[order.orderStatus] || 'badge-blue'} capitalize self-start`}>
            {order.orderStatus}
          </span>
        </div>

        {/* Items */}
        <h3 className="font-semibold text-gray-800 mb-3">Items Ordered</h3>
        <div className="space-y-3 mb-5">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span></div>
          <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
            <span>Total</span><span className="text-primary-700">₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {order.shippingAddress.street}, {order.shippingAddress.city},<br/>
            {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br/>
            {order.shippingAddress.country}
          </p>
          <p className="text-sm text-gray-600 mt-2">Payment: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
