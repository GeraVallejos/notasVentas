import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nota_ventas.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model
from django.db import connection

def run_migrations():
    """Ejecutar migraciones de Django"""
    print("Ejecutando migraciones...")
    try:
        # Ejecutar makemigrations y migrate
        execute_from_command_line(['manage.py', 'migrate', '--noinput'])
        print("Migraciones aplicadas correctamente.")
    except Exception as e:
        print(f"Error en migraciones: {e}")

def create_superuser():
    """Crear superusuario si no existe"""
    User = get_user_model()

    username = os.getenv('USERNAME')
    email = os.getenv('EMAIL')
    password = os.getenv('PASSWORD')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superusuario creado correctamente.")
    else:
        print("El superusuario ya existe.")

def check_database_connection():
    """Verificar conexión a la base de datos"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("Conexión a la base de datos exitosa.")
        return True
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")
        return False

if __name__ == "__main__":
    print("Iniciando script de configuración...")
    
    # Verificar conexión a la base de datos
    if check_database_connection():
        run_migrations()
        create_superuser()
    else:
        print("No se pudo conectar a la base de datos. Abortando.")