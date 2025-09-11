
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

import StatCard from '../components/dashboard/StatCard';
import TopCustomersList from '../components/dashboard/TopCustomersList';
import OrdersChart from '../components/dashboard/OrdersChart';

const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-4-6h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const DashboardPage = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Don't set isLoading to true here to prevent a full-screen loader on every poll
      setError('');
      try {
        const [kpisResponse, customersResponse, chartResponse] = await Promise.all([
          api.get('/api/insights/kpis'),
          api.get('/api/insights/top-customers'),
          api.get(`/api/insights/orders-over-time?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        ]);
        
        setKpis(kpisResponse.data);
        setTopCustomers(customersResponse.data);
        setChartData(chartResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        // Only set the initial loading to false once
        if(isLoading) setIsLoading(false);
      }
    };

    fetchData(); // Fetch immediately on load

    const intervalId = setInterval(fetchData, 15000); // Poll every 15 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [startDate, endDate]); // Dependency array to refetch on date change

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {user?.name || 'User'}! Here's a snapshot of your store's performance.
        </p>
      </div>

      {error && <p className="p-4 mt-6 text-red-700 bg-red-100 rounded-md">{error}</p>}
      
      <motion.div
        className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 xl:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard title="Total Revenue" value={kpis?.totalRevenue} icon={<RevenueIcon />} isLoading={isLoading} animationVariants={itemVariants} color={['#6366F1', '#818CF8']} />
        <StatCard title="Total Orders" value={kpis?.totalOrders} icon={<OrdersIcon />} isLoading={isLoading} animationVariants={itemVariants} color={['#3B82F6', '#60A5FA']} />
        <StatCard title="Total Customers" value={kpis?.totalCustomers} icon={<CustomersIcon />} isLoading={isLoading} animationVariants={itemVariants} color={['#10B981', '#34D399']} />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div className="lg:col-span-2">
          <OrdersChart data={chartData} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} isLoading={isLoading} animationVariants={itemVariants} />
        </div>
        <div className="lg:col-span-1">
          <TopCustomersList customers={topCustomers} isLoading={isLoading} animationVariants={itemVariants} />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;