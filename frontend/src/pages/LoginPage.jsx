import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🛒</div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your ShopKart account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required placeholder="you@example.com" className="input"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required placeholder="••••••••" className="input pr-10"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-5 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            <p className="font-semibold mb-1">🧪 Demo Accounts:</p>
            <p>Admin: <strong>admin@shopkart.com</strong> / Admin@123</p>
            <p>User: <strong>user@shopkart.com</strong> / User@123</p>
          </div>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
