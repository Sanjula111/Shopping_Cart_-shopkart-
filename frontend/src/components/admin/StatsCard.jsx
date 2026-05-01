import React from 'react';

/**
 * Stat card used in Admin Dashboard
 * Props: icon, label, value, subValue, color, trend
 */
const StatsCard = ({ icon, label, value, subValue, color = 'bg-blue-50', trend }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-xl flex-shrink-0`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
  </div>
);

export default StatsCard;
