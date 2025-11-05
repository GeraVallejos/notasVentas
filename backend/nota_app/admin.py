from django.contrib import admin
from .models import Usuarios, Notas, Clientes, Productos, Personal, Proveedores, PedidoMateriasPrimas, DocumentFacturas, NotaProducto
from .forms import UsuarioAdminForm
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from import_export.formats.base_formats import CSV
    
    
class UsuarioAdmin(admin.ModelAdmin):
    form = UsuarioAdminForm
    list_display = ('username', 'nombre', 'apellido', 'correo', 'rut', 'cargo', 'is_staff', 'is_active')
    search_fields = ('username', 'correo', 'rut', 'nombre', 'apellido')
    list_filter = ('is_staff', 'is_active')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Datos personales', {'fields': ('nombre', 'apellido', 'correo', 'rut', 'cargo')}),
        ('Permisos', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )


class PersonalResource(resources.ModelResource):

    class Meta:
        model = Personal
        

class ProveedoresResource(resources.ModelResource):
    class Meta:
        model = Proveedores
       

class ProductosResource(resources.ModelResource):
    class Meta:
        model = Productos
        

class ClientesResource(resources.ModelResource):
    class Meta:
        model = Clientes
        import_id_fields = ()
        fields = (
            'razon_social',
            'rut_cliente',
            'contacto',
            'correo',
            'direccion',
            'comuna',
            'telefono',
            'giro',
            'id_usuario',
        )


class ProveedoresAdmin(ImportExportModelAdmin):
    resource_class = ProveedoresResource



class ProductosAdmin(ImportExportModelAdmin):
    resource_class = ProductosResource



class ClientesAdmin(ImportExportModelAdmin):
    resource_class = ClientesResource



class PersonalAdmin(ImportExportModelAdmin):
    resource_class = PersonalResource



admin.site.register(Usuarios, UsuarioAdmin)
admin.site.register(Notas)
admin.site.register(Clientes, ClientesAdmin)
admin.site.register(Personal, PersonalAdmin)
admin.site.register(Proveedores, ProveedoresAdmin)
admin.site.register(Productos, ProductosAdmin)
admin.site.register(PedidoMateriasPrimas)
admin.site.register(DocumentFacturas)
admin.site.register(NotaProducto)



