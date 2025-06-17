# <font color=#ff5733>Django Rest Framework</font>

### ¿Qué es?

Django REST Framework (DRF) es una poderosa biblioteca de Python construida sobre Django, que permite crear APIs RESTful de manera sencilla, robusta y escalable. DRF abstrae y automatiza gran parte del trabajo necesario para exponer datos desde una base de datos Django a través de una API.

Características clave:
- Soporte completo para serialización de modelos Django.
- Soporte para autenticación (token, session, JWT, OAuth).
- Manejo integrado de permisos y validaciones.
- Documentación automática de la API (browsable API).
- Soporte para paginación, filtros, búsquedas y ordenamientos.

### ¿Para qué sirve?

DRF se usa para:

| Función | Ejemplo |
|---------|---------|
| Exponer datos como API |	Mostrar datos de usuarios, productos, pedidos, etc.
| Crear endpoints CRUD | Crear, leer, actualizar y eliminar recursos REST
| Aplicaciones frontend	| Servir datos a aplicaciones React, Vue, Angular, móviles, etc.
| Autenticación de usuarios	| Login, logout, permisos basados en roles
| Integración externa | Comunicar tu sistema con otras APIs o servicios

### ¿Cómo se usa?

- **Instalación**

```python
pip install djangorestframework
```

Luego agregar 'rest_framework' en INSTALLED_APPS en settings.py.

- **Configuración básica**

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}
```

- **Serializers**

Permiten convertir modelos Django en JSON y viceversa.

```python
from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
```

- **Views**

Se puede usar APIView o vistas basadas en clases genéricas.

```python
from rest_framework import generics
from .models import Producto
from .serializers import ProductoSerializer

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
```

- **URLs**

```python
from django.urls import path
from .views import ProductoListCreateView

urlpatterns = [
    path('productos/', ProductoListCreateView.as_view(), name='producto-list-create'),
]
```

- **Browsable API**

DRF genera una interfaz visual para probar tus endpoints desde el navegador. Solo asegúrate de incluir:

```python
from django.urls import path, include

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
]
```

### Tips prácticos

- **Usar ViewSets + Routers si se quiere generar automáticamente todas las rutas CRUD:**

```python
from rest_framework import viewsets, routers

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

router = routers.DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

- **Autenticación moderna con JWT**

Agregar djangorestframework-simplejwt para manejar autenticación JWT:

```python
pip install djangorestframework-simplejwt
```
Y configurar:

```python
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] += [
    'rest_framework_simplejwt.authentication.JWTAuthentication',
]
```

- **Crear permisos personalizados**

```python
from rest_framework.permissions import BasePermission

class EsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff
```

- **Usar @action para endpoints personalizados**

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductoViewSet(viewsets.ModelViewSet):
    ...

    @action(detail=True, methods=['post'])
    def destacar(self, request, pk=None):
        producto = self.get_object()
        producto.destacado = True
        producto.save()
        return Response({'status': 'producto destacado'})
```

### Conclusión

Django REST Framework es una herramienta esencial si estás construyendo APIs modernas con Django. Te permite mantener una arquitectura limpia, segura y escalable, reduciendo el tiempo de desarrollo y mejorando la mantenibilidad del proyecto.
