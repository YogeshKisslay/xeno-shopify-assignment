// client/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; // Use our configured axios instance

// Import the new components
import StatCard from '../components/dashboard/StatCard';
import TopCustomersList from '../components/dashboard/TopCustomersList';
import OrdersChart from '../components/dashboard/OrdersChart';

// Simple SVG icons for the StatCards
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-4-6h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;


const DashboardPage = () => {
  const { user } = useAuth();
  // State for KPIs and Top Customers
  const [kpis, setKpis] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  
  // NEW: State for the chart
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to 30 days ago
    return date;
  });
  const [endDate, setEndDate] = useState(new Date()); // Default to today

  // General loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Combined data fetching hook
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch all data in parallel for better performance
        const [kpisResponse, customersResponse, chartResponse] = await Promise.all([
          api.get('/api/insights/kpis'),
          api.get('/api/insights/top-customers'),
          api.get(`/api/insights/orders-over-time?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        ]);
        
        setKpis(kpisResponse.data);
        setTopCustomers(customersResponse.data);
        setChartData(chartResponse.data);

      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]); // IMPORTANT: Refetch data whenever the date range changes


  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container px-4 py-10 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's a snapshot of your Shopify store's performance.
        </p>

        {error && <p className="p-4 mt-6 text-red-700 bg-red-100 rounded-md">{error}</p>}
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Revenue" value={kpis?.totalRevenue} icon={<RevenueIcon />} isLoading={isLoading} />
          <StatCard title="Total Orders" value={kpis?.totalOrders} icon={<OrdersIcon />} isLoading={isLoading} />
          <StatCard title="Total Customers" value={kpis?.totalCustomers} icon={<CustomersIcon />} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrdersChart 
              data={chartData}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <TopCustomersList customers={topCustomers} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;