# <font color=#ff5733>Django Cors Headers</font>

### ¿Qué es?

Es un middleware para Django que permite controlar y configurar las políticas CORS (Cross-Origin Resource Sharing) en el backend. CORS es un mecanismo de seguridad implementado por los navegadores para restringir solicitudes HTTP realizadas desde un origen diferente al dominio del recurso solicitado.

Este middleware permite aceptar solicitudes desde otros dominios (por ejemplo, de una SPA en React alojada en otro servidor) y definir de forma granular qué orígenes, métodos y cabeceras son permitidos.

### ¿Para qué sirve?

La principal función de django-cors-headers es habilitar o restringir el acceso a recursos de la API Django desde orígenes externos. Es indispensable en arquitecturas frontend-backend desacopladas, como:

- React, Vue, Angular consumiendo un backend Django.
- Aplicaciones móviles o microservicios.
- Entornos de desarrollo local con distintos puertos/domínios.

### Instalación y configuración básica

- **Instalación**

```python
pip install django-cors-headers
```

- **Activación en settings.py**

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]
```

*Nota*: CorsMiddleware debe ir antes de CommonMiddleware y antes de cualquier middleware que genere respuesta, como WhiteNoiseMiddleware.

- **Configuraciones comunes**

Permitir todos los orígenes (no recomendado en producción)

```python
CORS_ALLOW_ALL_ORIGINS = True
```
Permitir orígenes específicos

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://frontend.example.com",
]
```

Permitir cookies y cabeceras de autenticación (CORS + credentials)

```python
CORS_ALLOW_CREDENTIALS = True
```

Esto es obligatorio si se usa autenticación vía cookies HTTP-only o cabeceras Authorization con JWT.

### Configuración avanzada

- Permitir cabeceras personalizadas

```python
CORS_ALLOW_HEADERS = list(default_headers) + [
    'X-Custom-Header',
    'Authorization',
]
```

- Permitir métodos adicionales

```python
CORS_ALLOW_METHODS = list(default_methods) + [
    'PATCH',
]
```

- Orígenes regex (útil para entornos dinámicos)

```python
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.example\.com$",
]
```

### Consideraciones de seguridad

- Evitar CORS_ALLOW_ALL_ORIGINS = True en producción, especialmente si CORS_ALLOW_CREDENTIALS = True, ya que puede permitir robo de credenciales o ejecución de acciones CSRF desde sitios externos.
- En producción, siempre se recomienda listar los orígenes exactos en CORS_ALLOWED_ORIGINS.
- Asegurar que el frontend incluya credentials: 'include' en fetch() o Axios si se trabaja con cookies:

```python
axios.get('/api/user', { withCredentials: true })
```

### Comportamiento esperado

Cuando se realiza una solicitud cross-origin, el navegador emite primero una pre-flight request OPTIONS. El middleware de corsheaders:

- Detecta si la cabecera Origin está permitida.
- Devuelve las cabeceras CORS apropiadas:
    - Access-Control-Allow-Origin
    - Access-Control-Allow-Methods
    - Access-Control-Allow-Headers
    - Access-Control-Allow-Credentials (si está habilitado)

Solo si estas cabeceras están correctamente configuradas, el navegador permitirá que el frontend acceda a la respuesta.

### Conclusión

django-cors-headers es un componente esencial en cualquier stack Django expuesto a clientes frontend desacoplados o dominios externos. Ofrece un mecanismo robusto y flexible para configurar políticas CORS conforme a las necesidades de seguridad y funcionalidad del proyecto.

Es indispensable comprender su interacción con cookies, tokens y cabeceras personalizadas, especialmente cuando se trabaja con autenticación basada en JWT o sesiones HTTP-only.