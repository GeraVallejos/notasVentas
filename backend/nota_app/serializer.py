from rest_framework import serializers
from .models import Usuarios, Notas, Clientes, Productos, Proveedores, Personal, Sabado, PedidoMateriasPrimas, DocumentFacturas, NotaProducto, ProductoProveedor
import boto3
from django.conf import settings
from urllib.parse import quote, urlparse

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
    

class ProductoProveedorInputSerializer(serializers.ModelSerializer):
    proveedor_id = serializers.PrimaryKeyRelatedField(
        queryset=Proveedores.objects.all(),
        source='proveedor'
    )

    class Meta:
        model = ProductoProveedor
        fields = ['proveedor_id', 'precio_compra', 'fecha_inicio', 'activo']


class ProductoProveedorSerializer(serializers.ModelSerializer):
    proveedor_id = serializers.PrimaryKeyRelatedField(
        queryset=Proveedores.objects.all(),
        source='proveedor'
    )

    class Meta:
        model = ProductoProveedor
        fields = ['proveedor_id', 'precio_compra', 'fecha_inicio', 'activo']


class ProductosSerializer(serializers.ModelSerializer):
    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)
    proveedores = ProductoProveedorSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Productos
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion']

    def create(self, validated_data):
        proveedores_data = validated_data.pop('proveedores', [])
        validated_data['id_usuario'] = self.context['request'].user
        producto = super().create(validated_data)
        
        for prov_data in proveedores_data:
            ProductoProveedor.objects.create(producto=producto, **prov_data)
        return producto

    def update(self, instance, validated_data):
        proveedores_data = validated_data.pop('proveedores', [])
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        producto = super().update(instance, validated_data)
        
        if proveedores_data:
            # Borrar relaciones previas para este producto
            producto.proveedores_relacionados.all().delete()
            for prov_data in proveedores_data:
                ProductoProveedor.objects.create(producto=producto, **prov_data)
        return producto


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


class PedidoMateriasPrimasSerializer(serializers.ModelSerializer):
    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)
    id_proveedor = serializers.PrimaryKeyRelatedField(
        queryset=Proveedores.objects.all(),
        required=False,
        allow_null=True,
    )
    id_producto = serializers.PrimaryKeyRelatedField(
        queryset=Productos.objects.all(),
    )

    rut_proveedor = serializers.CharField(source='id_proveedor.rut_proveedor', read_only=True)
    nombre_proveedor = serializers.CharField(source='id_proveedor.razon_social', read_only=True)
    nombre_producto = serializers.CharField(source='id_producto.nombre', read_only=True)
    codigo_producto = serializers.CharField(source='id_producto.codigo', read_only=True)

    fecha_creacion = serializers.DateTimeField(read_only=True)
    fecha_modificacion = serializers.DateTimeField(read_only=True)

    class Meta:
        model = PedidoMateriasPrimas
        fields = '__all__'
        read_only_fields = ['id_usuario', 'id_usuario_modificacion', 'fecha_creacion', 'fecha_modificacion']

    def create(self, validated_data):
        validated_data['id_usuario'] = self.context['request'].user 
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['id_usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)
    
    

class DocumentFacturasSerializer(serializers.ModelSerializer):
    usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
    signed_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentFacturas
        fields = ['id_factura', 'title', 'empresa', 'observacion', 
              'file_url', 'file_size', 'created_at', 'updated_at',
              'usuario_creador', 'estado', 'page_count','signed_url', 'download_url']
        read_only_fields = ['id_usuario', 'created_at', 'updated_at', 'file_url']

    def _generate_presigned_url(self, obj, for_download=False):
        if not obj.file_url:
            return None


        s3 = boto3.client(
            "s3",
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name="auto",
        )

        parsed = urlparse(obj.file_url)
        key = parsed.path.split('/', 2)[-1]
        key = quote(key, safe="/")

        try:
            params = {
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME, 
                "Key": key
            }
            
            # Diferentes parámetros según el propósito
            if for_download:
                filename = f"{obj.title}.pdf" if obj.title else "archivo.pdf"
                params["ResponseContentDisposition"] = f'attachment; filename="{filename}"'
                params["ResponseContentType"] = "application/octet-stream"
            else:
                # Para ver: permitir que el navegador decida cómo manejar el PDF
                params["ResponseContentDisposition"] = "inline"

            url = s3.generate_presigned_url(
                "get_object",
                Params=params,
                ExpiresIn=24 * 60 * 60,
            )
            return url
        except Exception as e:
            print("Error generando signed_url:", e)
            return None
        
    def get_signed_url(self, obj):
        """URL para VER el archivo (se abre en el navegador)"""
        return self._generate_presigned_url(obj, for_download=False)

    def get_download_url(self, obj):
        """URL para DESCARGAR el archivo (fuerza descarga)"""
        return self._generate_presigned_url(obj, for_download=True)

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["id_usuario"] = request.user

        file_obj = request.FILES.get("file")
        if file_obj:
            # Normalizar nombre del archivo
            import re
            file_name = re.sub(r"\s+", "_", file_obj.name)
            file_name = re.sub(r"[^a-zA-Z0-9_.-]", "", file_name)

            key = f"facturas/{file_name}"

            s3 = boto3.client(
                "s3",
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name="auto",
            )

            s3.upload_fileobj(file_obj, settings.AWS_STORAGE_BUCKET_NAME, key)

            # Guardamos la URL base en la DB
            validated_data["file_url"] = f"{settings.AWS_S3_ENDPOINT_URL}/{settings.AWS_STORAGE_BUCKET_NAME}/{key}"
            validated_data["file_size"] = file_obj.size

        return super().create(validated_data)
    


class NotaProductoSerializer(serializers.ModelSerializer):
    # lectura: objeto anidado
    nota = NotasSerializer(read_only=True)
    producto = ProductosSerializer(read_only=True)

    # usuario creador/modificador
    usuario_creador = serializers.CharField(source='usuario_creacion.username', read_only=True)
    usuario_modificador = serializers.CharField(source='usuario_modificacion.username', read_only=True)

    # escritura: solo IDs

    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Productos.objects.all(),
        source="producto",
        write_only=True
    )

    nota_id = serializers.PrimaryKeyRelatedField(
        queryset=Notas.objects.all(),
        source="nota",
        write_only=True,
        required=False,
        allow_null=True 
    )

    class Meta:
        model = NotaProducto
        fields = [
            "id",
            "nota", "nota_id",
            "producto", "producto_id",
            "cantidad",
            "tipo",
            "observacion",
            "fecha_creacion",
            "fecha_modificacion",
            "usuario_creador",
            "usuario_modificador",
            "estado",
        ]
        read_only_fields = ['usuario_creacion', 'usuario_modificacion', 'fecha_creacion', 'fecha_modificacion']

    def create(self, validated_data):
        validated_data['usuario_creacion'] = self.context['request'].user 
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['usuario_modificacion'] = self.context['request'].user
        return super().update(instance, validated_data)

