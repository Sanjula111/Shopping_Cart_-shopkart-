import React from 'react';

export const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { primary: 'border-primary-600', white: 'border-white', gray: 'border-gray-400' };
  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  );
};

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-3 text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

export const EmptyState = ({ icon = '📭', title, message, action }) => (
  <div className="text-center py-16">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    {message && <p className="text-gray-500 text-sm mb-4">{message}</p>}
    {action}
  </div>
);
