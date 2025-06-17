from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from . serializer import NotasSerializer
from . models import Clientes

User = get_user_model()

class NotasSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='juan', password='1234')
        self.factory = RequestFactory()
        self.request = self.factory.post('/notas/')
        self.request.user = self.user

    def test_nota_serializer_crea_nota_valida(self):
        data = {
            "num_nota": "123",
            "fecha_despacho": "2026-06-13 12:00",
            "razon_social": "Empresa X",
            "rut_cliente": "12345678-9",
            "contacto": "Pedro",
            "correo": "empresa@correo.com",
            "direccion": "Calle Falsa 123",
            "comuna": "Santiago",
            "telefono": "123456789",
            "guardar_cliente": False
        }

        serializer = NotasSerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        nota = serializer.save()
        self.assertEqual(nota.razon_social, "Empresa X")
        self.assertEqual(nota.id_usuario, self.user)

    def test_nota_serializer_crea_cliente_si_no_existe(self):
        data = {
            "num_nota": "456",
            "fecha_despacho": "2026-06-13 13:00",
            "razon_social": "Cliente Nuevo S.A.",
            "rut_cliente": "99999999-9",
            "contacto": "María",
            "correo": "maria@cliente.com",
            "direccion": "Av. Siempre Viva 742",
            "comuna": "Providencia",
            "telefono": "987654321",
            "guardar_cliente": True
        }

        serializer = NotasSerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        nota = serializer.save()

        # Verifica que la nota se creó correctamente
        self.assertEqual(nota.rut_cliente, "99999999-9")
        self.assertEqual(nota.id_usuario, self.user)

        # Verifica que se haya creado también el cliente
        cliente = Clientes.objects.get(rut_cliente="99999999-9")
        self.assertEqual(cliente.razon_social, "Cliente Nuevo S.A.")
        self.assertEqual(cliente.id_usuario, self.user)