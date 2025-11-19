from rest_framework import viewsets, status
from django.db import transaction
from .serializer import UsuariosSerializer, NotasSerializer, ClientesSerializer, ProductosSerializer, ProveedoresSerializer, PersonalSerializer, HistoricoSabadosSerializer, PedidoMateriasPrimasSerializer, DocumentFacturasSerializer, NotaProductoSerializer
from .models import Usuarios, Notas, Clientes, Productos, Proveedores, Personal, Sabado, SabadoTrabajado, PedidoMateriasPrimas, DocumentFacturas, NotaProducto
import pandas as pd
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
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
from datetime import timedelta
from django.utils import timezone
from collections import defaultdict
import boto3
import os

logger = logging.getLogger(__name__)


class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuariosSerializer
    queryset = Usuarios.objects.all()

    def get_permissions(self):
        if self.action in ['actual', 'verify_password', 'logout']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def actual(self, request, **kwargs):
        user = self.request.user  # Usuario autenticado
        serializer = self.get_serializer(user)
    
        # Obtener nombres de grupos del usuario
        grupos = list(user.groups.values_list('name', flat=True))
    
        data = serializer.data
        data['groups'] = grupos  # agregar grupos a la respuesta
        return Response(data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def verify_password(self, request, **kwargs):
        password = request.data.get('password')
        
        if not password:
            return Response({'error': 'La contraseña es requerida'}, status=400)
        
        if check_password(password, request.user.password):
            return Response({'valid': True})
        else:
            return Response({'valid': False})
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request, **kwargs):

        # 1. Tomamos el refresh token desde la cookie
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            try:
                # 2. Convertimos a objeto RefreshToken para invalidarlo
                token = RefreshToken(refresh_token)
                token.blacklist()  # Invalida el token globalmente
            except Exception:
                # Si está dañado o ya invalidado, se ignora
                pass


        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        response.delete_cookie('csrftoken')
        return response
        
class NotasView(viewsets.ModelViewSet):
    serializer_class = NotasSerializer
    queryset = Notas.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'], url_path='validar-numero')
    def validar_numero(self, request):
        num_nota = request.query_params.get('num_nota')
        if not num_nota:
            return Response({'error': 'El número de nota es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        existe = Notas.objects.filter(num_nota=num_nota).exists()
        return Response({'existe': existe})
    
    @action(detail=False, methods=['get'], url_path='cliente_por_nota')
    def cliente_por_nota(self, request):
        num_nota = request.query_params.get('nota')

        # Validar parámetro
        if not num_nota:
            return Response({'error': 'Debe proporcionar el número de nota.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            nota = Notas.objects.get(num_nota=num_nota)
            cliente = nota.cliente

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
            else:
                return Response({'error': 'La nota no tiene cliente asociado.'}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'error': 'El número de nota debe ser un entero válido.'}, status=status.HTTP_400_BAD_REQUEST)
        except Notas.DoesNotExist:
            return Response({'error': 'No existe esa nota de venta.'}, status=status.HTTP_404_NOT_FOUND)


class ClientesView(viewsets.ModelViewSet):
    serializer_class = ClientesSerializer
    queryset = Clientes.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='por-rut')
    def obtener_por_rut(self, request):
        rut = request.query_params.get('rut')
        if not rut:
            return Response({'error': 'RUT es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cliente = Clientes.objects.get(rut_cliente=rut)
            
            # Manejo de métodos PUT/PATCH
            if request.method in ['PUT', 'PATCH']:
                partial = request.method == 'PATCH'  # True para PATCH, False para PUT
                serializer = self.get_serializer(cliente, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
            
            # Manejo del GET
            data = {
                'direccion': cliente.direccion,
                'comuna': cliente.comuna,
                'telefono': cliente.telefono,
                'correo': cliente.correo,
                'contacto': cliente.contacto,
                'razon_social': cliente.razon_social,
            }
            return Response(data)
            
        except Clientes.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get("refresh")
        access = response.data.get("access")

        # Configura las cookies
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60 * 60,  # 1 hora
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=7 * 24 * 60 * 60,  # 7 días
        )
        response.set_cookie(
            key="csrftoken",
            value=get_token(request),
            httponly=False,
            secure=True,
            samesite='None',
            max_age=60 * 60,
        )

        response.data = {"message": "Login exitoso"}
        return response
    

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token is None:
            return Response({"error": "Token de refresh no encontrado"}, status=401)

        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        # Si hubo error al refrescar el token
        if response.status_code != 200:
            return response

        access = response.data.get("access")

        # Setear nuevamente el access_token en la cookie
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60 * 60,  # 1 hora
        )

        response.data = {"message": "Token refrescado exitosamente"}
        return response

# Vista para generar el csrf Token
class CSRFTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return JsonResponse({'message': 'CSRF token set'})


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def resumen(self, request):
        try:
            # Obtener y validar parámetros de fecha
            fecha_inicio_str = request.query_params.get('fecha_inicio')
            fecha_fin_str = request.query_params.get('fecha_fin')
            
            if not fecha_inicio_str or not fecha_fin_str:
                return Response(
                    {'error': 'Se requieren ambos parámetros: fecha_inicio y fecha_fin'},
                    status=400
                )
            
            # Convertir a datetime para incluir toda la jornada
            fecha_inicio = make_aware(datetime.strptime(fecha_inicio_str + ' 00:00:00', '%Y-%m-%d %H:%M:%S'))
            fecha_fin = make_aware(datetime.strptime(fecha_fin_str + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))

            if fecha_fin < fecha_inicio:
                return Response(
                    {'error': 'La fecha de fin no puede ser anterior a la fecha de inicio'},
                    status=400
                )
            
            # Filtro base para notas usando datetime
            notas_filtro = Q(fecha_despacho__gte=fecha_inicio) & Q(fecha_despacho__lte=fecha_fin)
            
            # Estadísticas de notas
            total_notas = Notas.objects.filter(notas_filtro).count()
            
            # Notas por estado_solicitud
            notas_por_despacho = Notas.objects.filter(notas_filtro).values(
                'despacho_retira'
            ).annotate(
                total=Count('id_nota')
            ).order_by('-total')
            
            # Notas por día usando TruncDate para agrupar correctamente
            notas_por_dia = Notas.objects.filter(
                notas_filtro & Q(fecha_despacho__isnull=False)
            ).annotate(
                dia=Cast('fecha_despacho', DateField())
            ).values('dia').annotate(
                total=Count('id_nota')
            ).order_by('dia')
            
            
            # Notas por comuna
            notas_por_comuna = Notas.objects.filter(notas_filtro).exclude(
                cliente__comuna__isnull=True
            ).values(
                'cliente__comuna', 'despacho_retira'
            ).annotate(
                total=Count('id_nota')
            ).order_by('-total')

            
            # Preparar respuesta con manejo de valores None
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
            
            logger.debug(f"Datos del dashboard: {response_data}")
            return Response(response_data)
            
        except ValueError as e:
            logger.error(f"Error en formato de fecha: {str(e)}")
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
                status=400
            )
        except Exception as e:
            logger.error(f"Error en dashboard/resumen: {str(e)}", exc_info=True)
            return Response(
                {'error': f'Error interno del servidor: {str(e)}'},
                status=500
            )
        
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

    