from django.db import models
from django.contrib.auth.models import AbstractUser
import django.contrib.auth.validators

# Create your models here.

class Usuarios(AbstractUser):
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    correo = models.CharField(max_length=45)
    username = models.CharField(error_messages={'unique': 'Este Nombre de Usuario ya existe'}, max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='Nombre de Usuario')
    cargo = models.CharField(max_length=45, blank=True, null=True)
    rut = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = True
        db_table = 'usuarios'


class Notas(models.Model):
    id_nota = models.AutoField(primary_key=True)
    num_nota = models.IntegerField(null=False)
    cliente = models.ForeignKey('Clientes', on_delete=models.PROTECT, related_name='notas')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    fecha_despacho = models.DateTimeField(blank=False, null=False)
    estado_solicitud = models.CharField(max_length=30, default='No Solicitado')
    observacion = models.CharField(max_length=1000, blank=True, null=True)
    despacho_retira = models.CharField(max_length=50, blank=True, null=True)
    horario_desde = models.CharField(max_length=50, blank=True, null=True)
    horario_hasta = models.CharField(max_length=50, blank=True, null=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', related_name='notas_creadas')
    id_usuario_modificacion = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_modificacion', related_name='notas_modificadas', null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'notas'


class Clientes(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    razon_social = models.CharField(max_length=300)
    rut_cliente = models.CharField(max_length=30, blank=True, null=True, unique=True) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    contacto = models.CharField(max_length=200, blank=True, null=True)
    correo = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=False, null=False)
    comuna = models.CharField(max_length=50, blank=False, null=False)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    giro = models.CharField(max_length=1000, blank=True, null=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', related_name='clientes_creados')
    id_usuario_modificacion = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_modificacion', related_name='clientes_modificados', null=True, blank=True)
    
    class Meta:
        managed = True
        db_table = 'clientes'


class Productos(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200, blank=False, null=False)
    descripcion = models.CharField(max_length=1000, blank=True, null=True)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    stock = models.IntegerField(default=0, blank=False, null=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', related_name='productos_creados')
    id_usuario_modificacion = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_modificacion', related_name='productos_modificados', null=True, blank=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    id_proveedor = models.ForeignKey('Proveedores', models.DO_NOTHING, db_column='id_proveedor', related_name='producto_proveedor', null=True, blank=True)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    codigo = models.CharField(max_length=20, blank=False, null=False, unique=True)
    estado = models.CharField(max_length=20, default='Activo')
    clase1 = models.CharField(max_length=100, blank=True, null=True)
    clase2 = models.CharField(max_length=100, blank=True, null=True)
    clase3 = models.CharField(max_length=100, blank=True, null=True)
    unidad_medida = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'productos'


class Proveedores(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    razon_social = models.CharField(max_length=300, blank=False, null=False)
    rut_proveedor = models.CharField(max_length=30, blank=True, null=True, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    contacto = models.CharField(max_length=200, blank=True, null=True)
    correo = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=False, null=False)
    comuna = models.CharField(max_length=50, blank=False, null=False)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    giro = models.CharField(max_length=1000, blank=True, null=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', related_name='proveedores_creados')
    id_usuario_modificacion = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_modificacion', related_name='proveedores_modificados', null=True, blank=True)
    estado = models.CharField(max_length=20, default='Activo')

    class Meta:
        managed = True
        db_table = 'proveedores'

class Personal(models.Model):
    id_personal = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200, blank=False, null=False)
    apellido = models.CharField(max_length=200, blank=False, null=False)
    rut = models.CharField(max_length=30, blank=True, null=True, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    correo = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    comuna = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    cargo = models.CharField(max_length=1000, blank=True, null=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', related_name='personal_creado')
    id_usuario_modificacion = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_modificacion', related_name='personal_modificado', null=True, blank=True)
    estado = models.CharField(max_length=20, default='Activo')

    class Meta:
        managed = True
        db_table = 'personal'


class Sabado(models.Model):
    id_sabado = models.AutoField(primary_key=True)
    fecha = models.DateField(unique=True)
    def __str__(self):
        return self.fecha.strftime("%d-%m-%Y")
    

class SabadoTrabajado(models.Model):
    personal = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name="sabados_trabajados")
    sabado = models.ForeignKey(Sabado, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("personal", "sabado")
    