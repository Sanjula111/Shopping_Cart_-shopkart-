// API base URL
export const API_URL = process.env.REACT_APP_API_URL || '/api';

// Local storage keys
export const TOKEN_KEY = 'shopkart_token';
export const USER_KEY  = 'shopkart_user';

// Order statuses
export const ORDER_STATUSES = [
  { value: 'placed',     label: 'Placed',     color: 'blue' },
  { value: 'confirmed',  label: 'Confirmed',  color: 'blue' },
  { value: 'processing', label: 'Processing', color: 'yellow' },
  { value: 'shipped',    label: 'Shipped',    color: 'yellow' },
  { value: 'delivered',  label: 'Delivered',  color: 'green' },
  { value: 'cancelled',  label: 'Cancelled',  color: 'red' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cod',    label: 'Cash on Delivery' },
  { value: 'card',   label: 'Credit/Debit Card' },
  { value: 'online', label: 'Online Payment (UPI)' },
];

// Product units
export const PRODUCT_UNITS = [
  'piece', 'kg', 'g', 'dozen', 'pack', 'box', 'bunch', 'liter', 'ml',
];

// Category emoji map
export const CATEGORY_ICONS = {
  Vegetables: '🥦',
  Fruits:     '🍎',
  Cakes:      '🎂',
  Biscuits:   '🍪',
  Default:    '🛍️',
};

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 1000;
export const SHIPPING_CHARGE = 100;

// Pagination default
export const DEFAULT_PAGE_SIZE = 12;
