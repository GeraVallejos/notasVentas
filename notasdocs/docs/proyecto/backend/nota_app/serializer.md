# Archivo `serializer.py`

### ¿Qué es un serializer?

Un serializer se encarga de:
- Convertir modelos (u otros objetos de Python) a JSON para enviarlos como respuesta en una API.
- Validar y convertir datos JSON (u otros formatos) a objetos de Python, como instancias de modelos.

Es como un "traductor" entre tu base de datos (modelos) y el mundo exterior (clientes que consumen tu API).

### Tipos de serializers

- **Serializer (clase base)**:
Se usa cuando quieres control total. Debes definir todos los campos y métodos a mano.

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

    - Extrae el campo password del diccionario validated_data.
    - Crea la instancia del modelo sin la contraseña.
    - Asigna la contraseña utilizando el método set_password() (para aplicar hashing).
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
usuario_creador = serializers.CharField(source='id_usuario.username', read_only=True)
usuario_modificador = serializers.CharField(source='id_usuario_modificacion.username', read_only=True)
```

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
guardar_cliente = validated_data.pop('guardar_cliente', False)

```

- Se extrae y elimina guardar_cliente del diccionario de datos validados.
- Si no está presente, por defecto es False.

```python
validated_data['id_usuario'] = self.context['request'].user
```

- Asigna automáticamente al campo id_usuario el usuario autenticado (request.user).
- self.context contiene el request porque el serializer fue instanciado con context={'request': request} (normal en views DRF).

```python
rut_cliente = validated_data.get('rut_cliente')
if rut_cliente and guardar_cliente:
```

- Verifica si se recibió un RUT de cliente y si se debe guardar el cliente.

```python
try:
    Clientes.objects.get(rut_cliente=rut_cliente)
except Clientes.DoesNotExist:
```

- Intenta buscar un cliente con ese RUT.
- Si no existe, entra al except para crearlo.

```python
cliente_data = {
    'razon_social': validated_data.get('razon_social'),
    'rut_cliente': rut_cliente,
    ...
}
Clientes.objects.create(**cliente_data)
```

- Construye un diccionario con los campos necesarios para el modelo Clientes.
- Crea un nuevo cliente con esos datos.

```python
return super().create(validated_data)
```

- Llama a la implementación original de ModelSerializer.create, que crea la nota con los datos restantes.

### Clientes

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

---
