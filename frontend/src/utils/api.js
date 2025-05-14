import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // Esencial para cookies HTTP-only
});

let isRefreshing = false;
let failedRequestsQueue = [];

// Función auxiliar para redirigir y evitar el botón "atrás"
const redirectTo = (path) => window.location.replace(path);

// Interceptor de solicitudes
api.interceptors.request.use((config) => {
  // No se necesita token manualmente con cookies
  return config;
});

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;

    const status = response?.status;

    // Manejo de 401 (No autorizado)
    if (status === 401 && !originalRequest._retry) {
      // Evitar intentar refresh con su propio endpoint
      if (originalRequest.url.includes('/token/')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refresh (cookie incluida automáticamente)
        await api.post('/token/refresh/');

        // Reprocesar las solicitudes en cola
        failedRequestsQueue.forEach(({ resolve }) => resolve());
        failedRequestsQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        // Falló el refresh → limpiar y redirigir
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];

        redirectTo('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Otros errores comunes
    if (response) {
      switch (status) {
        case 400:
          console.error('Error 400: Solicitud incorrecta', response.data);
          break;
        case 403:
          console.error('Error 403: Sin permisos', response.data);
          redirectTo('/unauthorized');
          break;
        case 404:
          console.error('Error 404: Recurso no encontrado', response.data);
          break;
        case 500:
          console.error('Error 500: Error interno del servidor', response.data);
          break;
        default:
          console.error(`Error ${status}:`, response.data);
      }
    } else if (error.request) {
      console.error('Error de red:', error.message);
    } else {
      console.error('Error desconocido:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
