
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import api from '../api/axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         try {
//           const response = await api.get('/api/auth/me');
//           setUser(response.data);
//         } catch (error) {
//           console.error('Failed to fetch user with token:', error);
//           setToken(null);
//           localStorage.removeItem('token');
//         }
//       }
//       setLoading(false);
//     };

//     fetchUser();
//   }, [token]);

//   const login = async (email, password) => {
//     const response = await api.post('/api/auth/login', { email, password });
//     localStorage.setItem('token', response.data.token);
//     setToken(response.data.token);
//     setUser(response.data.user);
//     return response.data;
//   };

//   const register = async (name, email, password) => {
//     const response = await api.post('/api/auth/register', { name, email, password });
//     return response.data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete api.defaults.headers.common['Authorization'];
//   };

//   const value = {
//     token, user, loading, login, register, logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };


// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  // --- NEW: State to track if the initial data sync is complete ---
  const [hasIngested, setHasIngested] = useState(false);
  const [loading, setLoading] = useState(true); // Manages initial app load

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // The /me endpoint now returns the user AND the ingestion status
          const { data } = await api.get('/api/auth/me');
          setUser(data.user);
          setHasIngested(data.hasIngested);
        } catch (error) {
          console.error('Failed to fetch user with token:', error);
          // If the token is invalid, log the user out completely
          setToken(null);
          setUser(null);
          setHasIngested(false);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    // --- NEW: Update ingestion status on login ---
    setHasIngested(response.data.hasIngested);
    return response.data;
  };

  const register = async (name, email, password) => {
    return await api.post('/api/auth/register', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setHasIngested(false);
    delete api.defaults.headers.common['Authorization'];
  };

  // Provide the new state and setter to the whole app
  const value = { token, user, loading, hasIngested, setHasIngested, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};