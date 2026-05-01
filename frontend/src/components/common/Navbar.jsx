import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/orders',   label: 'My Orders', auth: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="font-display text-xl font-bold text-gray-900">ShopKart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              (!link.auth || isLoggedIn) ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ) : null
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      👤 My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      📦 My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 hidden sm:block">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-50"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 animate-fade-in">
            {navLinks.map((link) =>
              (!link.auth || isLoggedIn) ? (
                <Link key={link.to} to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">
                  {link.label}
                </Link>
              ) : null
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
