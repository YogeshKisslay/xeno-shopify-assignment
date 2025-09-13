// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

// New Components
import Layout from './components/Layout';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

import ProfilePage from './pages/ProfilePage';

// This special component allows us to use hooks like useLocation
const AppContent = () => {
    const location = useLocation();
    
    const ProtectedRoute = () => {
      const { token, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      // --- FIX: Redirect to the public landing page if not logged in ---
      return token ? <Outlet /> : <Navigate to="/" />;
    };

    return (
        <>
            {/* The main page routes */}
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    {/* --- THE MAIN FIX IS HERE --- */}
                    {/* This tells the router to show the LandingPage for all these paths */}
                    <Route index element={<LandingPage />} />
                    <Route path="login" element={<LandingPage />} />
                    <Route path="register" element={<LandingPage />} />
                    
                    {/* All routes inside here are protected */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Route>

           
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
            {/* This renders the modals on top of the current page */}
            <AnimatePresence>
                {location.pathname === '/login' && <LoginModal />}
                {location.pathname === '/register' && <RegisterModal />}
            </AnimatePresence>
        </>
    );
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
      <AppContent />
    </Router>
  );
}

export default App;

