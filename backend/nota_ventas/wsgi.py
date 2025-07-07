"""
WSGI config for nota_ventas project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nota_ventas.settings')

application = get_wsgi_application()

# Ruta ABSOLUTA para staticfiles (Railway usa /app como raíz del contenedor)
STATIC_ROOT = '/app/backend/staticfiles' if os.getenv('IS_PRODUCTION') == 'True' else os.path.join(os.path.dirname(__file__), '..', 'staticfiles')
application = WhiteNoise(application, root=STATIC_ROOT)
