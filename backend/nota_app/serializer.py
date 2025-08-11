from rest_framework import serializers
from .models import Usuarios, Notas, Clientes, Productos, Proveedores, Personal, Sabado, SabadoTrabajado

class UsuariosSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Usuarios
        fields = ['nombre', 'apellido', 'correo', 'username', 'password','cargo', 'rut' ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuarios(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
    
class ClientesSerializer(serializers.ModelSerializer):

    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)

    class Meta():
        model = Clientes
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']
    
    def create(self, validated_data):
    
        # Asigna automáticamente el id_usuario del usuario autenticado
        validated_data['id_usuario'] = self.context['request'].user 
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        
        # Asigna automáticamente el id_usuario_modificacion del usuario autenticado al actualizar
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)
    

class NotasSerializer(serializers.ModelSerializer):
    cliente = ClientesSerializer(read_only=True)

    # Campo de escritura: se recibe el RUT del cliente
    rut_cliente = serializers.CharField(write_only=True)

    # Campo opcional para decidir si crear cliente si no existe
    guardar_cliente = serializers.BooleanField(write_only=True, required=False, default=False)

    # Campos necesarios para crear cliente desde el formulario
    razon_social = serializers.CharField(write_only=True, required=False)
    direccion = serializers.CharField(write_only=True, required=False)
    comuna = serializers.CharField(write_only=True, required=False)
    telefono = serializers.CharField(write_only=True, required=False)
    correo = serializers.CharField(write_only=True, required=False)
    contacto = serializers.CharField(write_only=True, required=False)

    # Campos para mostrar directamente en el frontend (aplanados del cliente)
    razon_social_cliente = serializers.CharField(source='cliente.razon_social', read_only=True)
    direccion_cliente = serializers.CharField(source='cliente.direccion', read_only=True)
    comuna_cliente = serializers.CharField(source='cliente.comuna', read_only=True)
    telefono_cliente = serializers.CharField(source='cliente.telefono', read_only=True)
    correo_cliente = serializers.CharField(source='cliente.correo', read_only=True)
    contacto_cliente = serializers.CharField(source='cliente.contacto', read_only=True)
    rut_cliente_cliente = serializers.CharField(source='cliente.rut_cliente', read_only=True)

    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)

    class Meta:
        model = Notas
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']

    def create(self, validated_data):
        request = self.context['request']
        rut_cliente = validated_data.pop('rut_cliente')
        guardar_cliente = validated_data.pop('guardar_cliente', False)

        # Extrae los campos necesarios para el cliente desde la nota
        campos_cliente = ['razon_social', 'direccion', 'comuna', 'telefono', 'correo', 'contacto']
        cliente_data = {campo: validated_data.get(campo) for campo in campos_cliente}

        try:
            cliente = Clientes.objects.get(rut_cliente=rut_cliente)
        except Clientes.DoesNotExist:
            if guardar_cliente:
                cliente_data.update({
                    'rut_cliente': rut_cliente,
                    'id_usuario': request.user,
                })
                cliente = Clientes.objects.create(**cliente_data)
            else:
                raise serializers.ValidationError(f"El cliente con RUT {rut_cliente} no existe y no se solicitó crearlo.")

        validated_data['cliente'] = cliente
        validated_data['id_usuario'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)
    
class ProductosSerializer(serializers.ModelSerializer):

    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)

    class Meta:
        model = Productos
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']
    
    def create(self, validated_data):
    
        # Asigna automáticamente el id_usuario del usuario autenticado
        validated_data['id_usuario'] = self.context['request'].user 
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        
        # Asigna automáticamente el id_usuario_modificacion del usuario autenticado al actualizar
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)

class ProveedoresSerializer(serializers.ModelSerializer):

    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)

    class Meta:
        model = Proveedores
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']
    
    def create(self, validated_data):
        # Asigna automáticamente el id_usuario del usuario autenticado
        validated_data['id_usuario'] = self.context['request'].user 
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Asigna automáticamente el id_usuario_modificacion del usuario autenticado al actualizar
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)
    

class PersonalSerializer(serializers.ModelSerializer):
    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)

    class Meta:
        model = Personal
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']

    def create(self, validated_data):
        validated_data['id_usuario'] = self.context['request'].user 
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)
    
    
class SabadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sabado
        fields = ['id_sabado', 'fecha']


class HistoricoSabadosSerializer(serializers.Serializer):
    mes = serializers.CharField(help_text="Mes en formato YYYY-MM")
    id_personal = serializers.IntegerField(help_text="ID del personal")
    nombre = serializers.CharField(help_text="Nombre del empleado")
    apellido = serializers.CharField(help_text="Apellido del empleado")
    sabados = serializers.ListField(
        child=serializers.CharField(),
        help_text="Lista de fechas de sábados trabajados en formato DD-MM-YYYY"
    )
    total_sabados = serializers.IntegerField(help_text="Cantidad de sábados trabajados")

    class Meta:
        model = Personal
        fields = '__all__'