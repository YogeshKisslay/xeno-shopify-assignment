
import axios from 'axios';

// Create a new Axios instance
const axiosInstance = axios.create({
  // This is the key part:
  // In development, VITE_API_BASE_URL will be undefined, so the baseURL will be an empty string.
  // This makes all requests relative (e.g., '/api/auth/login'), which is perfect for our Vite proxy.
  // In production, we will set this environment variable to our live backend URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

export default axiosInstance;