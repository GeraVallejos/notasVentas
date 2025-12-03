# Archivo `auth_urls.py`

Este módulo define las rutas necesarias para obtener y refrescar tokens JWT utilizando cookies, a través de vistas personalizadas que extienden `TokenObtainPairView` y `TokenRefreshView` de `SimpleJWT`.

### Importaciones

```python
from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView
```

- `django.urls.path`: Función utilizada para declarar rutas URL en Django.
- `CookieTokenObtainPairView`: Vista personalizada para obtener un par de tokens (access y refresh) e incluirlos en cookies.
- `CookieTokenRefreshView`: Vista personalizada para refrescar el token de acceso utilizando el token de refresco almacenado en una cookie.

---

### Lista de rutas (`urlpatterns`)

```python
urlpatterns = [
    path('', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
]
```

#### Rutas definidas:

1. **`''` (raíz del módulo de autenticación)**  
    - **Vista:** `CookieTokenObtainPairView.as_view()`  
    - **Nombre:** `token_obtain_pair`  
    - **Descripción:** Endpoint para autenticación. Recibe credenciales, emite tokens y los establece como cookies en la respuesta.

2. **`refresh/`**  
    - **Vista:** `CookieTokenRefreshView.as_view()`  
    - **Nombre:** `token_refresh`  
    - **Descripción:** Endpoint para renovar el token de acceso usando el token de refresco presente en las cookies del navegador.

---

Este módulo es comúnmente usado como parte de una implementación de autenticación JWT basada en cookies, segura frente a ataques de XSS y CSRF cuando se configura adecuadamente.

---
