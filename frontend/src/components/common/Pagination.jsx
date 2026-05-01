import React from 'react';

/**
 * Pagination component
 * Props: currentPage, totalPages, onPageChange
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 1; // pages to show around current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-primary-600 text-white shadow-sm'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
