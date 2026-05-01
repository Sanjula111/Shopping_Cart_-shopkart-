import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable search bar — navigates to /products?search=query
 * or calls onSearch(query) prop if provided
 */
const SearchBar = ({ onSearch, placeholder = 'Search products...', className = '' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query.trim());
    } else {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input pl-9"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="btn-primary px-5">Search</button>
    </form>
  );
};

export default SearchBar;
