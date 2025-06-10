# Archivo `asgi.py`

Este archivo configura la interfaz ASGI (Asynchronous Server Gateway Interface) para el proyecto Django llamado `notaVentas`.

## Propósito

Permite que Django se comunique con servidores que soportan ASGI, lo cual es útil para manejar conexiones asíncronas como WebSockets o tareas en tiempo real.

Este archivo es usado principalmente cuando se hace despliegue del proyecto usando servidores ASGI (como Daphne o Uvicorn).

## Contenido del archivo

<pre>
<code>
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pedidosMP.settings')

application = get_asgi_application()
</code>
</pre>

### Explicación línea por línea
**import os**: Importa el módulo os para acceder a variables del entorno del sistema operativo.

**from django.core.asgi import get_asgi_application**: Importa la función que crea una instancia de la aplicación ASGI a partir de la configuración del proyecto Django.

**os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pedidosMP.settings')**: Define la variable de entorno que Django necesita para encontrar el archivo settings.py del proyecto. Si ya está definida, no la sobrescribe.

**application = get_asgi_application()**: Crea una instancia de la aplicación ASGI que será utilizada por el servidor ASGI para comunicarse con Django.