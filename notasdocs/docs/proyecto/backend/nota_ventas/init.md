# Archivo `__init__.py`

Este archivo se ubica en el directorio principal del proyecto Django. Su propósito es inicializar configuraciones necesarias para el correcto funcionamiento del entorno de Django, en este caso, establecer el uso de `pymysql` como reemplazo del conector `MySQLdb`.

## Contenido del Archivo
<pre>
<code>
import pymysql
pymysql.install_as_MySQLdb()
</code>
</pre>

### Explicación
import pymysql: Importa la biblioteca pymysql, un cliente MySQL escrito en Python puro que se puede usar como reemplazo del tradicional MySQLdb.

pymysql.install_as_MySQLdb(): Este método indica a Django (u otras librerías que esperan encontrar MySQLdb) que usen pymysql como si fuera MySQLdb. Es necesario porque Django por defecto intenta usar MySQLdb, que no siempre está disponible o compatible en todos los entornos (especialmente en Windows).

### ¿Por qué se hace esto?
Django tiene compatibilidad nativa con MySQLdb, pero esta biblioteca no siempre es fácil de instalar o compatible en algunos sistemas operativos. pymysql es más fácil de instalar (por ejemplo, usando pip install pymysql) y funciona bien como reemplazo. Al hacer esta instalación desde __init__.py, nos aseguramos de que Django lo reconozca automáticamente al arrancar el proyecto.

### Requisitos
Tener pymysql instalado en el entorno:

<pre>
<code>
pip install pymysql
</code>
</pre>

Y en settings.py de Django, se puede seguir usando 'ENGINE': 'django.db.backends.mysql' sin cambiar nada más, gracias a esta línea en __init__.py.


