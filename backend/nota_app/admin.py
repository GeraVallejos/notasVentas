from django.contrib import admin
from .models import Usuarios, Notas, Clientes, Productos, Personal, Proveedores, PedidoMateriasPrimas
from .forms import UsuarioAdminForm
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields

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
        import_id_fields = ('id_personal',) 
        fields = (
           'id_personal', 'nombre', 'apellido', 'rut', 'fecha_creacion', 'correo', 
           'direccion', 'comuna', 'telefono', 'cargo', 'id_usuario', 'id_usuario_modificacion', 'estado'
        )

class ProveedoresAdmin(ImportExportModelAdmin):
    pass


class ProductosAdmin(ImportExportModelAdmin):
    pass


class PersonalAdmin(ImportExportModelAdmin):
    resource_class = PersonalResource


class ClientesAdmin(ImportExportModelAdmin):
    pass


admin.site.register(Usuarios, UsuarioAdmin)
admin.site.register(Notas)
admin.site.register(Clientes, ClientesAdmin)
admin.site.register(Personal, PersonalAdmin)
admin.site.register(Proveedores, ProveedoresAdmin)
admin.site.register(Productos, ProductosAdmin)
admin.site.register(PedidoMateriasPrimas)


