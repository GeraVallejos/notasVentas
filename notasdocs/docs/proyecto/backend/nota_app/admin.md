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

El siguiente código define recursos para importar y exportar datos usando la librería django-import-export y luego los asocia a clases del panel de administración de Django.

Cada ModelResource determina qué modelo se puede importar/exportar, y opcionalmente qué campos incluir, cómo identificar registros y cómo manejarlos durante la importación.

Finalmente, las clases Admin asocian cada recurso a su respectiva vista en el Django Admin.

```python
class PersonalResource(resources.ModelResource):

    class Meta:
        model = Personal
        import_id_fields = ()
        fields = (
            'nombre',
            'apellido',
            'rut',
            'correo',
            'direccion',
            'comuna',
            'telefono',
            'cargo',
            'id_usuario',
        )
        

class ProveedoresResource(resources.ModelResource):
    class Meta:
        model = Proveedores
```

### Explicación

- ModelResource: Representa la configuración de importación/exportación para el modelo Personal.
- model: Define el modelo al que pertenece el recurso.
- import_id_fields = ()
    - Indica que no se utilizarán campos específicos para identificar registros durante la importación.
    - Es útil cuando solo se quiere crear nuevos registros en cada importación.
- fields: Lista explícita de campos permitidos para importar/exportar.
    - Limita las columnas visibles en archivos XLSX/CSV exportados.
    - Evita exponer campos sensibles o innecesarios.

```python
class ProveedoresAdmin(ImportExportModelAdmin):
    resource_class = ProveedoresResource
```

### Explicación

- Habilita botones de Import y Export en el Django Admin para el modelo Proveedores.
- Usa la definición de campos del recurso ProveedoresResource.

Registro de modelos en el panel de administración

```python
admin.site.register(Usuarios, UsuarioAdmin)
admin.site.register(Notas)
admin.site.register(Clientes, ClientesAdmin)
admin.site.register(Personal, PersonalAdmin)
admin.site.register(Proveedores, ProveedoresAdmin)
admin.site.register(Productos, ProductosAdmin)
admin.site.register(PedidoMateriasPrimas)
admin.site.register(DocumentFacturas)
admin.site.register(NotaProducto)
```

- Usuarios: Registrado con la clase personalizada UsuarioAdmin.
- Notas y Clientes: Registrados con la configuración predeterminada de ModelAdmin.