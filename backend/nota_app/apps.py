from django.apps import AppConfig


class NotaAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'nota_app'

    def ready(self):
        import os
        from django.conf import settings
        os.makedirs(os.path.join(settings.MEDIA_ROOT, "facturas"), exist_ok=True)