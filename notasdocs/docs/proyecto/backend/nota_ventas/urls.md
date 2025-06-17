# Archivo `urls.py`

Este archivo define la configuración principal de rutas (`URLs`) del proyecto Django `nota_app`. Se encarga de conectar las rutas entrantes con las vistas correspondientes.

## Contenido del archivo

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Autenticación 
    path('api/v1/token/', include('nota_app.auth_urls')),
    
    # Version de API
    path('api/v1/', include('nota_app.urls')),
]
```

### Explicación

- **from django.contrib import admin**: Importa la vista de administración de Django.

- **from django.urls import path, include**: Importa funciones para definir rutas (path) y para incluir configuraciones de URL de otras aplicaciones (include).


#### Lista de urlpatterns

- **admin/**: Ruta al panel de administración de Django.

- **api/v1/**: Incluye las rutas definidas en nota_app.urls, lo que permite modularizar las URLs por aplicación.

- **api/v1/token/**: Incluye URLs relacionadas con autenticación desde auth_urls.py. Contiene generación de tokens JWT (login), refresh de tokens y verificación de tokens


#### Buenas prácticas

- Prefijar las APIs con /api/v1/ es útil para versionar la API desde el inicio.
- Las URLs de autenticación están separadas (auth_urls.py).
- Las URLs principales de la app están en su propio archivo (nota_app/urls.py).
- api/v1/token/ claramente indica su propósito.
- Jerarquía lógica (api → v1 → recurso).

## include()

La función include() de Django (importada desde django.urls) permite "incluir" otras configuraciones de URLs desde aplicaciones o módulos externos. Su propósito es:

1. Modularizar las URLs:

    - Divide las rutas del proyecto en archivos separados (por app) para mantener el código organizado.

    - Ejemplo: Las URLs de la app pedidosApp están definidas en su propio pedidosApp/urls.py, no en el archivo principal.

2. Anidar rutas bajo un prefijo común:

    - Todas las URLs de la app incluida se agrupan bajo una ruta base (ej: /api/v1/).

3. Estructura:

    - Cuando un usuario visita una URL que comienza con api/v1/, Django delega el procesamiento a las rutas definidas en pedidosApp/urls.py.

    - Ejemplo: Si pedidosApp/urls.py tiene una ruta path('nota/', ...), la URL final será api/v1/nota/

4. Ventajas:

    - Escalabilidad: Puedes añadir más apps sin saturar el archivo principal.
    - Reusabilidad: La app pedidosApp podría usarse en otro proyecto sin modificar sus URLs internas.
    - Mantención: sin include() se tendrían que definir todas las urls en el archivo principal, lo que generaría un archivo muy grande y podría crear acoplamiento entre el proyecto y la app

#### Flujo de una petición con include()

1. El usuario visita: https://tudominio.com/api/v1/nota/

2. Django:

    - Revisa urlpatterns principal y encuentra que api/v1/ delega a nota_app.urls.

    - Elimina la parte coincidente (api/v1/) y pasa el resto (nota/) a nota_app/urls.py.

3. nota_app/urls.py resuelve la ruta restante y llama a la vista correspondiente.
