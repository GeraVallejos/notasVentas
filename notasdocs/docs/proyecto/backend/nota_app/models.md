# Archivo `models.py`

Los modelos extienden funcionalidades base de Django y establecen relaciones clave para el negocio. Se crean en base a la clase models de Django

### Características

Django con los modelos sigue el patrón ORM (Object-Relational Mapping), que permite trabajar con bases de datos relacionales usando clases de Python.

- Los modelos se definen como clases que heredan de django.db.models.Model. Cada atributo de la clase representa una columna en la base de datos.

- Django transforma los modelos en instrucciones SQL mediante dos pasos:
    - python manage.py makemigrations: genera archivos de migración (cambios estructurales).
    - python manage.py migrate: aplica esos cambios a la base de datos (crea/modifica tablas).

- Una vez creado el modelo, se puede usar como si fuera una clase de Python, pero internamente se comunica con la base de datos:

```python
# Crear registros
Cliente.objects.create(nombre='Juan', correo='juan@email.com')

# Consultar registros
clientes = Cliente.objects.all()  # SELECT * FROM clientes
uno = Cliente.objects.get(id=1)   # SELECT * FROM clientes WHERE id=1

# Actualizar registros
cliente = Cliente.objects.get(id=1)
cliente.nombre = 'Pedro'
cliente.save()

# Eliminar registros
cliente.delete()
```

#### Ventajas del ORM

- Abstracción: no necesitas escribir SQL directamente.
- Seguridad: previene inyecciones SQL.
- Portabilidad: funciona con varias bases de datos (PostgreSQL, SQLite, MySQL…).
- Productividad: permite trabajar con objetos Python directamente.

#### Integración con otras partes del framework

Los modelos se conectan con:

- Formularios (ModelForm)
- Serializers en Django REST Framework
- Admin para paneles automáticos
- Views/CBVs para lógica de negocio

### Importaciones

Este conjunto de importaciones es fundamental para trabajar con modelos y autenticación en Django.

```python
from django.db import models
from django.contrib.auth.models import AbstractUser
import django.contrib.auth.validators
```

**`from django.db import models`**

- Qué hace: Importa el módulo principal para definir modelos de base de datos en Django
- Para qué sirve:
    - Permite crear clases que se mapean a tablas de la base de datos
    - Proporciona los diferentes tipos de campos (CharField, IntegerField, etc.)
    - Incluye funcionalidades para relaciones entre modelos (ForeignKey, ManyToManyField)

**`from django.contrib.auth.models import AbstractUser`**

- Qué hace: Importa la clase base abstracta para el modelo de usuario
- Para qué sirve:
    - Permite extender o personalizar el modelo de usuario por defecto de Django
    - Incluye todos los campos y métodos básicos de autenticación (username, password, permisos)
    - Es la forma recomendada de crear usuarios personalizados en Django

**`import django.contrib.auth.validators`**

- Qué hace: Importa validadores para el sistema de autenticación
- Para qué sirve:
    - Contiene validaciones predefinidas para campos de autenticación
    - Incluye el validador UnicodeUsernameValidator usado para nombres de usuario
    - Proporciona seguridad estándar para campos sensibles

#### Estas importaciones trabajan juntas para:

- Definir modelos (models) - La estructura base de datos
- Personalizar usuarios (AbstractUser) - Extender el sistema de autenticación
- Validar datos (auth.validators) - Asegurar la calidad de la información

#### ¿Por qué son importantes?

- models: Es el corazón de la capa de base de datos en Django
- AbstractUser: Proporciona un sistema de autenticación seguro y personalizable
- auth.validators: Asegura que los datos cumplan con estándares de seguridad

Estas importaciones son esenciales para cualquier aplicación Django que necesite:

- Almacenamiento estructurado de datos (models)
- Sistema de usuarios personalizado (AbstractUser)
- Validación robusta de credenciales (auth.validators)

### Estructura Básica

```python
class Clientes(models.Model):  # Hereda de la clase base Model
    # Campos...
    class Meta:
        managed = True  # Django gestiona las migraciones
        db_table = 'clientes'  # Nombre personalizado para la tabla
```

- class Meta: Configuración adicional del modelo
- managed = True: Permite que Django gestione las migraciones
- db_table = 'notas': Nombre personalizado para la tabla en la BD

#### Campos de Auditoría

```python
fecha_creacion = models.DateTimeField(auto_now_add=True)  # Se setea solo al crear
fecha_modificacion = models.DateTimeField(auto_now=True)  # Se actualiza automáticamente
```

#### Relaciones

```python
id_usuario = models.ForeignKey(
    'Usuarios',  # Modelo relacionado
    models.DO_NOTHING,  # No hacer nada si se borra el usuario
    db_column='id_usuario',
    related_name='clientes_creados'  # Acceso inverso
)
```

### Construcción de los modelos

#### Tipos de Campos (Field Types)

- **AutoField**:
    - id_cliente = models.AutoField(primary_key=True)
    - Función: Crea un entero autoincremental (1, 2, 3...) como clave primaria
    - Equivalente DB: INT AUTO_INCREMENT (MySQL), SERIAL (PostgreSQL)

- **CharField**:
    - razon_social = models.CharField(max_length=300)
    - Función: Almacena cadenas de texto con longitud máxima
    - Parámetro clave: max_length (requerido)
    - Equivalente DB: VARCHAR(n)

- **DateTimeField**:
    - fecha_creacion = models.DateTimeField(auto_now_add=True)
    - Variantes:
        - auto_now_add: Guarda timestamp al crear
        - auto_now: Actualiza al modificar
    - Equivalente DB: DATETIME

- **ForeignKey**:
    - id_usuario = models.ForeignKey(...)
    - Función: Establece relación muchos-a-uno
    - Parámetros clave:
        - on_delete: Comportamiento al borrar el relacionado
        - related_name: Nombre para la relación inversa

#### blank y null:
- Usar blank=True para campos opcionales en formularios
- Usar null=True para campos numéricos/fechas opcionales
- Para textos: blank=True (evitar null en Char/TextField)

#### Parámetros Especiales

- **unique=True**:
    - rut_cliente = models.CharField(unique=True)
    - Efecto: Garantiza valores únicos en la base de datos
    - Costo: Crea índice único (mejor rendimiento en búsquedas)

- **db_column**:
    - Personaliza el nombre de columna en la DB
    - Ej: db_column='id_usuario' → Se almacena como id_usuario en tabla

- **related_name**:
    - related_name='clientes_creados'
    - Función: Permite acceder a los clientes desde el usuario:

``` python
usuario = Usuarios.objects.first()
usuario.clientes_creados.all()  # Todos los clientes creados por este usuario
```

---



