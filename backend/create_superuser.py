import os
import django
from dotenv import load_dotenv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nota_ventas.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.getenv('USERNAME')
email =  os.getenv('EMAIL')
password =  os.getenv('PASSWORD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print("Superusuario creado correctamente.")
else:
    print("El superusuario ya existe.")
