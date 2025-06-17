# <font color=#ff5733>Axes</font>

### ¿Qué es?

Axes (Authentication Extension for Django) es una librería de seguridad diseñada para proteger las aplicaciones Django contra ataques de fuerza bruta y repetidos intentos de login fallidos. Funciona monitoreando las credenciales ingresadas en el sistema de autenticación y bloqueando direcciones IP, usuarios o combinaciones según una política configurable.

Su arquitectura está basada en el middleware de Django y señales del sistema de autenticación, lo que permite integrarse sin modificar el flujo normal de django.contrib.auth.

### ¿Para qué sirve?

Proporciona mecanismos para:

- Bloquear intentos de autenticación después de un número configurable de fallos consecutivos.
- Mitigar ataques de fuerza bruta por IP, usuario o combinación.
- Registrar eventos de login para auditoría y trazabilidad.
- Implementar listas negras y blancas.
- Proteger formularios de login personalizados o la vista por defecto de Django.

### Instalación y configuración

- **Instalación**

```python
pip install django-axes
```

- ** Configuración en settings.py**

```python
INSTALLED_APPS = [
    ...
    'axes',
]

MIDDLEWARE = [
    'axes.middleware.AxesMiddleware',
    ...
]

AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesBackend',
    'django.contrib.auth.backends.ModelBackend',
]
```

- **Migraciones**

```python
python manage.py migrate
```

Esto crea el modelo axes.AccessAttempt, que almacena información de cada intento de autenticación.

### Configuración avanzada

Las políticas de bloqueo pueden ser controladas mediante los siguientes parámetros en settings.py:

**Número de intentos permitidos**

```python
AXES_FAILURE_LIMIT = 5
```

**Tiempo de bloqueo**

```python
AXES_COOLOFF_TIME = timedelta(minutes=30)
```
**Bloqueo por IP, usuario o ambos**

```python
AXES_ONLY_USER_FAILURES = False      # Bloquea por IP + usuario
AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP = True
```

**Notificación y logging**

```python
AXES_VERBOSE = True
```
**Reset manual de intentos**

Desde el shell o un endpoint:

```python
from axes.utils import reset

reset(ip='192.168.0.1')
reset(username='admin')
```
### Mecanismo de detección

django-axes se engancha mediante:
- Middleware: intercepta cada request y revisa el estado de bloqueo.
- Backend personalizado: extiende el backend de autenticación para incrementar el contador de fallos si las credenciales son inválidas.
- Modelo AccessAttempt: registra cada intento fallido, incluyendo metadatos como IP, user-agent, timestamp y método.

### Auditoría

La tabla axes_accessattempt permite almacenar y consultar:
- IP del atacante
- Fecha/hora del intento
- Nombre de usuario (si fue ingresado)
- Número de fallos acumulados

Ideal para trazabilidad, dashboards de seguridad o alertas personalizadas.

### Integración con vistas personalizadas

Axes se integra automáticamente con la vista LoginView de Django. Para formularios personalizados, basta con usar el sistema de autenticación estándar (authenticate(), login()).

Opcionalmente, se puede deshabilitar temporalmente en ciertas vistas con un decorador:

```python
from axes.decorators import axes_dispatch

@axes_dispatch
def custom_login_view(request):
    ...
```

### Extensibilidad

Signal de bloqueo:

```python
from axes.signals import user_locked_out

@receiver(user_locked_out)
def on_lockout(sender, request, username, **kwargs):
    # Notificar a admin, registrar log, etc.
```

### Buenas prácticas

- Usar AXES_COOLOFF_TIME para evitar bloqueos permanentes accidentales.
- Configurar AXES_LOCKOUT_TEMPLATE para mostrar una página personalizada de bloqueo.
- Registrar alertas vía logging o email cuando un usuario es bloqueado.
- Si se usan proxies o balancers, definir AXES_PROXY_ORDER y AXES_META_PRECEDENCE_ORDER para obtener la IP real del atacante.
- Combinar con django-ratelimit para protección más fina a nivel de request.

### Conclusión

django-axes proporciona una capa crítica de defensa contra intentos de fuerza bruta en aplicaciones Django, con una implementación sólida y altamente configurable. Su integración es sencilla, no invasiva, y ofrece herramientas tanto para prevenir accesos maliciosos como para auditar intentos de login fallidos. Es una solución recomendada para cualquier sistema con autenticación expuesta públicamente.