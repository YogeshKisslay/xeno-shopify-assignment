

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/'); // Go to landing page on logout
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Link goes to dashboard if logged in, else landing page */}
            <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600">
              XenoInsights
            </Link>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 text-sm text-gray-700 border-b"><p className="font-semibold">Signed in as</p><p className="truncate">{user.email}</p></div>
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
                 <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-500">Sign In</Link>
                    <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">Sign Up</Link>
                </div>
            )}
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;