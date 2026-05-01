import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { PageLoader } from '../common/Loader';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  placed:     'badge-blue',
  confirmed:  'badge-blue',
  processing: 'badge-yellow',
  shipped:    'badge-yellow',
  delivered:  'badge-green',
  cancelled:  'badge-red',
};

const ORDER_STATUSES = ['placed','confirmed','processing','shipped','delivered','cancelled'];

const AdminOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    orderAPI.getAll()
      .then(r => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, orderStatus) => {
    try {
      await orderAPI.updateStatus(id, { orderStatus });
      toast.success('Order status updated!');
      load();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items?.length}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{order.totalAmount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'} capitalize`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_BADGE[order.orderStatus]} capitalize`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(order)}
                      className="text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-1.5 rounded-lg font-medium">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No orders found.</div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Order #{selected._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="font-medium text-gray-800">{selected.user?.name}</p>
                <p className="text-sm text-gray-500">{selected.user?.email}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => { e.target.src='https://via.placeholder.com/40'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-3 text-sm space-y-1">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{selected.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{selected.shippingCharge === 0 ? 'FREE' : `₹${selected.shippingCharge}`}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>₹{selected.totalAmount?.toFixed(2)}</span></div>
              </div>

              {/* Update Status */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {ORDER_STATUSES.map(status => (
                    <button key={status} onClick={() => updateStatus(selected._id, status)}
                      className={`text-xs font-medium py-2 rounded-xl capitalize transition-all ${
                        selected.orderStatus === status
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
