import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('api-connection-restored'));
    }
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      // Check if it's a network error (no response)
      if (!error.response && error.code !== 'ERR_CANCELED') {
        window.dispatchEvent(new Event('api-connection-lost'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
