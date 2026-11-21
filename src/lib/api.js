import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied to http://localhost:8080/api via next.config.mjs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT Bearer token before every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mhtcet_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;