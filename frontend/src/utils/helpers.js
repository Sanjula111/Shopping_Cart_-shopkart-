/**
 * Format a number as Indian Rupee currency string
 * e.g. 1500 => "₹1,500.00"
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to readable format
 * e.g. "2024-01-15T10:30:00Z" => "Jan 15, 2024"
 */
export const formatDate = (dateStr, options = {}) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
    ...options,
  });
};

/**
 * Truncate text to a max length with ellipsis
 */
export const truncate = (text, maxLen = 80) => {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
};

/**
 * Calculate discount percentage between original and sale price
 */
export const calcDiscount = (original, sale) => {
  if (!original || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
};

/**
 * Get order status color class
 */
export const getStatusClass = (status) => {
  const map = {
    placed:     'badge-blue',
    confirmed:  'badge-blue',
    processing: 'badge-yellow',
    shipped:    'badge-yellow',
    delivered:  'badge-green',
    cancelled:  'badge-red',
    pending:    'badge-yellow',
    paid:       'badge-green',
    failed:     'badge-red',
  };
  return map[status] || 'badge-blue';
};

/**
 * Get initials from a name (e.g. "John Doe" => "JD")
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Debounce function - delays execution until after wait ms
 */
export const debounce = (fn, wait = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};
