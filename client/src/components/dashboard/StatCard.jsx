
import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, isLoading, animationVariants, color }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (title.toLowerCase().includes('revenue')) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency', currency: 'INR', minimumFractionDigits: 0,
        }).format(val);
      }
      return new Intl.NumberFormat('en-IN').format(val);
    }
    return val;
  };

  return (
    <motion.div
      variants={animationVariants}
      className="p-6 overflow-hidden text-white transition-all duration-300 ease-in-out transform rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2"
      style={{ background: `linear-gradient(135deg, ${color[0]} 0%, ${color[1]} 100%)` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-lg font-medium text-white/80">{title}</p>
          <div className="mt-1 text-4xl font-bold">
            {isLoading ? (
              <div className="w-24 h-10 mt-1 bg-white/30 rounded-md animate-pulse"></div>
            ) : (
              formatValue(value)
            )}
          </div>
        </div>
        <div className="text-white/50">{icon}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;