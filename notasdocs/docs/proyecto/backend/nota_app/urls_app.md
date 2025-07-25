# Archivo `urls.py`

### Importaciones

```python
from django.urls import path, include
from rest_framework import routers
from .views import UsuarioView, NotasView, ClientesView, DashboardViewSet
```

- path e include: Son herramientas de Django para definir URLs.
- routers: Proporcionado por DRF para generar rutas automáticamente.
- Las views: Son las clases que manejarán las solicitudes a cada endpoint.

### Configuración del Router

```python
router = routers.DefaultRouter()
router.register(r'usuario', UsuarioView, 'usuario')
router.register(r'nota', NotasView, 'nota')
router.register(r'cliente', ClientesView, 'cliente')
router.register(r'dashboard', DashboardViewSet, 'dashboard')
```

- DefaultRouter(): Crea un router que genera URLs estándar para CRUD.
- router.register(): Asocia una URL con una ViewSet.
    - Primer argumento (r'usuario'): La ruta base.
    - Segundo argumento (UsuarioView): La clase View que manejará las peticiones.
    - Tercer argumento ('usuario'): Nombre base para las URLs generadas.

La r indica que es una "raw string" (cadena cruda). En Python, esto significa que los caracteres de escape (como \n) se tratan literalmente. En este caso no es estrictamente necesario porque las rutas no contienen caracteres especiales, pero es una convención común usarla en patrones de URLs.

### Rutas personalizadas

```python
usuario_extra_routes = [
    path('usuario/actual/', UsuarioView.as_view({'get': 'actual'}), name='usuario-actual'),
    path('usuario/verify-password/', UsuarioView.as_view({'post': 'verify_password'}), name='verify-password'),
    path('usuario/logout/', UsuarioView.as_view({'post': 'logout'}), name='logout'),
]
```

Estas son rutas adicionales para acciones específicas que no son CRUD estándar:

- usuario/actual/: Endpoint GET para obtener el usuario actual
- verify-password/: Endpoint POST para verificar contraseña
- logout/: Endpoint POST para cerrar sesión

### Configuración final de URLs

```python
urlpatterns = [
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('', include(router.urls)),
    *usuario_extra_routes,
]
```

- Llama a una vista basada en clase llamada CSRFTokenView, para entregar el token CSRF al frontend
- include(router.urls): Incluye todas las URLs generadas por el router.
- *usuario_extra_routes: Desempaqueta las rutas personalizadas en la lista.