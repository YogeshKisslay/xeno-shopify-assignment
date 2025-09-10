// client/src/components/dashboard/OrdersChart.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';

const OrdersChart = ({ data, startDate, setStartDate, endDate, setEndDate, isLoading }) => {
  const SkeletonLoader = () => (
    <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse"></div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800">Orders Over Time</h3>
        <div className="flex items-center gap-4 text-sm">
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
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;