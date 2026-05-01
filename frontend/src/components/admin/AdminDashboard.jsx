import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { PageLoader } from '../common/Loader';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const STATUS_BADGE = {
  placed:     'badge-blue',
  confirmed:  'badge-blue',
  processing: 'badge-yellow',
  shipped:    'badge-yellow',
  delivered:  'badge-green',
  cancelled:  'badge-red',
};

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data)   return <div className="text-gray-500">Failed to load stats.</div>;

  const { stats, recentOrders } = data;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users"     value={stats.totalUsers}     color="bg-blue-50" />
        <StatCard icon="📦" label="Products"        value={stats.totalProducts}  color="bg-green-50" />
        <StatCard icon="🧾" label="Total Orders"    value={stats.totalOrders}    color="bg-purple-50" />
        <StatCard icon="🏷" label="Categories"      value={stats.totalCategories} color="bg-yellow-50" />
        <StatCard icon="💰" label="Revenue"         value={`₹${stats.totalRevenue?.toFixed(0)}`} color="bg-emerald-50" />
        <StatCard icon="⏳" label="Pending Orders"  value={stats.pendingOrders}  color="bg-orange-50" />
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items?.length} items</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{order.totalAmount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_BADGE[order.orderStatus]} capitalize`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!recentOrders || recentOrders.length === 0) && (
            <div className="text-center py-8 text-gray-400 text-sm">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
