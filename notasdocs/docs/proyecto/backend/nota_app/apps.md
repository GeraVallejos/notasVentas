# Archivo `apps.py`

Este archivo define la configuración principal de la app nota_app dentro del proyecto Django

Django utiliza esta configuración cuando registra la aplicación. Se puede hacer referencia a esta clase en INSTALLED_APPS dentro del archivo settings.py, de forma automática si fue creada con el comando **python manage.py startapp nota_app**

## Contenido del archivo

```python
from django.apps import AppConfig

class NotaAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'nota_app'
```

La clase NotaAppConfig extiende AppConfig y se utiliza para configurar algunos aspectos fundamentales de la aplicación nota_app.

- default_auto_field:
Establece el tipo de campo por defecto para claves primarias automáticas.
En este caso, se utiliza BigAutoField, lo cual es útil para manejar grandes volúmenes de datos sin colisiones de IDs.

- name:
Define el nombre interno de la aplicación. Este nombre debe coincidir con el nombre del paquete o carpeta en la que se encuentra la app.

### AppConfig

Es una clase base de Django que permite personalizar el comportamiento de una aplicación. Todo proyecto/app en Django tiene un archivo apps.py donde se define esta configuración (generado automáticamente al crear la app con python manage.py startapp).

Hay que agregar la aplicación a INSTALLED_APPS:

```python
# settings.py
INSTALLED_APPS = [
    ...
    'nota_app.apps.NotaAppConfig',  # ← Ruta completa a la clase
    # O simplemente 'pedidosApp' (Django busca automáticamente la clase Config)
]
```