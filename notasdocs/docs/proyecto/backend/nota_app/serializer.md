# Archivo `serializer.py`

### ¿Qué es un serializer?

Un serializer se encarga de:

- Convertir modelos (u otros objetos de Python) a JSON para enviarlos como respuesta en una API.
- Validar y convertir datos JSON (u otros formatos) a objetos de Python, como instancias de modelos.

Es como un "traductor" entre la base de datos (modelos) y el mundo exterior (clientes que consumen la API).

### Tipos de serializers

- **Serializer (clase base)**:
Se usa cuando se requiere control total. Es necesario definir todos los campos y métodos a mano.

```python
from rest_framework import serializers

class UsuarioSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(max_length=100)
    email = serializers.EmailField()
```

- **ModelSerializer (el más común)**:

Se basa en un modelo de Django. DRF infiere automáticamente los campos a partir del modelo.

```python
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'  # o ['id', 'nombre', 'email']
```

### ¿Cómo funciona el ciclo?

Suponemos un modelo Nota:

```python
class Nota(models.Model):
    titulo = models.CharField(max_length=100)
    contenido = models.TextField()
```

El serializer sería:

```python
class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = ['id', 'titulo', 'contenido']
```

#### A. Serializar (modelo → JSON)

```python
nota = Nota.objects.first()
serializer = NotaSerializer(nota)
serializer.data
# → {'id': 1, 'titulo': 'Mi nota', 'contenido': 'Contenido...'}
```

#### B. Deserializar y validar (JSON → modelo)

```python
data = {'titulo': 'Nueva nota', 'contenido': 'Texto'}
serializer = NotaSerializer(data=data)

if serializer.is_valid():
    nota = serializer.save()
else:
    print(serializer.errors)
```

### Validaciones

Se pueden agregar validaciones personalizadas

```python
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombre', 'email']

    def validate_email(self, value):
        if "spam" in value:
            raise serializers.ValidationError("Email inválido.")
        return value
```

También se puede validar todos los campos juntos:

```python
def validate(self, data):
    if data['nombre'] == 'Admin':
        raise serializers.ValidationError("Ese nombre no está permitido.")
    return data
```

#### Métodos

| Acción	| ¿Qué hace el serializer? |
|-------|-------|
| .data | Convierte objeto Python a JSON (serializa)|
| .is_valid() | Valida datos de entrada (JSON) |
| .save() | Crea o actualiza instancia del modelo |
| .errors |	Muestra errores de validación |

## Proyecto Notas

### Usuario
- En el proyecto, para el serializer de Usuario, se utliza:

```python
extra_kwargs = {
    'password': {'write_only': True}
}
```
Con esto se especifica que el campo password debe ser de solo escritura para evitar exponerlo en respuestas serializadas.

- El metodo `create(self, validated_data)` sobreescribe el método de creación para gestionar el hash de la contraseña:

    - Extrae el campo password del diccionario validated_data (método de DRF).
    - Crea la instancia del modelo sin la contraseña.
    - Asigna la contraseña utilizando el método set_password() (para aplicar hashing) (método de AbstarctUser)
    - Guarda y retorna la instancia.

- El metodo `update(self, instance, validated_data)` sobrescribe el método de actualización:

    - Si password está presente, se procesa con set_password() antes de guardar.
    - Se actualizan todos los atributos restantes con setattr().

```python
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
```

Django REST Framework, por defecto, no sabe que password requiere hashing, por lo tanto:

- Si no  se sobreescribe create y update, el password se guardaría sin cifrar.
- Este serializer personaliza esos métodos para evitar ese problema.

| Elemento | ¿Qué es? |
|-------|-------|
| validated_data | Diccionario generado por serializer.is_valid() con los datos limpios. |
| setattr() | Función de Python que asigna dinámicamente un valor a un atributo. |

### Notas

#### Campos personalizados

```python
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
```

En este serailizer se crearon campos para crear al cliente desde el formulario notas, si este no existe en la bd. Además, se mandan los datos aplanados (sin anidación) para mostrar los datos del cliente en el formulario (se rellenan campos si el cliente se encuentra en la bd). 

- `usuario_creador`: campo de solo lectura que muestra el username del usuario que creó la nota.

- `usuario_modificador`: campo de solo lectura que muestra el username del último usuario que modificó la nota.

Ambos obtienen el valor desde claves foráneas (id_usuario, id_usuario_modificacion) que apuntan al modelo Usuarios.

```python
guardar_cliente = serializers.BooleanField(write_only=True, required=False, default=False)
```

- Campo adicional que no existe en el modelo.
- Se usa para controlar si se debe crear un cliente automáticamente.
- Es write_only: solo se acepta en el request, pero no se muestra en la respuesta.

#### Clase Meta

```python
class Meta:
    model = Notas
    fields = '__all__'
    read_only_fields = ['id_usuario', 'id_usuario_modificacion']
```

- model = Notas: indica el modelo que se está serializando.
- fields = '\__all__': incluye todos los campos del modelo.
- read_only_fields: estos campos no pueden ser escritos directamente desde el request; se asignan automáticamente desde el código.

#### Método create(self, validated_data)

```python
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
```

Este método se encarga de crear una nueva instancia del modelo y asociarla a un cliente existente, o crear ese cliente si no existe y se ha solicitado guardarlo. Además, asocia el usuario autenticado que hizo la petición. Este método sobrescribe create para manejar la lógica de asociación de un cliente a una nota. Si el cliente no existe y se ha solicitado su creación (guardar_cliente=True), se crea automáticamente con los datos entregados. Además, se asigna el usuario autenticado como creador tanto del cliente (si es creado) como de la nota.

```python
def create(self, validated_data):
```

- Sobrescribe el método create del serializer para manejar lógica adicional al guardar la instancia.

```python
request = self.context['request']
```

- Obtiene el objeto request desde el contexto del serializer (útil para acceder al usuario autenticado u otros datos del request).

```python
rut_cliente = validated_data.pop('rut_cliente')
guardar_cliente = validated_data.pop('guardar_cliente', False)
```

- Extrae el rut_cliente desde los datos validados (y lo remueve del diccionario).
- También extrae guardar_cliente que indica si se debe crear el cliente si no existe. Por defecto es False.

```python
campos_cliente = ['razon_social', 'direccion', 'comuna', 'telefono', 'correo', 'contacto']
cliente_data = {campo: validated_data.get(campo) for campo in campos_cliente}
```

- Crea un diccionario con los datos necesarios para el modelo Clientes, extrayéndolos desde validated_data.


```python
try:
    cliente = Clientes.objects.get(rut_cliente=rut_cliente)
```

- Intenta buscar un cliente ya existente con ese RUT.

```python
except Clientes.DoesNotExist:
    if guardar_cliente:
        cliente_data.update({
            'rut_cliente': rut_cliente,
            'id_usuario': request.user,
        })
        cliente = Clientes.objects.create(**cliente_data)
```

- Si el cliente no existe y se solicitó crearlo (guardar_cliente=True), se crea un nuevo cliente con los datos extraídos y el usuario autenticado.

```python
    else:
        raise serializers.ValidationError(f"El cliente con RUT {rut_cliente} no existe y no se solicitó crearlo.")
```

- Si el cliente no existe y no se debe crear, lanza un error de validación.

```python
validated_data['cliente'] = cliente
validated_data['id_usuario'] = request.user
```

- Agrega el objeto cliente ya obtenido o creado al validated_data.
- También se asocia el usuario autenticado como id_usuario.

```python
return super().create(validated_data)
```

- Llama al método original del serializer para continuar con la creación del objeto principal

- Metodos create y update asignan usuarios logueados

```python
def create(self, validated_data):
    
    # Asigna automáticamente el id_usuario del usuario autenticado
    validated_data['id_usuario'] = self.context['request'].user 
    return super().create(validated_data)
    
def update(self, instance, validated_data):
        
    # Asigna automáticamente el id_usuario_modificacion del usuario autenticado al actualizar
    validated_data['id_usuario_modificacion'] = self.context['request'].user
    return super().update(instance, validated_data)
```

## Historico Sabados

Este serializer no utiliza serializer.ModelSerializer (DRF) si no que el serializer.Serializer que viene con Django, ya que no utiliza un modelo para entregar o recibir datos, es por esto que hay que explicitar los campos que se mostraran en la API. 

```python
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
```

Este serializer permite construir y devolver un reporte personalizado de los sábados trabajados por un empleado en un mes. Define explícitamente cada campo necesario para el reporte, en lugar de depender del modelo de la base de datos. Es ideal para endpoints del tipo /personal/historico_sabados/?mes=2025-07 donde se retornan datos calculados.

---
