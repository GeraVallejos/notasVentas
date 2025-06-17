# Carpeta de App `migrations`

Cuando se ejecuta el comando python manage.py makemigrations por primera vez en una app, Django genera este archivo en la carpeta migrations

- Contiene las operaciones iniciales para crear las tablas en la base de datos según los modelos (models.py).
- Se ejecuta al aplicar las migraciones (python manage.py migrate).
- Es la base del historial de migraciones de la app. Django usa este archivo para saber cómo construir el esquema de la base de datos desde cero.

`__init__.py` de la carpeta migrations es un archivo vacío (o con código de inicialización), el cual indica que la carpeta migrations es un paquete Python y permite que Django cargue las migraciones correctamente.

Nunca borrar estos archivos. Si se requiere hacer modificaciones de las tablas, hay que hacerlas en el modelo y no en estos archivos directamente, luego hacer una nueva migración

## `0001_initial.py`
Esta migración inicial crea tres modelos principales: Usuarios, Notas y Clientes. Los cuales se detallan en el archivo modelos

