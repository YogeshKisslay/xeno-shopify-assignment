
import React from 'react';
import { motion } from 'framer-motion';

const TopCustomersList = ({ customers, isLoading, animationVariants }) => {
  const SkeletonLoader = () => (
    <li className="py-3 animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
                <div className="w-3/5 h-4 bg-gray-200 rounded"></div>
            </div>
             <div className="w-1/5 h-4 bg-gray-200 rounded"></div>
        </div>
    </li>
  );

  return (
    <motion.div variants={animationVariants} className="p-6 bg-white/50 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800">Top Customers</h3>
      <div className="mt-4 flow-root">
        <ul className="-my-5 divide-y divide-gray-200/50">
          {isLoading
            ? Array(5).fill(0).map((_, index) => <SkeletonLoader key={index} />)
            : customers?.map((customer, index) => (
                <motion.li
                  key={index}
                  className="py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 font-bold text-indigo-700 bg-indigo-100 rounded-full">
                        {customer.firstName ? customer.firstName.charAt(0) : ''}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{customer.firstName} {customer.lastName}</p>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency', currency: 'INR', minimumFractionDigits: 0,
                      }).format(customer.totalSpent)}
                    </div>
                  </div>
                </motion.li>
              ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TopCustomersList;