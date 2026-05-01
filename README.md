# 🛒 ShopKart — Full-Stack Shopping Cart Application

A production-ready e-commerce application built with **React.js**, **Node.js/Express**, and **MongoDB**.

---

## 📁 Complete Folder Structure

```
shopkart/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── categoryController.js  # Category CRUD
│   │   ├── productController.js   # Product CRUD + filters
│   │   ├── cartController.js      # Cart operations
│   │   ├── orderController.js     # Order placement & tracking
│   │   └── adminController.js     # Dashboard stats, user mgmt
│   ├── middleware/
│   │   ├── auth.js                # JWT verify + admin guard
│   │   └── error.js               # Central error handler + asyncHandler
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt, roles)
│   │   ├── Category.js            # Category schema (auto-slug)
│   │   ├── Product.js             # Product schema (discount virtual)
│   │   ├── Cart.js                # Cart schema (total virtuals)
│   │   └── Order.js               # Order schema (snapshot prices)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── jwt.js                 # Token generation helper
│   │   └── seeder.js              # Sample data seeder
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminLayout.jsx      # Sidebar layout
    │   │   │   ├── AdminDashboard.jsx   # Stats + recent orders
    │   │   │   ├── AdminProducts.jsx    # Product CRUD UI
    │   │   │   ├── AdminCategories.jsx  # Category CRUD UI
    │   │   │   ├── AdminOrders.jsx      # Order management
    │   │   │   └── AdminUsers.jsx       # User management
    │   │   ├── cart/
    │   │   │   └── CartItem.jsx         # Cart item with qty controls
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx           # Sticky navbar + cart badge
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Loader.jsx           # Spinner, PageLoader, EmptyState
    │   │   │   └── ProtectedRoute.jsx   # Auth guards
    │   │   └── products/
    │   │       └── ProductCard.jsx      # Product grid card
    │   ├── context/
    │   │   ├── AuthContext.jsx          # Global auth state
    │   │   └── CartContext.jsx          # Global cart state
    │   ├── pages/
    │   │   ├── HomePage.jsx             # Hero + categories + featured
    │   │   ├── ProductsPage.jsx         # Products grid with filters
    │   │   ├── ProductDetailPage.jsx    # Single product view
    │   │   ├── CartPage.jsx             # Cart + checkout form
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── OrdersPage.jsx           # My orders + order detail
    │   │   └── ProfilePage.jsx          # Profile + change password
    │   ├── services/
    │   │   └── api.js                   # Axios with interceptors
    │   ├── App.jsx                      # All routes
    │   ├── index.js
    │   └── index.css                    # Tailwind + global styles
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) OR local MongoDB

---

### Step 1 — Clone & Install

```bash
# Clone the project
git clone <your-repo-url>
cd shopkart

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopkart
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 3 — Seed Sample Data

```bash
cd backend
npm run seed
```

This creates:
- ✅ Admin: `admin@shopkart.com` / `Admin@123`
- ✅ User: `user@shopkart.com` / `User@123`
- ✅ 4 categories (Vegetables, Fruits, Cakes, Biscuits)
- ✅ 14 sample products with real Unsplash images

---

### Step 4 — Start the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev       # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start         # Starts on http://localhost:3000
```

Open `http://localhost:3000` in your browser. 🎉

---

## 🔌 REST API Reference

### Auth Endpoints
| Method | Route                     | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| POST   | /api/auth/register        | Public  | Register new user    |
| POST   | /api/auth/login           | Public  | Login & get token    |
| GET    | /api/auth/me              | Private | Get current user     |
| PUT    | /api/auth/profile         | Private | Update profile       |
| PUT    | /api/auth/change-password | Private | Change password      |

### Product Endpoints
| Method | Route                   | Access  | Description            |
|--------|-------------------------|---------|------------------------|
| GET    | /api/products           | Public  | List (search, filter)  |
| GET    | /api/products/:id       | Public  | Single product         |
| GET    | /api/products/admin/all | Admin   | All incl. inactive     |
| POST   | /api/products           | Admin   | Create product         |
| PUT    | /api/products/:id       | Admin   | Update product         |
| DELETE | /api/products/:id       | Admin   | Delete product         |

### Cart Endpoints
| Method | Route               | Access  | Description         |
|--------|---------------------|---------|---------------------|
| GET    | /api/cart           | Private | Get user cart       |
| POST   | /api/cart           | Private | Add item to cart    |
| PUT    | /api/cart/:productId| Private | Update quantity     |
| DELETE | /api/cart/:productId| Private | Remove item         |
| DELETE | /api/cart           | Private | Clear entire cart   |

### Order Endpoints
| Method | Route                   | Access  | Description         |
|--------|-------------------------|---------|---------------------|
| POST   | /api/orders             | Private | Place order         |
| GET    | /api/orders/my          | Private | My orders           |
| GET    | /api/orders/:id         | Private | Single order        |
| GET    | /api/orders             | Admin   | All orders          |
| PUT    | /api/orders/:id/status  | Admin   | Update status       |

### Admin Endpoints
| Method | Route                          | Access | Description       |
|--------|--------------------------------|--------|-------------------|
| GET    | /api/admin/stats               | Admin  | Dashboard stats   |
| GET    | /api/admin/users               | Admin  | All users         |
| PUT    | /api/admin/users/:id/toggle    | Admin  | Toggle user active|

---

## 🗄️ Database Models

### User
```js
{ name, email, password (hashed), role (user/admin), googleId, avatar, isActive }
```

### Category
```js
{ name, slug (auto), description, image, isActive }
```

### Product
```js
{ name, description, price, originalPrice, image, category (ref), stock, unit, isActive, ratings, tags }
// Virtual: discountPercent
```

### Cart
```js
{ user (ref), items: [{ product (ref), quantity, price }] }
// Virtuals: totalAmount, totalItems
```

### Order
```js
{ user (ref), items (snapshot), shippingAddress, paymentMethod, paymentStatus, orderStatus, subtotal, shippingCharge, totalAmount }
```

---

## 🚀 Deployment Guide

### Backend → Render.com

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, select the `backend` folder
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables (same as `.env`)
6. Deploy! You'll get a URL like `https://shopkart-api.onrender.com`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo, select the `frontend` folder
3. Set:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://shopkart-api.onrender.com/api`
5. Deploy! You'll get a URL like `https://shopkart.vercel.app`

### Database → MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Database Access → Create user with read/write
4. Network Access → Allow `0.0.0.0/0` (all IPs for Render)
5. Get connection string and set as `MONGODB_URI`

---

## 🔐 Security Features

- ✅ Passwords hashed with **bcryptjs** (12 salt rounds)
- ✅ JWT tokens with expiry (7 days)
- ✅ Role-based access control (user / admin)
- ✅ Rate limiting (100 req/15 min per IP)
- ✅ CORS configured for specific origin
- ✅ Input validation on all routes
- ✅ Mongoose schema validation
- ✅ Error messages don't expose internals in production

---

## 🛠️ Tech Stack Summary

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, Tailwind CSS  |
| Routing    | React Router v6         |
| State      | Context API + useState  |
| HTTP       | Axios with interceptors |
| Backend    | Node.js + Express       |
| Database   | MongoDB + Mongoose      |
| Auth       | JWT (jsonwebtoken)      |
| Security   | bcryptjs, express-rate-limit, cors |
| Dev Tools  | nodemon, morgan         |
| Deploy     | Vercel + Render + Atlas |

---

## 🧪 Test Credentials (after seeding)

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@shopkart.com     | Admin@123 |
| User  | user@shopkart.com      | User@123  |
