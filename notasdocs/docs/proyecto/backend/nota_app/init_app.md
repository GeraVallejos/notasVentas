# Archivo `__init__.py`

Es un archivo que marca un directorio como un paquete Python. Su presencia le indica a Python que no es solo una carpeta común, sino un módulo/paquete que puede ser importado desde otros lugares.

- Esta vacío
- Por este archivo se pueden hacer imports. Sin el, Python no reconoce la App como un paquete y los imports fallarán

```python
from mi_app.models import MiModelo  # Funciona porque mi_app es un paquete
```

- Si se borra no se iniciará la aplicación correctamente. Es posible crear el mismo archivo vacío para recuperar el funcionamiento