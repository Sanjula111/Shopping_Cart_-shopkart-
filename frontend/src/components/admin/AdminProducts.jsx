import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { PageLoader } from '../common/Loader';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', originalPrice: '', image: '', category: '', stock: '', unit: 'piece', isActive: true };

const AdminProducts = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [search, setSearch]         = useState('');

  const load = async () => {
    try {
      const [pr, cr] = await Promise.all([productAPI.getAdminAll(), categoryAPI.getAll()]);
      setProducts(pr.data.products);
      setCategories(cr.data.categories);
    } catch { toast.error('Failed to load.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit   = (p)  => { setEditing(p._id); setForm({ ...p, category: p.category?._id || p.category, originalPrice: p.originalPrice || '' }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), originalPrice: form.originalPrice ? Number(form.originalPrice) : null };
      if (editing) await productAPI.update(editing, payload);
      else         await productAPI.create(payload);
      toast.success(editing ? 'Product updated!' : 'Product created!');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.remove(id);
      toast.success('Product deleted.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Product</button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input className="input max-w-xs" placeholder="Search products..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 line-clamp-1 max-w-[150px]">{p.name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">₹{p.price}</p>
                    {p.originalPrice > p.price && <p className="text-xs text-gray-400 line-through">₹{p.originalPrice}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No products found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
                  <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Price (₹) *</label>
                  <input type="number" className="input" required min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Original Price (₹)</label>
                  <input type="number" className="input" min="0" placeholder="For discount display" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
                  <select className="input" required value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label>
                  <input type="number" className="input" required min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Unit</label>
                  <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    {['piece','kg','g','dozen','pack','box','bunch','liter'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                  <select className="input" value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Image URL *</label>
                  <input className="input" required placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                  {form.image && (
                    <img src={form.image} alt="preview" className="w-16 h-16 rounded-lg object-cover mt-2"
                      onError={(e) => { e.target.style.display='none'; }} />
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                  <textarea className="input resize-none" rows={3} required value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
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

export default AdminProducts;
