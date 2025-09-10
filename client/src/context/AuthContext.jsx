// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // <-- CHANGE THIS LINE

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Use our instance
        try {
          const response = await api.get('/api/auth/me'); // Use our instance
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user with token:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password }); // Use our instance
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password }); // Use our instance
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization']; // Use our instance
  };

  const value = {
    token, user, loading, login, register, logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};