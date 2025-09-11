
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import { motion } from 'framer-motion';

const OrdersChart = ({ data, startDate, setStartDate, endDate, setEndDate, isLoading, animationVariants }) => {
  const SkeletonLoader = () => <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse"></div>;

  return (
    <motion.div variants={animationVariants} className="p-6 bg-white/50 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-lg">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-xl font-bold text-gray-800">Orders Over Time</h3>
        <div className="flex items-center gap-2 text-sm sm:gap-4">
          <div>
            <span className="mr-2 text-gray-600">From:</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-32 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <span className="mr-2 text-gray-600">To:</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-32 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mt-6" style={{ width: '100%', height: 300 }}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis allowDecimals={false} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} name="Orders" dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default OrdersChart;