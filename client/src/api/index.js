import axios from 'axios';

// Point to local server during development
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // CRITICAL: This allows the browser to send the HttpOnly cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;