from rest_framework import serializers
from .models import Usuarios, Notas, Clientes

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

class NotasSerializer(serializers.ModelSerializer):

    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)

    # Campo para indicar si se debe guardar el cliente
    guardar_cliente = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta():
        model = Notas
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']
    
    def create(self, validated_data):
        guardar_cliente = validated_data.pop('guardar_cliente', False)
        
        # Asigna automáticamente el id_usuario del usuario autenticado
        validated_data['id_usuario'] = self.context['request'].user
        
        # Verificar si el cliente existe
        rut_cliente = validated_data.get('rut_cliente')
        if rut_cliente and guardar_cliente:
            try:
                Clientes.objects.get(rut_cliente=rut_cliente)
            except Clientes.DoesNotExist:
                # Crear nuevo cliente
                cliente_data = {
                    'razon_social': validated_data.get('razon_social'),
                    'rut_cliente': rut_cliente,
                    'contacto': validated_data.get('contacto'),
                    'correo': validated_data.get('correo'),
                    'direccion': validated_data.get('direccion'),
                    'comuna': validated_data.get('comuna'),
                    'telefono': validated_data.get('telefono'),
                    'id_usuario': validated_data['id_usuario']
                }
                Clientes.objects.create(**cliente_data)
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        
        # Asigna automáticamente el id_usuario_modificacion del usuario autenticado al actualizar
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)
    
    
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