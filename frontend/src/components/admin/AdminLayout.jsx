import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { to: '/admin',              label: 'Dashboard', icon: '📊' },
  { to: '/admin/products',     label: 'Products',  icon: '📦' },
  { to: '/admin/categories',   label: 'Categories',icon: '🏷' },
  { to: '/admin/orders',       label: 'Orders',    icon: '🧾' },
  { to: '/admin/users',        label: 'Users',     icon: '👥' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-gray-900 text-white flex-shrink-0 transition-all duration-200 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800">
          {!collapsed && <span className="font-display text-lg font-bold">⚙️ Admin</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1 rounded hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {MENU.map((item) => {
            const active = item.to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800">
          <div className={`flex items-center gap-2 mb-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button onClick={logout}
            className={`flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-gray-800 w-full ${collapsed ? 'justify-center' : ''}`}>
            🚪 {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
