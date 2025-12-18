Este archivo define una instancia centralizada de Axios que encapsula la configuración de comunicación HTTP con el backend, incluyendo manejo de CSRF, refresh automático de tokens y parámetros base de red.

---

## Propósito del archivo

El objetivo principal de este módulo es proporcionar un cliente HTTP único y consistente para toda la aplicación, evitando configuraciones duplicadas y centralizando la lógica transversal relacionada con autenticación y seguridad.

---

## Creación de la instancia Axios

```js
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Explicación

* `baseURL`:

  * Define la URL base para todas las peticiones HTTP.
  * Prioriza la variable de entorno `VITE_API_URL`, lo que permite cambiar el backend según el entorno (desarrollo, staging, producción).
  * Incluye un fallback local para entornos de desarrollo.

* `withCredentials: true`:

  * Habilita el envío automático de cookies en cada petición.
  * Es fundamental para escenarios con autenticación basada en cookies (por ejemplo, Django + CSRF).

* `headers`:

  * Establece el tipo de contenido por defecto como JSON para todas las solicitudes.

---

## Lectura del token CSRF desde cookies

```js
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
```

### Explicación

* Función utilitaria que obtiene el valor de una cookie específica.
* Se utiliza exclusivamente para recuperar el token CSRF (`csrftoken`).
* Evita dependencias externas y mantiene la lógica explícita.

---

## Interceptor de solicitudes (Request Interceptor)

```js
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (
    csrfToken &&
    ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())
  ) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});
```

### Explicación

* Se ejecuta antes de que cualquier request sea enviada al servidor.
* Lógica clave:

  * Solo agrega el header `X-CSRFToken` en métodos considerados peligrosos (POST, PUT, PATCH, DELETE).
  * Evita enviar el token innecesariamente en peticiones GET.

### Beneficios

* Cumple automáticamente con los requerimientos de seguridad CSRF del backend.
* Elimina la necesidad de manejar el token manualmente en cada llamada a la API.

---

## Interceptor de respuestas (Response Interceptor)

```js
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
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Fallo el refresh', refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Explicación general

Este interceptor maneja de forma centralizada los errores de autenticación y el refresh automático de tokens.

### Flujo detallado

1. **Exclusión de la ruta `/login`**

   * Si el usuario está en la pantalla de login, no se intenta ningún refresh.

2. **Detección de error 401 (Unauthorized)**

   * Indica que el token de acceso es inválido o expiró.

3. **Control de reintentos**

   * La bandera `_retry` evita bucles infinitos de refresh.

4. **Refresh del token**

   * Se llama al endpoint `/token/refresh/`.
   * Si el refresh es exitoso, se reintenta automáticamente la petición original.

5. **Manejo de fallo de refresh**

   * Si el refresh falla, el error se propaga para que la aplicación lo gestione (por ejemplo, logout forzado).

---

## Rol dentro de la arquitectura

Este módulo actúa como una **capa de infraestructura**:

* Centraliza la comunicación HTTP.
* Abstrae detalles de autenticación y seguridad.
* Simplifica los servicios, hooks y thunks que consumen la API.

Cualquier parte de la aplicación que importe `api` hereda automáticamente:

* Base URL correcta
* Manejo de cookies
* Protección CSRF
* Refresh automático de sesión

---

## Buenas prácticas aplicadas

* Separación de responsabilidades
* Configuración única y reutilizable
* Seguridad por defecto
* Manejo defensivo de errores

Este enfoque reduce errores, mejora la mantenibilidad y garantiza un comportamiento consistente en toda la aplicación.

---