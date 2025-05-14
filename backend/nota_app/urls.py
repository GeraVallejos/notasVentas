from django.urls import path, include
from rest_framework import routers
from .views import UsuarioView, NotasView

router = routers.DefaultRouter()
router.register(r'usuario', UsuarioView, 'usuario')
router.register(r'nota', NotasView, 'nota')

# URLs para acciones personalizadas
usuario_extra_routes = [
    path('usuario/actual/', UsuarioView.as_view({'get': 'actual'}), name='usuario-actual'),
    path('usuario/verify-password/', UsuarioView.as_view({'post': 'verify_password'}), name='verify-password'),
    path('usuario/logout/', UsuarioView.as_view({'post': 'logout'}), name='logout'),
]

urlpatterns = [
    path('', include(router.urls)),
    *usuario_extra_routes,
]