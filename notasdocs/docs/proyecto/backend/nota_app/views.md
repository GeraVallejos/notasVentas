# Archivo `views.py`

### Importaciones

Algunas importaciones claves (no son todas las que estan presentes en el código original):

```python
from rest_framework import viewsets
from .serializer import UsuariosSerializer, NotasSerializer, ClientesSerializer
from .models import Usuarios, Notas, Clientes
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Count, Q
from datetime import datetime
import logging
from django.utils.timezone import make_aware
from django.db.models import DateField
from django.db.models.functions import Cast
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.middleware.csrf import get_token

logger = logging.getLogger(__name__)
```

- Importa viewsets de DRF. ModelViewSet proporciona acciones CRUD automáticas.
- Importa permisos genéricos como IsAuthenticated o IsAdminUser.
- Permite definir acciones personalizadas dentro del ViewSet, como @action(detail=False, methods=['get']).
- Permite enviar respuestas HTTP personalizadas.
- Función para comparar una contraseña en texto plano con una contraseña hasheada del usuario.
- Permiso para permitir acceso a cualquier usuario, incluso no autenticado.
- Proporciona códigos de estado HTTP legibles (HTTP_200_OK, HTTP_400_BAD_REQUEST, etc.).
- Count: para agregaciones, Q: para filtros complejos
- Utilidades estándar: fechas y logging para depuración o errores.
- Herramientas para manejar zonas horarias y convertir campos
- Vista genérica base para crear endpoints personalizados que no requieren un ViewSet.
- Permiten convertir campos a tipos específicos en las consultas, por ejemplo, para filtrar por fecha sin hora (Cast(fecha, DateField())).
- Convierte objetos datetime en fechas con zona horaria.
- `ensure_csrf_cookie`: fuerza el envío del token CSRF en las respuestas (útil para Single Page Apps).
- `get_token`: obtiene el token CSRF para entregarlo al cliente.
- Habilita un logger específico para este módulo, útil para registrar errores, advertencias u otra información de depuración.

### Vistas

## **`1.- class UsuarioView(viewsets.ModelViewSet):`**

```python
    def get_permissions(self):
        if self.action in ['actual', 'verify_password', 'logout']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
```

**Controla qué permisos aplicar según la acción:**

- Para las acciones personalizadas actual, verify_password y logout → requiere estar autenticado.
- Para todo lo demás (CRUD) → solo lo puede hacer un admin.

---

#### Acción personalizada: `actual`

```python
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def actual(self, request, **kwargs):
        user = self.request.user
```

**Acción que retorna la información del usuario autenticado.**

---

```python
        serializer = self.get_serializer(user)
```

**Serializa al usuario.**

---

```python
        grupos = list(user.groups.values_list('name', flat=True))
```

**Obtiene los nombres de los grupos a los que pertenece el usuario (por ejemplo, “admin”, “vendedor”).**

---

```python
        data = serializer.data
        data['groups'] = grupos
```

**Agrega la lista de grupos al JSON de respuesta.**

---

```python
        return Response(data)
```

Devuelve la información del usuario y sus grupos.

#### Acción personalizada: `verify_password`

```python
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def verify_password(self, request, **kwargs):
        password = request.data.get('password')
```

**Acción para verificar que el usuario autenticado ingresó su contraseña actual correctamente.**

---

```python
        if not password:
            return Response({'error': 'La contraseña es requerida'}, status=400)
```

**Si no se recibe una contraseña, devuelve un error.**

---

```python
        if check_password(password, request.user.password):
            return Response({'valid': True})
        else:
            return Response({'valid': False})
```

**Compara la contraseña recibida con la almacenada (hasheada). Devuelve si es válida o no.**

---

#### Acción personalizada: `logout`

```python
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request, **kwargs):
        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
```

**Acción para hacer logout. Crea una respuesta HTTP con mensaje de éxito.**

---

```python
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        response.delete_cookie('csrftoken')
```

**Elimina las cookies relacionadas al JWT y CSRF, cerrando la sesión del lado del navegador.**

---

## **`2.- class NotasView(viewsets.ModelViewSet):`**

```python
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

Establece los permisos:
- Usuarios autenticados pueden realizar operaciones de escritura (POST, PUT, DELETE).
- Los no autenticados solo pueden leer (GET).

---

#### Acción personalizada: `validar_numero`

```python
    @action(detail=False, methods=['get'], url_path='validar-numero')
```

Crea una acción personalizada accesible desde:

`GET /notas/validar-numero/`

- detail=False → no requiere ID (no apunta a una nota específica).

- url_path='validar-numero' → así se define el nombre de la URL.

```python
    def validar_numero(self, request):
        num_nota = request.query_params.get('num_nota')
```

**Extrae el parámetro num_nota desde la URL**

---

```python
        if not num_nota:
            return Response({'error': 'El número de nota es requerido'}, status=status.HTTP_400_BAD_REQUEST)
```

**Si no se proporciona num_nota, devuelve un error 400 con un mensaje.**

---

```python
        existe = Notas.objects.filter(num_nota=num_nota).exists()
```

**Consulta si ya existe una nota con ese número (.exists() es eficiente porque no carga objetos completos).**

---

```python
        return Response({'existe': existe})
```

**Devuelve la respuesta en formato JSON**

---

#### Acción personalizada: cliente_por_nota

```python
    @action(detail=False, methods=['get'], url_path='cliente_por_nota')
```

Crea un endpoint accesible en:

`GET /notas/cliente_por_nota/?nota=12345`

- detail=False → la acción no requiere ID de una nota.
- url_path='cliente_por_nota' → define la ruta final del endpoint.

```python
def cliente_por_nota(self, request):
    num_nota = request.query_params.get('nota')
```

**Obtiene el parámetro nota desde los query params**

```python
if not num_nota:
    return Response({'error': 'Debe proporcionar el número de nota.'}, status=status.HTTP_400_BAD_REQUEST)
```

- Si no se envía el parámetro nota, responde con 400 Bad Request.
- Se exige este parámetro para poder buscar la nota.

```python
nota = Notas.objects.get(num_nota=num_nota)
cliente = nota.cliente
```

- Busca una nota cuyo número coincida con num_nota.
- Luego obtiene el cliente asociado a la nota.

```python
if cliente:
    data = {
        'id_cliente': cliente.id_cliente,
        'razon_social': cliente.razon_social,
        'rut_cliente': cliente.rut_cliente,
        'direccion': cliente.direccion,
        'comuna': cliente.comuna,
        'telefono': cliente.telefono,
        'correo': cliente.correo,
        'contacto': cliente.contacto,
        'despacho_retira': nota.despacho_retira,
        'fecha_despacho': nota.fecha_despacho,
        'nota_id': nota.id_nota,
    }
    return Response(data, status=status.HTTP_200_OK)
```

**La respuesta incluye:**

- Datos completos del cliente
- Información adicional de la nota:
    - despacho_retira
    - fecha_despacho
    - id_nota

Devuelve HTTP 200 OK con toda la información.

## **`class ClientesView(viewsets.ModelViewSet):`**

```python
 def obtener_por_rut(self, request):
        rut = request.query_params.get('rut')
```

**Extrae el parámetro rut desde la URL (query string), por ejemplo:**

---

```python
        if not rut:
            return Response({'error': 'RUT es requerido'}, status=status.HTTP_400_BAD_REQUEST)
```

**Si no se envía un rut, devuelve un error 400 con un mensaje.**

---

```python
        try:
            cliente = Clientes.objects.get(rut_cliente=rut)
```

**Busca un cliente cuyo campo rut_cliente coincida exactamente con el valor del RUT.**

---

```python
# Manejo de métodos PUT/PATCH
            if request.method in ['PUT', 'PATCH']:
                partial = request.method == 'PATCH'  # True para PATCH, False para PUT
                serializer = self.get_serializer(cliente, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
```

**PUT: reemplaza todos los datos del cliente. PATCH: actualiza parcialmente. Se usa el serializer para validar y guardar.**

---

```python
         # Manejo del GET
            data = {
                'direccion': cliente.direccion,
                'comuna': cliente.comuna,
                'telefono': cliente.telefono,
                'correo': cliente.correo,
                'contacto': cliente.contacto,
                'razon_social': cliente.razon_social,
            }

```

**Retorna los datos principales del cliente como JSON.**

---

```python
    except Clientes.DoesNotExist:
        return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

**Si no se encuentra el cliente con el RUT especificado, devuelve un error 404 con un mensaje. Otros errores generales devuelven 400 con el mensaje.**

---

## **`class CookieTokenObtainPairView(TokenObtainPairView):`**

- Hereda de TokenObtainPairView de SimpleJWT, que se usa normalmente para loguear a un usuario y devolver los tokens (access y refresh).
- Esta versión modifica el comportamiento para guardar los tokens en cookies.

```python
    permission_classes = [AllowAny]
```

**Cualquier usuario, autenticado o no, puede acceder a esta vista (porque es el login).**

---

```python
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
```

**Ejecuta el comportamiento por defecto: valida usuario y devuelve tokens.**

---

```python
        refresh = response.data.get("refresh")
        access = response.data.get("access")
```

**Extrae los tokens generados por SimpleJWT desde el cuerpo de la respuesta.**

```python
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60 * 60,  # 1 hora
        )
```

**Guarda el access_token como una cookie segura:**

- httponly=True: el frontend no puede acceder al token con JavaScript.
- secure=True: solo se envía por HTTPS.
- samesite='None': Ya que son dos dominios diferentes el backend con el frontend.
- max_age=3600: expira en 1 hora.

---

```python
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=7 * 24 * 60 * 60,  # 7 días
        )
```

**Similar para el refresh_token, pero con un tiempo de vida más largo (7 días).**

---

```python
        response.set_cookie(
            key="csrftoken",
            value=get_token(request),
            httponly=False,
            secure=True,
            samesite='None',
            max_age=60 * 60,
        )
```

**Similar a los anteriores pero para el CSRF, con un tiempo de vida de 1 hora.**

```python
        response.data = {"message": "Login exitoso"}
        return response
```

**Modifica la respuesta JSON para no devolver los tokens en el cuerpo (más seguro), solo devuelve un mensaje.**

---

## **`class CookieTokenRefreshView(TokenRefreshView):`**

Hereda de TokenRefreshView, que se usa para renovar el access_token usando el refresh_token.

```python
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
```

**Toma el refresh_token desde la cookie, no desde el body del request.**

---

```python
        if refresh_token is None:
            return Response({"error": "Token de refresh no encontrado"}, status=401)
```

**Si no se encuentra el token, devuelve error 401 (no autorizado).**

---

```python
        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)
```

**Inserta el token en el request y llama al método original para que genere un nuevo access_token.**

---

```python
        if response.status_code != 200:
            return response
```

**Si hubo un error al refrescar, devuelve la respuesta original con el error.**

---

```python
        access = response.data.get("access")
```

**Toma el nuevo access_token desde la respuesta.**

---

```python
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60 * 60,  # 1 hora
        )
```

**Vuelve a guardar el nuevo access_token en la cookie.**

---

```python
        response.data = {"message": "Token refrescado exitosamente"}
        return response
```

**Devuelve solo un mensaje, no el token en el cuerpo.**

---

## **`class DashboardViewSet(viewsets.ViewSet):`**

Se usa para agrupar vistas lógicas bajo una sola ruta (como /dashboard/resumen/) para entregar un resumen estadístico del sistema en un rango de fechas, usando Django REST Framework. 

```python
        fecha_inicio_str = request.query_params.get('fecha_inicio')
        fecha_fin_str = request.query_params.get('fecha_fin')
```

**Extrae los parámetros fecha_inicio y fecha_fin desde la query**

---

```python
        if not fecha_inicio_str or not fecha_fin_str:
            return Response(
                {'error': 'Se requieren ambos parámetros: fecha_inicio y fecha_fin'},
                status=400
            )
```

**Verifica que ambos parámetros estén presentes.**

---

```python
        fecha_inicio = make_aware(datetime.strptime(fecha_inicio_str + ' 00:00:00', '%Y-%m-%d %H:%M:%S'))
        fecha_fin = make_aware(datetime.strptime(fecha_fin_str + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
```

**Convierte los strings a datetime, asegurándose de incluir todo el día (inicio 00:00, fin 23:59).**

- make_aware agrega la zona horaria de Django.

---


```python
       if fecha_fin < fecha_inicio:
                return Response(
                    {'error': 'La fecha de fin no puede ser anterior a la fecha de inicio'},
                    status=400
                )
```

**Impide que se consulten rangos de fechas inválidos (fin antes del inicio).**

---

```python
        notas_filtro = Q(fecha_despacho__gte=fecha_inicio) & Q(fecha_despacho__lte=fecha_fin)
```

**Construye una expresión de filtro Q para filtrar las notas por el campo fecha_despacho.**

---

```python
        total_notas = Notas.objects.filter(notas_filtro).count()
```

**Cuenta el total de notas en el período.**

---

```python
        notas_por_despacho = Notas.objects.filter(notas_filtro).values(
            'despacho_retira'
        ).annotate(
            total=Count('id_nota')
        ).order_by('-total')
```

1. Notas.objects.filter(notas_filtro)

    - Base de la consulta: Parte del modelo Notas y aplica un filtro predefinido (notas_filtro)
    - El filtro notas_filtro limita qué registros se incluirán

2. .values('despacho_retira')

    - Agrupación: Selecciona solo el campo despacho_retira para trabajar
    - Esto agrupará los resultados por los distintos valores de despacho_retira
    - Equivalente SQL: GROUP BY despacho_retira

3. .annotate(total=Count('id_nota'))

    - Conteo: Para cada grupo (cada valor único de despacho_retira), cuenta cuántos registros hay
    - Count('id_nota') cuenta las ocurrencias usando el campo id_nota 
    - El resultado se almacena en un campo temporal llamado total
    - Equivalente SQL: COUNT(id_nota) AS total

4. .order_by('-total')

    - Ordenamiento: Ordena los resultados por el campo total en orden descendente (por el -)
    - Los despachos con más notas aparecerán primero

---

```python
        notas_por_dia = Notas.objects.filter(
            notas_filtro & Q(fecha_despacho__isnull=False)
        ).annotate(
            dia=Cast('fecha_despacho', DateField())
        ).values('dia').annotate(
            total=Count('id_nota')
        ).order_by('dia')
```

**Agrupa por día usando Cast para truncar datetime a solo date.**

**Cuenta cuántas notas se emitieron por día.**

---

```python
         # Notas por comuna
            notas_por_comuna = Notas.objects.filter(notas_filtro).exclude(
                cliente__comuna__isnull=True
            ).values(
                'cliente__comuna', 'despacho_retira'
            ).annotate(
                total=Count('id_nota')
            ).order_by('-total')
```

**Agrupa por comuna del cliente y tipo de despacho.**

**Ignora clientes sin comuna.**

---

```python
        response_data = {
            'notas': {
                'total': total_notas,
                'por_estado': list(notas_por_despacho),
                'por_dia': [{
                    'day': item['dia'].strftime('%Y-%m-%d') if item['dia'] else 'Fecha no disponible',
                    'total': item['total']
                } for item in notas_por_dia],
            },
            'comunas': {
                'resumen': list(notas_por_comuna),
            }
        }
```

**Crea un diccionario estructurado para enviar como JSON de respuesta.**

---

```python
        logger.debug(f"Datos del dashboard: {response_data}")
        return Response(response_data)
```

**Devuelve el resultado al cliente.**

---

```python
    except ValueError as e:
        logger.error(f"Error en formato de fecha: {str(e)}")
        return Response(
            {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
            status=400
        )
```

**Si datetime.strptime falla (por mal formato), devuelve error 400.**

---

```python
    except Exception as e:
        logger.error(f"Error en dashboard/resumen: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Error interno del servidor: {str(e)}'},
            status=500
        )
```

**Cualquier otro error devuelve error 500 y se loggea con exc_info=True.**

---

## ProductosView

```python
class ProductosView(viewsets.ModelViewSet):
    serializer_class = ProductosSerializer
    queryset = Productos.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='por-codigo')
    def obtener_por_codigo(self, request):
        codigo = request.query_params.get('codigo')
        if not codigo:
            return Response({'error': 'Código es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            producto = Productos.objects.get(codigo=codigo)
            
            # Manejo de métodos PUT/PATCH
            if request.method in ['PUT', 'PATCH']:
                partial = request.method == 'PATCH'  # True para PATCH, False para PUT
                serializer = self.get_serializer(producto, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
            
            # Manejo del GET
            data = {
                'id_producto': producto.id_producto,
                'nombre': producto.nombre,
                'codigo': producto.codigo,
                'descripcion': producto.descripcion,
                'precio': producto.precio_venta,
                'stock': producto.stock,
                'categoria': producto.categoria,
                'unidad_medida': producto.unidad_medida,
                'precio_compra': producto.precio_compra,
            }
            return Response(data)
            
        except Productos.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

**Extracción del parámetro**

```python
codigo = request.query_params.get('codigo')
```

El método obtiene el parámetro codigo desde la URL

**Validación del parámetro**

```python
if not codigo:
    return Response({'error': 'Código es requerido'}, status=status.HTTP_400_BAD_REQUEST)
```

Si el código no fue entregado, responde con 400 Bad Request.

**Buscar el producto por código**

```python
producto = Productos.objects.get(codigo=codigo)
```

- Intenta obtener el producto usando el campo codigo.
- Si no existe, será capturado por la excepción Productos.DoesNotExist.

**Actualización**

```python
if request.method in ['PUT', 'PATCH']:
    partial = request.method == 'PATCH'
    serializer = self.get_serializer(producto, data=request.data, partial=partial)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
```

Explicación:

- Si llega un PUT, se requiere actualizar todos los campos.
- Si llega un PATCH, se permiten actualizaciones parciales.
- Se reutiliza el ProductosSerializer de la vista.

Respuesta: Se devuelve el producto actualizado en formato JSON.

*Este código:*

```python
    serializer = self.get_serializer(producto, data=request.data, partial=partial)
```

---

1.- self.get_serializer(...)

get_serializer() es un método de ModelViewSet que:

- Obtiene automáticamente el serializer configurado en serializer_class.
- Aplica contexto adicional (como request, view, etc.).
- Permite reutilizar el mismo serializer sin tener que instanciarlo manualmente.

2.- Primer argumento: proveedor

El primer argumento es la instancia existente del modelo que se quiere actualizar.

Ejemplo:

- proveedor = Proveedores.objects.get(rut_proveedor=rut)
- Ese objeto se pasa al serializer para ser modificado.

Esto le dice al serializer:
*"Este objeto es el que quiero actualizar."*

3.- data=request.data

Aquí se le pasa la nueva información enviada por el cliente (generalmente desde un PUT o PATCH). 
El serializer usará estos datos para validar y actualizar el objeto existente.

4.-  partial=partial

Si es PATCH → partial=True

- La actualización es parcial
- Solo actualiza los campos enviados
- Los campos obligatorios NO son requeridos

Si es PUT → partial=False

- La actualización debe ser completa
- Todos los campos requeridos deben estar presentes
- Un PUT reemplaza el objeto entero

Esto le indica al serializer:

*"¿Debo actualizar solo lo enviado (PATCH) o validar todo el objeto completo (PUT)?"*

---

**Respuesta para método GET**

```python
data = {
    'id_producto': producto.id_producto,
    'nombre': producto.nombre,
    'codigo': producto.codigo,
    'descripcion': producto.descripcion,
    'precio': producto.precio_venta,
    'stock': producto.stock,
    'categoria': producto.categoria,
    'unidad_medida': producto.unidad_medida,
    'precio_compra': producto.precio_compra,
}
return Response(data)
```

En caso de GET:

- Devuelve la información básica del producto.
- No usa serializer para mayor eficiencia.

**Manejo de errores**

```python
except Productos.DoesNotExist:
    return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

- Si el producto no existe → HTTP 404.
- Cualquier otro error inesperado → HTTP 400.

---

## ProveedoresView

```python
class ProveedoresView(viewsets.ModelViewSet):
    serializer_class = ProveedoresSerializer
    queryset = Proveedores.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='por-rut')
    def obtener_por_rut(self, request):
        rut = request.query_params.get('rut')
        if not rut:
            return Response({'error': 'RUT es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            proveedor = Proveedores.objects.get(rut_proveedor=rut)
            
            # Manejo de métodos PUT/PATCH
            if request.method in ['PUT', 'PATCH']:
                partial = request.method == 'PATCH'  # True para PATCH, False para PUT
                serializer = self.get_serializer(proveedor, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
            
            # Manejo del GET
            data = {
                'id_proveedor': proveedor.id_proveedor,
                'razon_social': proveedor.razon_social,
                'rut_proveedor': proveedor.rut_proveedor,
            }
            return Response(data)
            
        except Proveedores.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

**Similar al ProductosView**

---

## PersonalView

```python
class PersonalView(viewsets.ModelViewSet):
    serializer_class = PersonalSerializer
    queryset = Personal.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], url_path='asignar-sabados')
    def asignar_sabados(self, request, pk=None):
        personal = self.get_object()
        fechas = request.data.get('sabados', [])

        if not isinstance(fechas, list):
            return Response(
                {'error': 'El campo "sabados" debe ser una lista de fechas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Crear o obtener sábados
                sabados_objs = []
                for fecha_str in fechas:
                    sabado, _ = Sabado.objects.get_or_create(fecha=fecha_str)
                    sabados_objs.append(sabado)

                # Obtener IDs de sábados existentes
                sabados_existentes = personal.sabados_trabajados.all()
                sabados_existentes_ids = set(sabados_existentes.values_list('sabado__id_sabado', flat=True))
                
                # Eliminar relaciones que ya no están
                personal.sabados_trabajados.exclude(sabado__in=sabados_objs).delete()
                
                # Crear nuevas relaciones
                nuevos_sabados = [
                    SabadoTrabajado(personal=personal, sabado=sabado)
                    for sabado in sabados_objs 
                    if sabado.id_sabado not in sabados_existentes_ids
                ]
                SabadoTrabajado.objects.bulk_create(nuevos_sabados)

                return Response({
                    'message': f'Sábados actualizados. {len(nuevos_sabados)} nuevos.'
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al actualizar sábados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    @action(detail=True, methods=['get'], url_path='sabados-trabajados')
    def obtener_sabados_trabajados(self, request, pk=None):
        personal = self.get_object()
        sabados = personal.sabados_trabajados.all().select_related('sabado')
        fechas = [s.sabado.fecha.strftime("%Y-%m-%d") for s in sabados]
        return Response({'sabados': fechas}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='historico-sabados')
    def historico_sabados(self, request):
        """
        Obtiene el histórico de sábados trabajados agrupados por mes y persona
        """
        # Obtener los últimos 6 meses de datos
        sabados_trabajados = (
            SabadoTrabajado.objects
            .filter(sabado__fecha__gte=timezone.now()-timedelta(days=180))
            .select_related('personal', 'sabado')
            .order_by('sabado__fecha', 'personal__nombre')
        )

        # Procesamiento para agrupar por mes y persona
        historico = defaultdict(lambda: defaultdict(list))
        
        for st in sabados_trabajados:
            mes = st.sabado.fecha.strftime('%Y-%m')  # Formato: AAAA-MM
            historico[mes][st.personal].append(st.sabado.fecha.strftime('%d-%m-%Y'))

        # Preparar respuesta estructurada
        response_data = []
        for mes, personal_data in sorted(historico.items(), reverse=True):
            for personal, sabados in sorted(personal_data.items(), key=lambda x: (x[0].apellido, x[0].nombre)):
                response_data.append({
                    'mes': mes,
                    'id_personal': personal.id_personal,
                    'nombre': personal.nombre,
                    'apellido': personal.apellido,
                    'sabados': sabados,
                    'total_sabados': len(sabados)
                })

        # Validar y serializar la respuesta
        serializer = HistoricoSabadosSerializer(response_data, many=True)
        return Response(serializer.data)
```

**Define el CRUD y permisos**

```python
serializer_class = PersonalSerializer
queryset = Personal.objects.all()
permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

- Usuarios autenticados → pueden crear, actualizar o eliminar.
- Usuarios no autenticados → solo lectura (GET).

### Acción personalizada: asignar_sabados

```python
@action(detail=True, methods=['post'], url_path='asignar-sabados')
```

Crea un endpoint accesible.

- detail=True → requiere un ID de persona.
- methods=['post'] → solo acepta POST.
- url_path='asignar-sabados' → define la URL final.

**Extracción de datos enviados por el cliente**

```python
personal = self.get_object()
fechas = request.data.get('sabados', [])
```

- self.get_object() retorna la instancia de Personal según el pk.
- Extrae la lista sabados del body del POST.

**Validación de formato**

```python
if not isinstance(fechas, list):
    return Response({'error': 'El campo "sabados" debe ser una lista de fechas.'}, status=400)
```

Se asegura de que sabados sea una lista.

**Bloque transaccional**

```python
with transaction.atomic():
```

Garantiza que todo el proceso se guarde o se revierta si ocurre un error.

**Crear o recuperar los objetos Sabado**

```python
sabados_objs = []
for fecha_str in fechas:
    sabado, _ = Sabado.objects.get_or_create(fecha=fecha_str)
    sabados_objs.append(sabado)
```

- Crea (o reutiliza) cada fecha de sábado.
- Los guarda en una lista para procesarlos después.

**Obtener sábados ya asignados**

```python
sabados_existentes = personal.sabados_trabajados.all()
sabados_existentes_ids = set(sabados_existentes.values_list('sabado__id_sabado', flat=True))
```

Permite comparar qué sábados ya estaban asociados al trabajador.

**Eliminar relaciones que ya no están**

```python
personal.sabados_trabajados.exclude(sabado__in=sabados_objs).delete()
```

Si un sábado ya no aparece en la nueva lista, se elimina la relación.

**Agregar nuevas relaciones**

```python
nuevos_sabados = [
    SabadoTrabajado(personal=personal, sabado=sabado)
    for sabado in sabados_objs 
    if sabado.id_sabado not in sabados_existentes_ids
]
SabadoTrabajado.objects.bulk_create(nuevos_sabados)
```

- Se generan solo las relaciones nuevas.
- Se guardan todas juntas usando bulk_create → mucho más eficiente.

**Respuesta**

```python
return Response({'message': f'Sábados actualizados. {len(nuevos_sabados)} nuevos.'})
```

Devuelve un mensaje indicando cuántos fueron agregados.

## Acción personalizada: obtener_sabados_trabajados

**Consulta simplificada**

```python
sabados = personal.sabados_trabajados.all().select_related('sabado')
```

select_related evita consultas adicionales al traer el objeto sabado.

**Formateo de fechas**

```python
fechas = [s.sabado.fecha.strftime("%Y-%m-%d") for s in sabados]
```

Devuelve un array de fechas en formato AÑO-MES-DÍA.

## Acción personalizada: historico_sabados

**Consulta de los últimos 180 días**

```python
sabados_trabajados = (
    SabadoTrabajado.objects
    .filter(sabado__fecha__gte=timezone.now()-timedelta(days=180))
    .select_related('personal', 'sabado')
    .order_by('sabado__fecha', 'personal__nombre')
)
```

**Agrupación por mes y persona**

```python
historico = defaultdict(lambda: defaultdict(list))
```

Genera estructura:

```python
{
  '2025-01': {
      PersonalObj: ['10-01-2025', '24-01-2025']
  },
  ...
}
```

**Construcción de la respuesta final**

```python
response_data.append({
    'mes': mes,
    'id_personal': personal.id_personal,
    'nombre': personal.nombre,
    'apellido': personal.apellido,
    'sabados': sabados,
    'total_sabados': len(sabados)
})
```

**Serialización final**

serializer = HistoricoSabadosSerializer(response_data, many=True)
return Response(serializer.data)

---

## PedidoMateriasPrimasView

```python
class PedidoMateriasPrimasView(viewsets.ModelViewSet):
    serializer_class = PedidoMateriasPrimasSerializer
    queryset = PedidoMateriasPrimas.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'], url_path='buscar-proveedores')
    def buscar_proveedores(self, request):
        q = request.GET.get('q', '')
        proveedores = Proveedores.objects.filter(razon_social__icontains=q)[:10]
        serializer = ProveedoresSerializer(proveedores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='buscar-productos')
    def buscar_productos(self, request):
        q = request.GET.get('q', '')
        productos = Productos.objects.filter(nombre__icontains=q)[:10]
        serializer = ProductosSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
```

**buscar_proveedores**

```python
  q = request.GET.get('q', '')
```

- Extrae el parámetro q de la URL
- Si no viene nada, usa string vacío ('').

```python
    proveedores = Proveedores.objects.filter(razon_social__icontains=q)[:10]
```

- Busca en la base datos coincidencias parciales.
- icontains → insensible a mayúsculas/minúsculas.
- [:10] → limita resultados a 10 → ideal para autocompletar.

```python
    serializer = ProductosSerializer(productos, many=True)
```

- Serializa la lista para devolverla como JSON.

```python
    return Response(serializer.data, status=status.HTTP_200_OK)
```

- Devuelve JSON con los proveedores encontrados.

--- 

## DocumentFacturasView

```python
class DocumentFacturasView(viewsets.ModelViewSet):
    serializer_class = DocumentFacturasSerializer
    queryset = DocumentFacturas.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

   
    @action(detail=False, methods=['get'], url_path='buscar-por-titulo')
    def buscar_por_titulo(self, request):
        q = request.GET.get('q', '')
        pdfs = DocumentFacturas.objects.filter(title__icontains=q)[:10]
        serializer = self.get_serializer(pdfs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Obtener el nombre del archivo del campo file_url
        file_key = instance.file_url.split(f"{os.getenv('AWS_STORAGE_BUCKET_NAME')}/")[-1]

        # Conexión a R2
        s3 = boto3.client(
            "s3",
            endpoint_url=os.getenv("AWS_S3_ENDPOINT_URL"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )

        try:
            s3.delete_object(Bucket=os.getenv("AWS_STORAGE_BUCKET_NAME"), Key=file_key)
            print(f"✅ Archivo eliminado de R2: {file_key}")
        except Exception as e:
            print(f"⚠️ Error al eliminar en R2: {e}")

        # Finalmente elimina el registro en la base de datos
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

**buscar_por_titulo**

```python
  q = request.GET.get('q', '')
```

- Extrae el parámetro q de la URL
- Si no viene nada, usa string vacío ('').

```python
    pdfs = DocumentFacturas.objects.filter(title__icontains=q)[:10]
```

- Busca en la base datos coincidencias parciales.
- icontains → insensible a mayúsculas/minúsculas.
- [:10] → limita resultados a 10 → ideal para autocompletar.

```python
   serializer = self.get_serializer(pdfs, many=True)
```

- Serializa la lista para devolverla como JSON.

```python
    return Response(serializer.data, status=status.HTTP_200_OK)
```

- Devuelve JSON con los pdfs encontrados.

**destroy**

Se sobreescribe este método para agregar la lógica de borrar archivos del storage

```python
instance = self.get_object()
file_key = instance.file_url.split(f"{os.getenv('AWS_STORAGE_BUCKET_NAME')}/")[-1]
```

- Obtiene la instancia a eliminar
    -Obtiene el queryset definido en tu view (o lo que devuelva get_queryset()).
    - Lee el lookup field (por defecto pk) desde la URL.
    - Hace un query a la base de datos para obtener ese objeto.
    - Si no lo encuentra → lanza automáticamente un 404 (NotFound).
    - Aplica permisos y filtros si existen.

- Extrae el nombre del archivo de la URL de R2.
- file_url normalmente contiene algo como:
    - https://bucket/nombre-archivo.pdf
    - Esta línea separa para obtener el 'Key' que S3 necesita

```python
s3 = boto3.client(
            "s3",
            endpoint_url=os.getenv("AWS_S3_ENDPOINT_URL"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
```

Se crea un cliente S3, es decir, un objeto que permite ejecutar comandos contra S3

- Crea una conexión hacia el bucket S3/R2,
- Usando las credenciales
- Con la URL base configurada

```python
  try:
            s3.delete_object(Bucket=os.getenv("AWS_STORAGE_BUCKET_NAME"), Key=file_key)
            print(f"✅ Archivo eliminado de R2: {file_key}")
        except Exception as e:
            print(f"⚠️ Error al eliminar en R2: {e}")
```

Se elimina el archivo del bucket 

```python
 self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

Borra el registro en la BD

---

## NotaProductoView

```python
class NotaProductoView(viewsets.ModelViewSet):
    """
    ViewSet para manejar NotaProducto.
    - CRUD de NotaProducto
    - Subida de Excel para cargar/actualizar datos
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = NotaProducto.objects.all()
    serializer_class = NotaProductoSerializer


    @action(detail=False, methods=['post'], url_path='upload_excel')
    def upload_excel(self, request):
        """
        Sube un Excel con columnas [numnota, cod_articu, pend] y
        lo guarda en la tabla NotaProducto (crea o actualiza).
        """
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No se recibió archivo"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            columnas_necesarias = ['numnota', 'cod_articu', 'pend']
            df = pd.read_excel(file, usecols=columnas_necesarias)

            registros_procesados = 0
            for _, row in df.iterrows():

                num_nota_excel = int(row['numnota'])
                cod_articu_excel = str(row['cod_articu']).strip()
                cantidad = int(row['pend'])

                try:
                   
                    nota = Notas.objects.get(num_nota=num_nota_excel)
                    producto = Productos.objects.get(codigo=cod_articu_excel)

                    obj, created = NotaProducto.objects.update_or_create(
                        nota=nota,
                        producto=producto,
                        defaults={
                            'cantidad': cantidad,
                            'usuario_creacion': request.user, 
                            'usuario_modificacion': request.user
                            }
                    )
                    if created:
                        obj.usuario_creacion = request.user
                        obj.save()
                    registros_procesados += 1

                except (Notas.DoesNotExist, Productos.DoesNotExist):
                    # Si no existe la nota o el producto, se omite
                    continue

            return Response(
                {"msg": f"Archivo procesado correctamente. {registros_procesados} registros cargados/actualizados."},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Error al procesar el archivo: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
```

**upload_excel**

Carga un archivo Excel para crear o actualizar registros de NotaProducto.

Descripción

Este endpoint recibe un archivo Excel con columnas:

- numnota → Número de nota asociada.
- cod_articu → Código del producto.
- pend → Cantidad pendiente.

Por cada fila, el sistema:

- Verifica si existe la Nota (Notas) y el Producto (Productos).
- Crea o actualiza el registro en NotaProducto mediante update_or_create.
- Registra el usuario que carga o modifica el registro.
- Omite filas cuyo producto o nota no existan.

```python
try:
            columnas_necesarias = ['numnota', 'cod_articu', 'pend']
            df = pd.read_excel(file, usecols=columnas_necesarias)

            registros_procesados = 0
            for _, row in df.iterrows():

                num_nota_excel = int(row['numnota'])
                cod_articu_excel = str(row['cod_articu']).strip()
                cantidad = int(row['pend'])
```

- Lee el archivo Excel enviado por el usuario (file).
- Pandas (pd) interpreta el archivo y lo convierte en un DataFrame (una tabla en memoria).
- usecols=columnas_necesarias indica que solo debe leer estas columnas
- df.iterrows() devuelve cada fila del DataFrame una por una.
- Cada vuelta del for entrega:
    - _: índice de la fila (se ignora con _ porque no se usa).
    - row: un objeto tipo Serie con los valores de la fila.
- Obtiene el valor de la columna numnota.
- Lo convierte a entero, porque los modelos del sistema probablemente esperan int.
- Convierte a string (por si Excel lo interpreta como número).
- strip() elimina espacios en blanco antes y después, para evitar errores

```python
if created:
    obj.usuario_creacion = request.user
    obj.save()
    registros_procesados += 1

    except (Notas.DoesNotExist, Productos.DoesNotExist):
        # Si no existe la nota o el producto, se omite
        continue
```

**if created:**
Esta variable viene desde update_or_create().

update_or_create retorna: (objeto, created)

- donde:
    - created = True	El registro NO existía → se creó uno nuevo.
    - created = False	El registro existía → solo se actualizó.

Entonces este if es para ejecutar un código solo cuando el registro es nuevo.

**obj.usuario_creacion = request.user**

- Se asigna el usuario autenticado que está realizando la carga del Excel.
- Esto solo se hace si es un objeto nuevo, porque:
    - usuario_creacion debe representar quién creó el registro.
    - Si se está actualizando (created=False), no corresponde cambiar el usuario de creación.

**obj.save()**

- Guarda en base de datos el cambio del campo usuario_creacion.
- Aunque update_or_create ya guardó el registro, este segundo .save() se necesita porque se está modificando un campo adicional (usuario_creacion) después de la creación.

**continue**

- Hace que el bucle for pase inmediatamente al siguiente registro del Excel.
- No ejecuta lo que queda dentro del ciclo.
- En este caso, significa:
“Este registro no es válido → saltarlo y seguir con el siguiente”.

---