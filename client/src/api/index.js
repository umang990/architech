// client/src/api/index.js
import axios from 'axios';

// Point to local server during development, or deployed URL in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for Auth tokens here if needed later
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call failed:', error);
    return Promise.reject(error);
  }
);

export default api;