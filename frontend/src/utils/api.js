import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/token/refresh/')
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/token/refresh/');
        return api(originalRequest); // Reintenta la petición original
      } catch (refreshError) {
        console.error('Fallo el refresh', refreshError);
      }
    }

    return Promise.reject(error);
  }
);
