import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import OrdersPage, { OrderDetailPage } from './pages/OrdersPage';
import ProfilePage       from './pages/ProfilePage';

// Admin
import AdminLayout     from './components/admin/AdminLayout';
import AdminDashboard  from './components/admin/AdminDashboard';
import AdminProducts   from './components/admin/AdminProducts';
import AdminCategories from './components/admin/AdminCategories';
import AdminOrders     from './components/admin/AdminOrders';
import AdminUsers      from './components/admin/AdminUsers';

// Guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ── Public Routes ─────────────────────── */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/products"     element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
            <Route path="/login"        element={<MainLayout><LoginPage /></MainLayout>} />
            <Route path="/register"     element={<MainLayout><RegisterPage /></MainLayout>} />

            {/* ── Protected Routes ──────────────────── */}
            <Route path="/cart"   element={<MainLayout><ProtectedRoute><CartPage /></ProtectedRoute></MainLayout>} />
            <Route path="/orders" element={<MainLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></MainLayout>} />
            <Route path="/orders/:id" element={<MainLayout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></MainLayout>} />

            {/* ── Admin Routes ───────────────────────── */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index       element={<AdminDashboard />} />
              <Route path="products"   element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders"     element={<AdminOrders />} />
              <Route path="users"      element={<AdminUsers />} />
            </Route>

            {/* ── 404 ───────────────────────────────── */}
            <Route path="*" element={
              <MainLayout>
                <div className="text-center py-24 animate-fade-in">
                  <div className="text-7xl mb-4">🤷</div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Page Not Found</h1>
                  <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </MainLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
