# Archivo `wsgi.py`

Este archivo configura la interfaz WSGI (Web Server Gateway Interface) para el proyecto Django `notaVentas`.

## Propósito

Permite que Django se comunique con servidores WSGI (como Gunicorn, uWSGI o el servidor de desarrollo de Django). Es fundamental para el **despliegue en producción** de aplicaciones web tradicionales basadas en solicitudes HTTP síncronas.

## Contenido del archivo

```python
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nota_ventas.settings')

application = get_wsgi_application()
```

### Explicación línea por línea

- **from django.core.wsgi import get_wsgi_application**: Importa la función que genera una instancia WSGI lista para ser utilizada por un servidor compatible.

- **os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nota_ventas.settings')**: Define la variable de entorno DJANGO_SETTINGS_MODULE, que Django usa para ubicar la configuración del proyecto. Solo la establece si no está previamente definida.

- **application = get_wsgi_application()**: Crea la instancia WSGI que será utilizada por el servidor para manejar las solicitudes.

### Cuándo modificar este archivo

Normalmente no es necesario modificarlo. Se podría hacer si:

- Usas un sistema de configuración avanzada con múltiples entornos (settings.dev, settings.prod, etc.).
- Necesitas envolver la aplicación con middlewares personalizados en el entorno WSGI.