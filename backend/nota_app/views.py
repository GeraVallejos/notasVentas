from rest_framework import viewsets
from .serializer import UsuariosSerializer, NotasSerializer, ClientesSerializer
from .models import Usuarios, Notas, Clientes
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Count, Q
from datetime import datetime
from django.db.models.functions import TruncDate
import logging
from datetime import datetime
from django.utils.timezone import make_aware
from django.db.models import DateField
from django.db.models.functions import Cast, Trunc

logger = logging.getLogger(__name__)


# Create your views here.

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
        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
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


class ClientesView(viewsets.ModelViewSet):
    serializer_class = ClientesSerializer
    queryset = Clientes.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'], url_path='por-rut')
    def obtener_por_rut(self, request):
        rut = request.query_params.get('rut')
        if not rut:
            return Response({'error': 'RUT es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cliente = Clientes.objects.get(rut_cliente=rut)
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
            samesite='Lax',
            max_age=60 * 60,  # 1 hora
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60,  # 7 días
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
            samesite='Lax',
            max_age=60 * 60,  # 1 hora
        )

        response.data = {"message": "Token refrescado exitosamente"}
        return response


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
                comuna__isnull=True
            ).values(
                'comuna', 'estado_solicitud'
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