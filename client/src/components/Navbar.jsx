

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Reusable JSX Components ---
  const UserAvatar = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Your Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const AuthLinks = () => (
    <div className="flex items-center gap-4">
      <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-500">
        Sign In
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            XenoInsights
          </Link>
          <div>{user ? <UserAvatar /> : <AuthLinks />}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;