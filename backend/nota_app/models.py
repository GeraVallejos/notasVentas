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
    nombre_cliente = models.CharField(max_length=300)
    rut_cliente = models.CharField(max_length=30, blank=True, null=True) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    fecha_despacho = models.DateTimeField(blank=False, null=False)
    contacto = models.CharField(max_length=200, blank=False, null=False)
    correo = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=False, null=False)
    comuna = models.CharField(max_length=50, blank=False, null=False)
    telefono = models.CharField(max_length=20, blank=False, null=False)
    estado_solicitud = models.CharField(max_length=30, default='No Solicitado')
    observacion = models.CharField(max_length=1000, blank=True, null=True)
    horario_desde = models.CharField(max_length=50, blank=True, null=True)
    horario_hasta = models.CharField(max_length=50, blank=True, null=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', related_name='notas_creadas')
    id_usuario_modificacion = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_modificacion', related_name='notas_modificadas', null=True, blank=True)
    
    class Meta:
        managed = True
        db_table = 'notas'