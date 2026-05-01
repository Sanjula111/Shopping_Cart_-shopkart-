import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-6">
          <span className="text-[120px] font-display font-bold text-gray-100 leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🤷</span>
          </div>
        </div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-outline">
            ← Go Back
          </button>
          <Link to="/" className="btn-primary">
            🏠 Back to Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10">
          <p className="text-sm text-gray-400 mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { to: '/products',  label: '🛍️ Shop' },
              { to: '/cart',      label: '🛒 Cart' },
              { to: '/orders',    label: '📦 Orders' },
              { to: '/login',     label: '🔐 Login' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="text-sm text-primary-600 hover:underline bg-primary-50 px-3 py-1.5 rounded-lg">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
