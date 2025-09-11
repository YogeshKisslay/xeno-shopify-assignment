
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return token ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoute = () => {
    const { token, loading } = useAuth();
    if(loading) return <div>Loading...</div>;
    return token ? <Navigate to="/" /> : <Outlet />;
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
      <Routes>
        {/* Public Routes - No Layout, redirect if logged in */}
        <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        
        {/* Protected Routes - All nested inside the Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;