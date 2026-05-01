const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/admin',      require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ShopKart API is running 🚀', env: process.env.NODE_ENV });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Central Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 ShopKart Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
});
