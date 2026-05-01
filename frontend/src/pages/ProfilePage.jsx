import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [tab, setTab]         = useState('profile');
  const [form, setForm]       = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving]   = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile({ name: form.name, avatar: form.avatar });
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match.'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">My Profile</h1>

      {/* User Card */}
      <div className="card p-5 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-blue' : 'badge-green'} capitalize`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
        {[['profile', 'Profile Info'], ['password', 'Change Password']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleProfile} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (optional)</label>
            <input className="input" placeholder="https://..." value={form.avatar}
              onChange={e => setForm({ ...form, avatar: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="input bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="card p-6 space-y-4">
          {[
            { field: 'currentPassword', label: 'Current Password' },
            { field: 'newPassword',     label: 'New Password' },
            { field: 'confirm',         label: 'Confirm New Password' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="password" className="input" required
                value={pwForm[field]} onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })} />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
