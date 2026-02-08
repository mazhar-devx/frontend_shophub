import axios from 'axios';
import { API_URL } from '../utils/constants';

// Create an axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network error = backend not running. Run: npm run dev in backend_shophub-main/backend_shophub-main
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      if (!window.__shopHubApiWarned) {
        window.__shopHubApiWarned = true;
        console.warn('[ShopHub] Backend unreachable. Start it with: npm run dev (in backend folder).');
      }
    }
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
