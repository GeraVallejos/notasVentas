# Archivo `admin.py`

### Importaciones

```python
from django.contrib import admin
from .models import Usuarios, Notas, Clientes
from .forms import UsuarioAdminForm
```

- django.contrib.admin: Módulo base del sistema de administración de Django.
- Usuarios, Notas, Clientes: Modelos definidos en la aplicación actual.
- UsuarioAdminForm: Formulario personalizado para el modelo Usuarios.

### Clase: UsuarioAdmin

```python
class UsuarioAdmin(admin.ModelAdmin):

```
Define una configuración personalizada del panel de administración para el modelo Usuarios, heredando de admin.ModelAdmin.

#### Atributos definidos:

```python
form = UsuarioAdminForm
    list_display = ('username', 'nombre', 'apellido', 'correo', 'rut', 'cargo', 'is_staff', 'is_active')
    search_fields = ('username', 'correo', 'rut', 'nombre', 'apellido')
    list_filter = ('is_staff', 'is_active')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Datos personales', {'fields': ('nombre', 'apellido', 'correo', 'rut', 'cargo')}),
        ('Permisos', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
```

- **form**: Utiliza un formulario personalizado para validar o extender el comportamiento del modelo en el panel de administración.

- **list_display**: Define las columnas visibles en la vista de lista de objetos Usuarios.

- **search_fields**: Permite la búsqueda rápida por los campos especificados.

- **list_filter**: Agrega filtros laterales para los atributos booleanos más relevantes del modelo.

- **ordering**: Define el orden por defecto (ascendente) por ID.

- **fieldsets**: Agrupa los campos del formulario en secciones lógicas dentro del formulario de edición.

Registro de modelos en el panel de administración

```python
admin.site.register(Usuarios, UsuarioAdmin)
admin.site.register(Notas)
admin.site.register(Clientes)
```

- Usuarios: Registrado con la clase personalizada UsuarioAdmin.
- Notas y Clientes: Registrados con la configuración predeterminada de ModelAdmin.