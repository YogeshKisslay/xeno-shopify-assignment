// client/src/components/dashboard/StatCard.jsx

import React from 'react';

const StatCard = ({ title, value, icon, isLoading }) => {
  const formatValue = (val) => {
    if (isLoading) {
      return <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>;
    }
    if (typeof val === 'number') {
      // Check if it's a currency value
      if (title.toLowerCase().includes('revenue')) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
        }).format(val);
      }
      return new Intl.NumberFormat('en-IN').format(val);
    }
    return val;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 text-white bg-indigo-500 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;