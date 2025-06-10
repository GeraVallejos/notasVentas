# Carpeta de proyecto `__pycache__`

En un proyecto Django (y en general en cualquier proyecto de Python), la carpeta __pycache__ es un directorio que Python crea automáticamente para almacenar archivos de bytecode compilado (con extensión .pyc o .pyo) de los módulos importados.

### ¿Para qué sirve?
1. Optimización de rendimiento:  
Cuando Python importa un módulo (por ejemplo, models.py, views.py, etc.), compila el código fuente a un formato intermedio llamado bytecode para acelerar futuras importaciones. Este bytecode se guarda en __pycache__ para evitar tener que recompilar el código cada vez que se importa.

2. Ahorro de tiempo:  
En proyectos grandes con muchos módulos, recompilar constantemente el código sería lento. Al guardar el bytecode, Python puede cargar los módulos más rápido en ejecuciones posteriores.

### Características importantes:

- Se crea una carpeta __pycache__ en cada directorio que contenga módulos Python importados.
- Los archivos dentro tienen nombres como:
<pre>
<code>
nombre_del_modulo.cpython-XX.pyc
(donde XX es la versión de Python, ej. cpython-38 para Python 3.8)
</code>
</pre>

- Django no necesita esta carpeta para funcionar, es solo una optimización de Python.
- Puede ser eliminada manualmente sin problemas (Python la recreará cuando sea necesario)
- No debe ser incluida en Git

### ¿Por qué aparece en Django?

Django usa muchos módulos Python internamente (modelos, vistas, configuraciones, etc.), por lo que __pycache__ se genera automáticamente al ejecutar comandos como runserver, migrate, o al importar cualquier archivo .py.