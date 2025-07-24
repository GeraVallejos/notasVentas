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

- **from whitenoise import WhiteNoise**: Integra WhiteNoise, una herramienta que permite a Django servir archivos estáticos directamente en producción, sin depender de servidores externos como Nginx.

- **from django.core.wsgi import get_wsgi_application**: Importa la función que genera una instancia WSGI lista para ser utilizada por un servidor compatible.

- **os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nota_ventas.settings')**: Define la variable de entorno DJANGO_SETTINGS_MODULE, que Django usa para ubicar la configuración del proyecto. Solo la establece si no está previamente definida.

- **application = get_wsgi_application()**: Crea la instancia WSGI que será utilizada por el servidor para manejar las solicitudes.

- **STATIC_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'staticfiles')**: Define la ruta absoluta a la carpeta staticfiles, donde Django recopila todos los archivos estáticos después de ejecutar collectstatic. En este caso, calcula la ruta tomando dos niveles arriba desde el archivo actual. Esto es necesario para que el admin de django en produccion se vea con el css.

- **application = WhiteNoise(application, root=STATIC_ROOT)**: Envuelve la aplicación Django con WhiteNoise. Esto le permite a Django servir archivos estáticos desde STATIC_ROOT directamente, sin necesidad de un servidor web adicional. Recomendado especialmente para plataformas como Railway, que no ofrecen Nginx por defecto.


### Cuándo modificar este archivo

Normalmente no es necesario modificarlo. Se podría hacer si:

- Usas un sistema de configuración avanzada con múltiples entornos (settings.dev, settings.prod, etc.).
- Necesitas envolver la aplicación con middlewares personalizados en el entorno WSGI.