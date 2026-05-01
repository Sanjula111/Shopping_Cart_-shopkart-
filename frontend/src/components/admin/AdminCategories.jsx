import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { PageLoader } from '../common/Loader';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', image: '', isActive: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);

  const load = () => {
    setLoading(true);
    categoryAPI.getAll()
      .then(r => setCategories(r.data.categories))
      .catch(() => toast.error('Failed to load.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (c) => { setEditing(c._id); setForm({ name: c.name, description: c.description || '', image: c.image || '', isActive: c.isActive }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await categoryAPI.update(editing, form);
      else         await categoryAPI.create(form);
      toast.success(editing ? 'Category updated!' : 'Category created!');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryAPI.remove(id);
      toast.success('Category deleted.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Category</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="card p-4 flex gap-4 items-start">
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">🏷</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                <span className={`badge ${cat.isActive ? 'badge-green' : 'badge-red'} text-xs`}>
                  {cat.isActive ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(cat)}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(cat._id)}
                  className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <input className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Image URL</label>
                <input className="input" placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <select className="input" value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
