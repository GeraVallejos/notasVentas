# Archivo `views.py`

### Importaciones

Algunas importaciones claves (no son todas las que estan presentes en el código original):

```python
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Count, Q
from datetime import datetime
import logging
from django.utils.timezone import make_aware
from django.db.models import DateField
from django.db.models.functions import Cast

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

```python
        try:
            cliente = Clientes.objects.get(rut_cliente=rut)
```

**Busca un cliente cuyo campo rut_cliente coincida exactamente con el valor del RUT.**

---

```python
            data = {
                'direccion': cliente.direccion,
                'comuna': cliente.comuna,
                'telefono': cliente.telefono,
                'correo': cliente.correo,
                'contacto': cliente.contacto,
                'razon_social': cliente.razon_social,
            }
```

**Extrae los campos más relevantes del cliente en un diccionario para enviarlo como respuesta.**

---

```python
        except Clientes.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
```

**Si no se encuentra el cliente con el RUT especificado, devuelve un error 404 con un mensaje.**

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
            samesite='Lax',
            max_age=60 * 60,  # 1 hora
        )
```

**Guarda el access_token como una cookie segura:**

- httponly=True: el frontend no puede acceder al token con JavaScript.
- secure=True: solo se envía por HTTPS.
- samesite='Lax': ayuda a prevenir CSRF.
- max_age=3600: expira en 1 hora.

---

```python
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60,  # 7 días
        )
```

**Similar para el refresh_token, pero con un tiempo de vida más largo (7 días).**

---

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
            samesite='Lax',
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

Se usa para agrupar vistas lógicas bajo una sola ruta (como /dashboard/resumen/).

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
        notas_por_comuna = Notas.objects.filter(notas_filtro).exclude(
            comuna__isnull=True
        ).values(
            'comuna', 'estado_solicitud'
        ).annotate(
            total=Count('id_nota')
        ).order_by('-total')
```

**Agrupa por comuna y estado_solicitud (ej. "entregado", "pendiente").**

**Devuelve una lista con el total por cada combinación.**

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