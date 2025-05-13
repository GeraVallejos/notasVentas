from django.db import models
from django.contrib.auth.models import AbstractUser
import django.contrib.auth.validators

# Create your models here.

class Usuarios(AbstractUser):
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    correo = models.CharField(max_length=45)
    username = models.CharField(error_messages={'unique': 'Este Nombre de Usuario ya existe'}, max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='Nombre de Usuario')
    password = models.CharField(max_length=200)
    cargo = models.CharField(max_length=45, blank=True, null=True)
    rut = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = True
        db_table = 'usuarios'


class Notas(models.Model):
    id_nota = models.AutoField(primary_key=True)
    num_nota = models.IntegerField(null=False)
    nombre_cliente = models.CharField(max_length=300)
    rut_cliente = models.CharField(max_length=30) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    fecha_despacho = models.DateTimeField(blank=True, null=True)
    contacto = models.CharField(max_length=200)
    correo = models.CharField(max_length=50)
    direccion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20)
    estado_solicitud = models.CharField(max_length=30)
    observacion = models.CharField(max_length=1000)
    horario_desde = models.CharField(max_length=20)
    horario_hasta = models.CharField(max_length=20)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id', related_name='notas_usuario')
    
    class Meta:
        managed = True
        db_table = 'notas'