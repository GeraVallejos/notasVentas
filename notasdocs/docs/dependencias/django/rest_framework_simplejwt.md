# <font color=#ff5733>Rest Framework SimpleJWT</font>

### ¿Qué es?

Es una librería que implementa autenticación mediante JWT (JSON Web Tokens) para Django REST Framework (DRF). Proporciona endpoints y clases de autenticación para manejar el ciclo completo de autenticación basada en tokens stateless, incluyendo:

- Generación de tokens (access, refresh)
- Renovación de tokens
- Revocación y verificación de tokens
- Custom claims y políticas de expiración

### ¿Para qué sirve?

Sirve para autenticación sin sesión (stateless) en aplicaciones SPA (React, Vue, etc.), móviles o microservicios, permitiendo:

- Login seguro con JWT
- Renovación de sesión sin pedir credenciales
- Escalabilidad: no depende de cookies ni sesiones en servidor
- Protección de endpoints vía DRF

### ¿Cómo se configura?

- **Instalación**

```python
pip install djangorestframework-simplejwt
```

Y agregar a INSTALLED_APPS en settings.py.

- **Configuración en settings.py**

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

Opcionalmente, puedes definir ajustes de tokens:

```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

- **Endpoints disponibles**

Importa los endpoints en tu archivo urls.py:

```python
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),       # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      # Refrescar token
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),         # Verificar validez
]
```

1. **Login (`/api/token/`)**  
    - Se envían credenciales.  
    - Devuelve: `access` y `refresh`.  

2. **Uso de access token**  
        - Cabecera: `Authorization: Bearer <access_token>`  

3. **Renovación (`/api/token/refresh/`)**  
    - Se envía el `refresh_token`.  
    - Devuelve nuevo `access_token`.  

4. **Verificación (`/api/token/verify/`)**  
    - Útil para depurar o verificar tokens manualmente.  

### Personalización

- **Custom Token Claims**

Puedes sobrescribir TokenObtainPairSerializer para incluir información adicional:

```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff
        return data
```
Y luego enlazarlo a una view personalizada:

```python
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
```

- **Blacklisting tokens**

Para invalidar tokens después del logout o rotación:

```python
pip install djangorestframework-simplejwt[blacklist]
```

Agregar 'rest_framework_simplejwt.token_blacklist' a INSTALLED_APPS.

En SIMPLE_JWT, activar:

```python
'BLACKLIST_AFTER_ROTATION': True,
```
Usar el endpoint para logout implementando manualmente el blacklist.

### Buenas prácticas y tips

- Usar rotación de tokens (ROTATE_REFRESH_TOKENS = True) + blacklist para mayor seguridad.
- No guardar tokens en localStorage (riesgo XSS); usar httpOnly cookies si se manejan tokens en frontend.
- Si el frontend es React/Vue y backend Django, usar CORS y withCredentials con cookies para máxima seguridad.
- Proteger rutas con decoradores o permisos en DRF:

```python
from rest_framework.permissions import IsAuthenticated

class MySecureView(APIView):
    permission_classes = [IsAuthenticated]
    ...
```

- Limitar el acceso con custom permissions basados en roles/grupos.

### Conclusión

rest_framework_simplejwt ofrece una solución robusta y flexible para autenticación basada en JWT dentro de Django REST Framework. Ideal para arquitecturas modernas donde el backend es un proveedor de API y el frontend se comunica vía tokens.

Su integración es rápida, segura y escalable, y permite múltiples niveles de personalización según las necesidades del proyecto.




