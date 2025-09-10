// client/src/components/dashboard/TopCustomersList.jsx

import React from 'react';

const TopCustomersList = ({ customers, isLoading }) => {
  const SkeletonLoader = () => (
    <div className="flex items-center justify-between py-3 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="w-20 h-4 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Top 5 Customers by Spend</h3>
      <div className="mt-4">
        {isLoading
          ? Array(5).fill(0).map((_, index) => <SkeletonLoader key={index} />)
          : customers?.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-indigo-500 rounded-full">
                    {customer.firstName ? customer.firstName.charAt(0) : ''}
                  </div>
                  <p className="font-medium text-gray-700">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                  }).format(customer.totalSpent)}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TopCustomersList;