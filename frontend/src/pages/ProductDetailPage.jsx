import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { PageLoader } from '../components/common/Loader';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [adding, setAdding]   = useState(false);

  useEffect(() => {
    productAPI.getOne(id)
      .then(r => setProduct(r.data.product))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product._id, qty);
    setAdding(false);
  };

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Product not found.</p>
      <Link to="/products" className="btn-primary mt-4 inline-block">← Back to Products</Link>
    </div>
  );

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
          <img src={product.image} alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm text-primary-600 font-semibold uppercase tracking-wide">
            {product.category?.name}
          </span>
          <h1 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-gray-500 text-sm">per {product.unit}</span>
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 ${
            product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Quantity + Add */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm font-bold text-gray-700 hover:bg-gray-50">
                  −
                </button>
                <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm font-bold text-gray-700 hover:bg-gray-50">
                  +
                </button>
              </div>
              <button onClick={handleAdd} disabled={adding}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                {adding
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
                  : <><span>🛒</span> Add to Cart</>
                }
              </button>
            </div>
          )}

          {/* Meta info */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
            <p>Category: <span className="text-gray-700 font-medium">{product.category?.name}</span></p>
            <p>Unit: <span className="text-gray-700 font-medium">{product.unit}</span></p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.tags.map(tag => (
                  <span key={tag} className="badge badge-green">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
