import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { PageLoader } from '../common/Loader';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = () => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data.users))
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserStatus(id);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{users.length} registered users</p>
        </div>
      </div>

      <div className="mb-4">
        <input className="input max-w-xs" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.role === 'admin' ? 'badge-blue' : 'badge-green'} capitalize`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'admin' && (
                      <button onClick={() => toggleStatus(user._id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          user.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
