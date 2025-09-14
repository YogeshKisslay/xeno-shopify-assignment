

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

import StatCard from '../components/dashboard/StatCard';
import TopCustomersList from '../components/dashboard/TopCustomersList';
import OrdersChart from '../components/dashboard/OrdersChart';

// This is a new component for the "syncing data" screen
const IngestionLoader = ({ error }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-xl w-full max-w-lg">
            {error ? (
                <>
                    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Syncing Failed</h2>
                    <p className="mt-2 text-gray-600">We couldn't connect to your Shopify store. Please ensure your credentials in the backend are correct and try refreshing the page.</p>
                    <p className="mt-1 text-xs text-gray-400">{error}</p>
                </>
            ) : (
                <>
                    <svg className="w-16 h-16 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Syncing Your Store Data</h2>
                    <p className="mt-2 text-gray-600">This is a one-time process and may take a few moments. We're pulling in all your historical data. Please don't close this window.</p>
                </>
            )}
        </div>
    </div>
);

// --- SVG Icons ---
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-4-6h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


const DashboardPage = () => {
    const { user, hasIngested, setHasIngested } = useAuth();
    const [isSyncing, setIsSyncing] = useState(!hasIngested);
    const [syncError, setSyncError] = useState('');
    
    // State for the dashboard data itself
    const [kpis, setKpis] = useState(null);
    const [topCustomers, setTopCustomers] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());

    // Effect to run the one-time initial ingestion
    useEffect(() => {
        const runInitialIngestion = async () => {
            if (!hasIngested) {
                console.log('Initial ingestion not complete. Starting sync...');
                setIsSyncing(true);
                setSyncError('');
                try {
                    await api.post('/api/ingestion/start');
                    setHasIngested(true); // Update the global state
                    setIsSyncing(false);
                    console.log('Sync complete!');
                } catch (error) {
                    console.error("Ingestion failed:", error);
                    setSyncError(error.response?.data?.message || 'An unknown error occurred during sync.');
                }
            }
        };
        runInitialIngestion();
    }, [hasIngested, setHasIngested]);

    // Effect to fetch dashboard data (KPIs, charts, etc.)
    useEffect(() => {
        const fetchData = async () => {
            if (hasIngested && !isSyncing) {
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
                    console.error("Failed to fetch dashboard data", err);
                }
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 15000);
        return () => clearInterval(intervalId);
    }, [hasIngested, isSyncing, startDate, endDate]);

    // Conditional Rendering: Show loader or dashboard
    if (isSyncing) {
        return <div className="container p-4 mx-auto max-w-7xl sm:p-8"><IngestionLoader error={syncError} /></div>;
    }

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
            
            <motion.div
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 xl:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <StatCard title="Total Revenue" value={kpis?.totalRevenue} icon={<RevenueIcon />} isLoading={!kpis} animationVariants={itemVariants} color={['#6366F1', '#818CF8']} />
                <StatCard title="Total Orders" value={kpis?.totalOrders} icon={<OrdersIcon />} isLoading={!kpis} animationVariants={itemVariants} color={['#3B82F6', '#60A5FA']} />
                <StatCard title="Total Customers" value={kpis?.totalCustomers} icon={<CustomersIcon />} isLoading={!kpis} animationVariants={itemVariants} color={['#10B981', '#34D399']} />
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
            >
                <div className="lg:col-span-2">
                    <OrdersChart 
                        data={chartData}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        isLoading={!kpis}
                        animationVariants={itemVariants}
                    />
                </div>
                <div className="lg:col-span-1">
                    <TopCustomersList customers={topCustomers} isLoading={!kpis} animationVariants={itemVariants} />
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;