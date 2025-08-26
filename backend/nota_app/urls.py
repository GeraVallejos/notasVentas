from django.urls import path, include
from rest_framework import routers
from .views import UsuarioView, NotasView, ClientesView, DashboardViewSet, CSRFTokenView, ProductosView, ProveedoresView, PersonalView, PedidoMateriasPrimasView, PDFDocumentFacturasView


router = routers.DefaultRouter()
router.register(r'usuario', UsuarioView, 'usuario')
router.register(r'nota', NotasView, 'nota')
router.register(r'cliente', ClientesView, 'cliente')
router.register(r'dashboard', DashboardViewSet, 'dashboard')
router.register(r'productos', ProductosView, 'productos')
router.register(r'proveedores', ProveedoresView, 'proveedores')
router.register(r'personal', PersonalView, 'personal')
router.register(r'pedido_materias_primas', PedidoMateriasPrimasView, 'pedido_materias_primas')
router.register(r'pdf-facturas', PDFDocumentFacturasView, 'pdf-facturas')

# URLs para acciones personalizadas
usuario_extra_routes = [
    path('usuario/actual/', UsuarioView.as_view({'get': 'actual'}), name='usuario-actual'),
    path('usuario/verify-password/', UsuarioView.as_view({'post': 'verify_password'}), name='verify-password'),
    path('usuario/logout/', UsuarioView.as_view({'post': 'logout'}), name='logout'),
]

urlpatterns = [
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('', include(router.urls)),
    *usuario_extra_routes,
] 
