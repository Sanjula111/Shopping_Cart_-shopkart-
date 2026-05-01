import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🌿</div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join ShopKart and start shopping fresh</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required placeholder="John Doe" className="input"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required placeholder="you@example.com" className="input"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required placeholder="Min 6 characters" className="input pr-10"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" required placeholder="Repeat password" className="input"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
                : 'Create Account'
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
