import React from 'react';

/**
 * Badge component for status labels
 * Variants: green | yellow | red | blue | gray
 */
const Badge = ({ children, variant = 'blue', size = 'sm' }) => {
  const variants = {
    green:  'bg-green-100  text-green-700  border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red:    'bg-red-100    text-red-700    border-red-200',
    blue:   'bg-blue-100   text-blue-700   border-blue-200',
    gray:   'bg-gray-100   text-gray-700   border-gray-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full border
      ${variants[variant] || variants.blue}
      ${sizes[size] || sizes.sm}
    `}>
      {children}
    </span>
  );
};

export default Badge;
