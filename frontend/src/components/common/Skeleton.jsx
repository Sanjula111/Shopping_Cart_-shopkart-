import React from 'react';

/**
 * Skeleton placeholder card shown while products load
 */
export const ProductSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded-full w-1/3" />
      <div className="h-4 bg-gray-200 rounded-full w-4/5" />
      <div className="h-4 bg-gray-200 rounded-full w-3/5" />
      <div className="h-6 bg-gray-200 rounded-full w-1/2 mt-1" />
      <div className="h-9 bg-gray-200 rounded-xl mt-2" />
    </div>
  </div>
);

/**
 * Grid of skeleton cards
 */
export const ProductSkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

/**
 * Skeleton for a table row
 */
export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded-full animate-pulse" />
      </td>
    ))}
  </tr>
);
