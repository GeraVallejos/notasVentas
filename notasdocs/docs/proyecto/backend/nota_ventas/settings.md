# Archivo `settings.py`

Este archivo contiene la configuración básica para el proyecto **notaVentas**, creado con **Django 5.2.1**

## Configuración y explicación de los parámetros de settings

### <font color=#ad39dc>Importaciones</font>

#### import os

El módulo os de Python proporciona funciones para interactuar con el sistema operativo. En Django, se usa comúnmente en settings.py para manejar rutas de archivos, variables de entorno y otras operaciones relacionadas con el sistema.

#### from dotenv import load_dotenv

python-dotenv es una librería que carga variables de entorno desde un archivo .env (similar a lo que hace Django con settings.py, pero de forma más segura y configurable). Esto es útil para:

- Evitar hardcodear contraseñas, claves de API u otra información sensible directamente en el código.
- Mantener configuraciones separadas por entorno (desarrollo, producción, testing).

#### from datetime import timedelta

timedelta es una clase de Python que representa una duración (diferencia entre dos fechas o tiempos). En Django, se usa frecuentemente para configuraciones relacionadas con tiempos, como:

- Sesiones de usuario: SESSION_COOKIE_AGE = timedelta(days=30).
- Tokens JWT: Si se usa librerías como djangorestframework-simplejwt, se configura la expiración del token:

#### from pathlib import Path

pathlib es un módulo introducido en Python 3.4 (PEP 428) que proporciona una interfaz más intuitiva y legible para trabajar con rutas del sistema de archivos, en comparación con el antiguo enfoque de os.path.

Ventajas sobre os.path:
- Sintaxis más clara y orientada a objetos.
- Métodos encadenables (ej: Path().joinpath().resolve()).
- Soporte multiplataforma (Windows, Linux, macOS) sin preocuparse por barras / o \.

### <font color=#ad39dc> load_dotenv()</font>

Se debe instalar esta libreria pip install python-dotenv

La línea load_dotenv() en el archivo settings.py de un proyecto Django tiene una función clave: cargar variables de entorno desde un archivo .env al entorno de ejecución de Python. Esto es especialmente útil para manejar configuraciones sensibles (como claves secretas, credenciales de bases de datos, etc.) sin hardcodearlas directamente en el código.

#### ¿Qué hace exactamente?

- Busca un archivo .env en el directorio raíz del proyecto (o en la ruta que se le indique).
- Lee las variables definidas en ese archivo (ej: SECRET_KEY=abc123).
- Las carga en el entorno de Python, haciéndolas accesibles via os.getenv() o os.environ.

### <font color=#ad39dc> IS_PRODUCTION</font>

Con esta variable de entorno se diferencia si el settings.py esta en produccion o desarrollo, siendo False su valor por defecto si es que no encuentra la variable en .env, luego se compara este valor con True, por lo que queda un valor booleano de True o False.

```python
IS_PRODUCTION = os.getenv('IS_PRODUCTION', 'False') == 'True'
```

### <font color=#ad39dc> BASE_DIR</font>

Define la raíz del proyecto, que es utilizada para la construcción de rutas dentro del mismo.
<font color='blue'>BASE_DIR = Path(__file__).resolve().parent.parent</font>

#### Explicación detallada:

1.- Path(\__file__)

\__file__ es una variable especial en Python que contiene la ruta del archivo actual (en este caso, settings.py).

Path() es el constructor de la clase Path de pathlib. Convierte la ruta del archivo en un objeto Path, que permite operaciones avanzadas con rutas.

Ejemplo:
Si settings.py está en:
/home/usuario/mi_proyecto/config/settings.py,
entonces Path(\__file__) crea un objeto Path que apunta a esa ruta.

2.- .resolve()

- Convierte la ruta en una ruta absoluta y resuelve cualquier referencia simbólica (como ./ o ../).
- Esto asegura que no haya ambigüedades en la ruta, independientemente de cómo se ejecute el script.

Ejemplo:
Si la ruta original era ./config/settings.py, .resolve() la convertirá en algo como:
/home/usuario/mi_proyecto/config/settings.py.

3.- .parent

- Devuelve el directorio padre de la ruta actual (equivalente a os.path.dirname()).
- Cada vez que llama a .parent, sube un nivel en la estructura de directorios.

Primer .parent:
Si la ruta era /home/usuario/mi_proyecto/config/settings.py,
después de .parent apuntará a:
/home/usuario/mi_proyecto/config/.

Segundo .parent:
Si aplicamos .parent nuevamente, subimos otro nivel:
/home/usuario/mi_proyecto/.

4.- Resultado final (BASE_DIR)

- Después de dos .parent, se obtiene la ruta base del proyecto Django (donde está manage.py).
- Esto es útil porque muchas configuraciones (como STATICFILES_DIRS, MEDIA_ROOT, etc.) usan BASE_DIR para construir rutas relativas.

#### Beneficios

- Flexibilidad: Así el proyecto puede moverse a otra ubicación sin romper las rutas.
- Multiplataforma: Path funciona correctamente en Windows, Linux y macOS (usa / o \ automáticamente).
- Legibilidad: Es más claro que usar os.path.join(os.path.dirname(...)).


### <font color=#ad39dc>SECRET_KEY</font>

La clave secreta utilizada en la producción para la seguridad de las sesiones y el manejo de cookies. Nunca se debe compartir esta clave.

El SECRET_KEY es una cadena aleatoria crítica que Django utiliza para proporcionar seguridad criptográfica al proyecto. Es generada automáticamente cuando se crea un nuevo proyecto Django con startproject.

Funciones principales:

- Seguridad de sesiones: Se usa para firmar las cookies de sesión
- Protección CSRF: Genera y verifica tokens CSRF
- Sistema de mensajes: Firma los mensajes flash
- Funciones criptográficas: Para generación de hashes y firmas
- Algunos backends de almacenamiento: Como signed_cookies

¿Cómo se utiliza?
Django usa internamente el SECRET_KEY en múltiples componentes sin que necesariamente se tenga que interactuar directamente con él.

#### Ejemplos:

- En el sistema de sesiones  
request.session['user_id'] = 42  # Se firma con SECRET_KEY

- En protección CSRF  
{% csrf_token %}  # El token generado usa SECRET_KEY

- En el sistema de mensajes  
messages.success(request, "Éxito!")  # El mensaje se firma

#### Buenas prácticas
- Nunca comprometerlo: No subir a repositorios públicos
- Entorno de producción: Usar diferentes keys para desarrollo y producción
- Rotación: Si se compromete, generar uno nuevo (pero afectará sesiones existentes)
- Almacenamiento seguro: Usar variables de entorno en producción:  
 

```python
import os  

SECRET_KEY = os.getenv('SECRET_KEY_DJANGO')
if IS_PRODUCTION and not SECRET_KEY:
    raise ValueError("SECRET_KEY_DJANGO debe estar definido en producción!")
```

### <font color=#ad39dc>DEBUG</font>

El modo debug es una configuración fundamental que afecta el comportamiento de la aplicación Django de varias formas importantes:

##### 1. Muestra información detallada de errores
Cuando ocurre un error, Django muestra una página completa con:

- El traceback completo
- Valores de variables locales
- Consultas SQL ejecutadas
- Configuración relevante

##### 2. Habilita herramientas de desarrollo
- Panel de debug (cuando se usa django-debug-toolbar)
- Listado de archivos estáticos
- Información detallada en consola

##### 3. Desactiva ciertas optimizaciones
- Las plantillas se recargan automáticamente al cambiar
- No se cachean ciertos elementos

##### 4. Permite archivos estáticos locales
- Django sirve archivos estáticos (CSS, JS) directamente
- No requiere configurar un servidor web separado (como Nginx)

##### Peligros de tener DEBUG = True en producción
⚠️ Nunca se debe activar DEBUG en producción porque:

- Expone información sensible (configuraciones, rutas de archivos)
- Permite ejecutar código Python a través de la consola de debug
- Muestra detalles de implementación que pueden ayudar a atacantes

##### ¿Qué ocurre cuando DEBUG=False?  
- Los errores muestran mensajes genéricos (500, 404)
- Se debe configurar ALLOWED_HOSTS
- Django no sirve archivos estáticos (se debe usar Whitenoise o servidor web)
- Se activan optimizaciones de rendimiento

### <font color=#ad39dc>ALLOWED_HOSTS</font>

Es una lista de strings que representa los nombres de host/dominios que el sitio Django puede servir. Cuando DEBUG=False (en producción), Django solo responderá a requests que incluyan un header Host que coincida con uno de los valores en esta lista.

- Seguridad: Previene ataques de HTTP Host header poisoning.
- Validación: Asegura que la aplicación solo responda a los dominios que se ha especificado.
- Requerimiento obligatorio: Cuando DEBUG=False, Django requiere que esta lista no esté vacía.

```python
ALLOWED_HOSTS = [h for h in os.getenv("ALLOWED_HOSTS", "").split(",") if h]
```

#### Buenas prácticas
- En desarrollo local se puede dejar vacío si DEBUG=True
- En producción siempre se debe especificar los dominios exactos
- Nunca usar ['*'] en producción a menos que sea absolutamente necesario
- Para entornos como Heroku, es necesario incluir el dominio de la plataforma

### <font color=#ad39dc>INSTALLED_APPS</font>

Es una lista/tupla que contiene los nombres de todas las aplicaciones Django que están activas en el proyecto. Incluye tanto aplicaciones integradas de Django como aplicaciones de terceros y las que se desarrollan por el usuario.

1. Registra aplicaciones: Le dice a Django qué componentes de aplicación deben ser incluidos en el proyecto
2. Habilita funcionalidades: Cada app registrada puede aportar:
    - Modelos de base de datos
    - Migraciones
    - Vistas (views)
    - Templates
    - Archivos estáticos
    - Comandos de gestión personalizados
3. Ordena la carga: Las apps se cargan en el orden especificado (importante para dependencias entre apps)

#### Aplicaciones importantes por defecto  
<font color='blue'>django.contrib.admin:</font> Interfaz de administración  
<font color='blue'>django.contrib.auth:</font> Sistema de autenticación  
<font color='blue'>django.contrib.contenttypes:</font> Framework para tipos de contenido  
<font color='blue'>django.contrib.sessions:</font> Manejo de sesiones  
<font color='blue'>django.contrib.messages:</font> Sistema de mensajes  
<font color='blue'>django.contrib.staticfiles:</font> Manejo de archivos estáticos  

### Aplicaciones externas

<font color='blue'>rest_framework:</font>

Framework para construir APIs REST en Django (serializadores, vistas, routers).

<font color='blue'>rest_framework_simplejwt:</font>

Implementación de autenticación JWT (tokens) para DRF. Maneja login, refresh tokens, expiraciones, etc.

<font color='blue'>rest_framework_simplejwt.token_blacklist:</font>

Permite “invalidar” tokens JWT (por ejemplo, al cerrar sesión) mediante un sistema de blacklist almacenado en DB.

<font color='blue'>corsheaders:</font>

Middleware para permitir CORS: que React (u otro front) pueda hacer peticiones a la API Django desde otro dominio o puerto.

<font color='blue'>axes:</font>

Sistema de seguridad para bloquear usuarios después de varios intentos fallidos de login.
Previene ataques de fuerza bruta.

<font color='blue'>import_export:</font>

Añade herramientas al admin para importar y exportar datos (CSV, XLS, JSON, etc.) directamente desde el panel de administración.

<font color='blue'>storages:</font>

Paquete de Django que permite manejar almacenamiento externo, principalmente para:

- Amazon S3
- Google Cloud Storage
- Azure
- Cloudflare R2

Se usa para subir archivos o estáticos a la nube.

<font color='blue'>csp:</font>

Implementa Content Security Policy, un sistema de seguridad que ayuda a prevenir ataques XSS, inyección de scripts y contenido malicioso.

Permite controlar:

- Qué scripts se pueden ejecutar
- De dónde pueden venir imágenes
- Si se permite inline JS
- Etc.

<font color='blue'>nota_app.apps.NotaAppConfig:</font>

La aplicación interna donde estan los modelos, views y lógica del proyecto.

##### Buenas prácticas

1. Orden recomendado:

    - Apps de Django core primero
    - Apps de terceros después
    - Las apps locales al final

2. Registrar las apps: Usar la configuración de la app (AppConfig) en lugar del nombre simple:  
<font color='blue'>'miapp.apps.MiappConfig'</font>  
3. Mantenimiento: Agregar nuevas apps cuando se instalen paquetes o se creen nuevas aplicaciones.
4. No eliminar apps core sin entender sus dependencias, ya que muchas características de Django dependen de ellas.

Esta configuración es esencial para que Django sepa qué componentes debe cargar y cómo deben interactuar entre sí en el proyecto.

### <font color=#ad39dc>MIDDLEWARE</font>

Es una lista de clases que procesan las solicitudes (requests) y respuestas (responses) globalmente antes de que lleguen a las vistas o después de que estas generen una respuesta. Actúa como una serie de capas intermedias que pueden modificar, validar o realizar acciones adicionales en cada petición HTTP.

Cada middleware se ejecuta en el orden definido en settings.py y puede realizar operaciones como:

- Procesar el request antes de que llegue a la vista (ej: autenticación, CORS, seguridad)
- Procesar la respuesta antes de enviarla al cliente (ej: compresión, cookies, headers)
- Manejar excepciones globalmente (ej: errores 404, 500)
- Modificar o añadir datos al request/response (ej: user session, idioma, timezone)

#### Estructura típica en settings.py
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'nota_app.middleware.JWTTokenFromCookieMiddleware',
    'csp.middleware.CSPMiddleware',
    'django.middleware.security.SecurityMiddleware', 
    'whitenoise.middleware.WhiteNoiseMiddleware',   
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### Descripcion de los middlewares instalados

<font color='blue'>corsheaders.middleware.CorsMiddleware</font>

Permite solicitudes desde otros dominios o puertos (CORS).
Es esencial para que React u otro frontend pueda llamar a la API.

<font color='blue'>nota_app.middleware.JWTTokenFromCookieMiddleware</font>

Middleware personalizado.
Toma el JWT almacenado en cookies HttpOnly, lo extrae y lo inserta en el header Authorization para que DRF pueda autenticar al usuario fácilmente.

<font color='blue'>csp.middleware.CSPMiddleware</font>

Habilita Content Security Policy.
Evita XSS, inyección de scripts y cargas de recursos no permitidos.

<font color='blue'>django.middleware.security.SecurityMiddleware</font>

Aplica capas importantes de seguridad:

- Forzar HTTPS
- HSTS
- Seguridad de headers (X-Content-Type-Options, etc.)

<font color='blue'>whitenoise.middleware.WhiteNoiseMiddleware</font>

Sirve archivos estáticos directamente desde Django en producción.
Ideal para Railway/Render/Heroku.
Incluye compresión, cacheo y versionado.

<font color='blue'>django.contrib.sessions.middleware.SessionMiddleware</font>

Manejo de sesiones basadas en cookies.
Guarda datos por usuario (carrito, preferencias, estado de login si no se usa JWT).

<font color='blue'>django.middleware.common.CommonMiddleware</font>

Funciones de conveniencia:
- Normalización de rutas
- Manejo de redirecciones sin slash
- Headers comunes HTTP

<font color='blue'>django.middleware.csrf.CsrfViewMiddleware</font>

Protección contra ataques CSRF.
Valida tokens en formularios y requests.

<font color='blue'>django.contrib.auth.middleware.AuthenticationMiddleware</font>

Carga automáticamente el usuario autenticado en request.user.
Requiere que SessionMiddleware esté antes.

<font color='blue'>axes.middleware.AxesMiddleware</font>

Monitorea intentos fallidos de login.
Bloquea usuarios o IPs si intentan fuerza bruta.

<font color='blue'>django.contrib.messages.middleware.MessageMiddleware</font>

Manejo de mensajes temporales (“flash messages”).
Usado principalmente en vistas del admin o formularios tradicionales.

<font color='blue'>django.middleware.clickjacking.XFrameOptionsMiddleware</font>

Previene ataques clickjacking.
Impide que el sitio se cargue dentro de un iframe no autorizado.

#### Buenas prácticas
- El orden importa: Algunos middleware dependen de otros (ej: SessionMiddleware debe ir antes que AuthenticationMiddleware)
- No abusar: Cada middleware añade overhead a cada petición
- Usar middleware de terceros solo si es necesario (ej: corsheaders, debug_toolbar)

### <font color=#ad39dc>ROOT_URLCONF</font>

- Define el archivo principal de URLs: Le dice a Django dónde encontrar las rutas (URL patterns) que debe usar para mapear las URLs a las vistas correspondientes.
- Punto de entrada para el enrutamiento: Cuando llega una solicitud HTTP, Django consulta este archivo para determinar qué vista debe ejecutarse.
- Por defecto, Django lo configura automáticamente al crear un proyecto, pero es posible modificarlo si se necesita un esquema de URLs más complejo.

### <font color=#ad39dc>TEMPLATES</font>

Define cómo el sistema de plantillas (templates) debe cargar y procesar los archivos HTML (o cualquier formato de plantilla) de la aplicación

- Define motores de plantillas: Es una lista de configuraciones que le indica a Django qué backend de plantillas usar (generalmente el de Django o Jinja2)
- Configura ubicaciones de templates: Especifica dónde buscar archivos de plantillas (en apps, directorios globales, etc.)
- Habilita funcionalidades adicionales: Como procesadores de contexto, autoescape (seguridad contra XSS), y opciones de depuración

```python
TEMPLATES = [  
        {  
        'BACKEND': 'django.template.backends.django.DjangoTemplates', # Motor de Django  
        'DIRS': [os.path.join(BASE_DIR, 'templates')], # Directorios globales  
        'APP_DIRS': True, # Busca templates dentro de cada app  
                'OPTIONS': {  
            'context_processors': [  
                # Procesadores de contexto (variables disponibles en todas las plantillas)  
                'django.template.context_processors.debug',  
                'django.template.context_processors.request',  
                'django.contrib.auth.context_processors.auth',  
                'django.contrib.messages.context_processors.messages',  
            ],
        },
    },
]
```

### <font color=#ad39dc>WSGI_APPLICATION</font>

Especifica qué aplicación WSGI (Web Server Gateway Interface) utilizará el proyecto para servir la aplicación web. WSGI es el estándar de Python para comunicar servidores web con aplicaciones web.

- Define la ruta hacia el objeto callable de WSGI que el servidor usará para iniciar la aplicación Django.
- Por defecto, Django crea un archivo wsgi.py en el proyecto, que contiene este objeto callable (application).

Valor por defecto: <font color='blue'>WSGI_APPLICATION = 'mi_proyecto.wsgi.application'</font>

Si se desplega Django en un servidor de producción, se necesita WSGI para que el servidor web pueda ejecutar la aplicación correctamente. En desarrollo, Django usa su propio servidor (runserver), que no necesita WSGI.

### <font color=#ad39dc>DATABASES</font>

Define cómo el proyecto se conecta a una o varias bases de datos. Django soporta múltiples motores de bases de datos (PostgreSQL, MySQL, SQLite, Oracle, etc.) y permite configurar conexiones a varias bases de datos si es necesario

Es un diccionario que contiene la configuración de conexión a la(s) base(s) de datos. Por defecto, Django usa SQLite, pero es posible cambiarlo a la BD que se requiera

#### Ejemplo con MySQL

```python
# define configuraciones avanzadas para la conexión a la base de datos
db_options = {
    'charset': 'utf8mb4',
}
# Esto solo es necesario en produccion, en local no funiona con SSL
if IS_PRODUCTION:
    db_options['ssl'] = {'ssl_mode': 'REQUIRED'}

DATABASES = {
    'default': {
       'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQLDATABASE') or os.getenv('DB_NAME'),
        'USER': os.getenv('MYSQLUSER') or os.getenv('DB_USER'),
        'PASSWORD': os.getenv('MYSQLPASSWORD') or os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('MYSQLHOST') or os.getenv('DB_HOST'),
        'PORT': os.getenv('MYSQLPORT') or os.getenv('DB_PORT'),
        'OPTIONS': db_options,
    }
}
```

##### Tips
Hay que instalar los drivers necesarios para cada BD  

### <font color=#ad39dc>AUTH_USER_MODEL</font>

Define el modelo de usuario personalizado que el proyecto utilizará para manejar la autenticación, permisos y gestión de usuarios. Por defecto, Django usa su modelo User incorporado, pero es posible reemplazarlo con uno propio.

#### Reglas importantes

##### 1.- Debe ser una subclase de AbstractUser o AbstractBaseUser:

- AbstractUser: Extiende el modelo por defecto (recomendado para personalizaciones simples).
- AbstractBaseUser: Para control total (avanzado).

##### 2.- Definirlo ANTES de la primera migración:
Si ya se han ejecutado migraciones, se tendra que borrar la base de datos y empezar de cero.

##### 3.- Referencia en relaciones:
En los modelos, usar settings.AUTH_USER_MODEL (no User directamente):

```python
from django.conf import settings

class Pedido(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```

```python
AUTH_USER_MODEL = 'auth.User'  # Modelo User estándar de Django
```
*Este proyecto tiene un modelo de usuario personalizado, por lo que no se usa User ni settings.AUTH_USER_MODEL*

```python
AUTH_USER_MODEL = os.getenv('USERDB')
```

### <font color=#ad39dc>AUTH_PASSWORD_VALIDATORS</font>

Define reglas de validación para asegurar que las contraseñas de los usuarios sean seguras. Por defecto, Django incluye varios validadores que verifican complejidad, similitud con el nombre de usuario, uso de contraseñas comunes, etc.

#### Validadores disponibles

| Validador (NAME) | Descripción | Opciones configurables |
|----------|----------|----------|
| UserAttributeSimilarityValidator    | Evita contraseñas similares al nombre de usuario, email, etc.   | user_attributes (atributos a comparar), max_similarity (0 a 1)   |
| MinimumLengthValidator    | Exige una longitud mínima   | min_length (por defecto 8)   |
| CommonPasswordValidator    | Bloquea contraseñas comunes (como "123456")  | password_list_path (ruta a una lista personalizada)   |
| NumericPasswordValidator    | Evita contraseñas solo numéricas   |    |

Se pueden modificar sus parámetros o desactivarlos:

```python
{
    'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    'OPTIONS': {
        'min_length': 10,  # Ahora requiere al menos 10 caracteres
    }
},
```

Ajustar la similitud con atributos del usuario

```python
{
    'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    'OPTIONS': {
        'user_attributes': ('username', 'email', 'first_name'),
        'max_similarity': 0.5,  # Más estricto (por defecto: 0.7)
    }
},
```

### <font color=#ad39dc>LANGUAGE_CODE</font>

Define el idioma predeterminado de la aplicación. Controla aspectos como:

- Traducciones de textos en templates, formularios y mensajes del sistema.
- Formato de fechas, números y horas.
- Comportamiento de la internacionalización (i18n) y localización (l10n).

#### Usos

1. Traducciones automáticas  
    - Django usa este valor para cargar los archivos de traducción correspondientes (si están disponibles en locale/).

2. Formatos regionales

    - Fechas (DATE_FORMAT, DATETIME_FORMAT).
    - Números (separador decimal, miles).
    - Horas (formato 12h/24h).

3. Mensajes del sistema
    - Errores de formularios, mensajes del admin, etc., aparecerán en el idioma configurado.

4. Middleware de internacionalización
    - Si se usa django.middleware.locale.LocaleMiddleware, permite cambiar el idioma dinámicamente basado en la preferencia del usuario.

### <font color=#ad39dc>TIME_ZONE</font>

Define la zona horaria predeterminada para la aplicación. Controla cómo Django maneja:

- Fechas y horas en la base de datos.
- Visualización de tiempos en templates y formularios.
- Comportamiento de funciones sensibles al tiempo (como timezone.now())

#### USE_TZ (Usar Zonas Horarias)

- **Si USE_TZ = True**  (recomendado), Django trabaja con zonas horarias (UTC + conversión).
- **Si USE_TZ = False**, Usa la hora local del servidor (no recomendado para apps globales).

#### USE_I18N

Habilita o deshabilita el sistema de internacionalización (i18n) del framework. La internacionalización permite adaptar la aplicación a diferentes idiomas y regiones sin cambios en el código base.

#### Ejemplo

```python
TIME_ZONE = "America/Santiago"  # Hora de Chile
USE_TZ = True  # Siempre activado
USE_I18N = True
```

### <font color=#ad39dc>STATIC_URL</font>

Define la URL base desde la que se servirán los archivos estáticos (CSS, JavaScript, imágenes, etc.) en la aplicación. Permite a Django saber dónde encontrar y cómo servir los archivos estáticos.

#### TIPS

- Durante el desarrollo, Django sirve los archivos estáticos automáticamente.
- En producción, es primordial configurar el servidor web para servir estos archivos y nunca depender de Django para este propósito por razones de rendimiento y seguridad.

```python
# Para collectsatic necesario en Railway
STATIC_URL = '/static/'
STATIC_ROOT = '/app/backend/staticfiles' if os.getenv('IS_PRODUCTION') == 'True' else os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
WHITENOISE_MAX_AGE = 604800 if IS_PRODUCTION else 0
```

#### Especifica cómo Django debe almacenar y servir los archivos estáticos.

Se usa WhiteNoise, una librería que:

- Comprime automáticamente los archivos (gzip o brotli).
- Genera versiones con hash únicos en el nombre para control de caché (main.abcd1234.css).
- Permite servir los archivos estáticos directamente desde la app sin depender de Nginx o S3.
- Esta opción es ideal para entornos como Railway, donde no se usa un servidor web dedicado.
- Controla el tiempo de caché de los archivos estáticos en el navegador del cliente.
- 604800 segundos = 7 días (ideal en producción).
- 0 en desarrollo para que los cambios se vean de inmediato al actualizar el navegador.

### <font color=#ad39dc>DEFAULT_AUTO_FIELD</font>

Define el tipo de campo automático predeterminado que se usará para las claves primarias (primary keys) en los modelos cuando no se especifique explícitamente un campo primary_key=True

- Valor por defecto: <font color='blue'>'django.db.models.BigAutoField'</font>, entero de 64 bits
- El campo id se creará automáticamente usando el tipo especificado en DEFAULT_AUTO_FIELD

### <font color=#ad39dc>Django Rest Framework</font>

Esta configuración define el comportamiento global de Django REST Framework (DRF) en el proyecto, especificando cómo manejará la autenticación, permisos, versionado, y limitación de solicitudes (throttling). 

#### ¿Que es DRF?

- Simplifica la creación de APIs RESTful
- Proporciona serializadores para conversión de datos
- Ofrece vistas genéricas y viewsets para endpoints comunes
- Incluye autenticación, permisos y throttling
- Soporta múltiples formatos (JSON, XML, etc.)

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', 
    ],
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],

    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '30/hour',
        'user': '200/hour'
    }
}
```

#### Autenticación (DEFAULT_AUTHENTICATION_CLASSES)
Propósito: Define los métodos de autenticación que se usarán en todas las vistas de la API.
Configuración:

```python
'DEFAULT_AUTHENTICATION_CLASSES': [
    'rest_framework_simplejwt.authentication.JWTAuthentication',
],
```

##### Explicación:

- JWTAuthentication: Usa JSON Web Tokens (JWT) para autenticar peticiones.
    - Ideal para APIs stateless (sin sesiones).
    - Requiere el paquete djangorestframework-simplejwt (pip install djangorestframework-simplejwt).

- Alternativas comunes:
    - SessionAuthentication: Para autenticación basada en sesiones (típico en aplicaciones web).
    - TokenAuthentication: Autenticación por tokens simples (menos seguro que JWT).

#### Permisos (DEFAULT_PERMISSION_CLASSES)
Propósito: Establece los permisos globales para acceder a los endpoints de la API.
Configuración:

```python
'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated', 
],
```

##### Explicación:

- IsAuthenticated: Solo usuarios autenticados pueden acceder a la API.
- Otras opciones útiles:
    - AllowAny: Acceso público (sin autenticación).
    - IsAdminUser: Solo para superusuarios.
    - DjangoModelPermissions: Permisos basados en el modelo de Django.

#### Versionado (DEFAULT_VERSIONING_CLASS y DEFAULT_VERSION)
Propósito: Gestiona diferentes versiones de la API para mantener compatibilidad.
Configuración:

```python
'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
'DEFAULT_VERSION': 'v1',
'ALLOWED_VERSIONS': ['v1', 'v2'],
```

##### Explicación:

- URLPathVersioning: La versión se incluye en la URL (ej: /api/v1/endpoint/).
- DEFAULT_VERSION: Versión predeterminada si no se especifica.
- ALLOWED_VERSIONS: Versiones permitidas (evita errores si se pasa una versión no soportada).
- Alternativas:
    - NamespaceVersioning: Usa namespaces de URLs.
    - QueryParameterVersioning: La versión se pasa como parámetro (ej: ?version=v1).

#### Throttling (DEFAULT_THROTTLE_CLASSES y DEFAULT_THROTTLE_RATES)
Propósito: Limita el número de peticiones para evitar abuso o sobrecarga del servidor.
Configuración:

```python
'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
'DEFAULT_THROTTLE_RATES': {
        'anon': '30/hour',
        'user': '200/hour'
}
```
##### Explicación:

- AnonRateThrottle: Limita peticiones de usuarios anónimos (ej: 30/hora).
- UserRateThrottle: Limita peticiones de usuarios autenticados (ej: 200/hora).
- Formato de tasas:
    - '100/day': 100 peticiones por día.
    - '10/minute': 10 peticiones por minuto.
- Personalización: Se puede definir throttles específicos por vista.

##### Requisitos Adicionales
- Instalar librerías necesarias:

```python
pip install djangorestframework
```

- Agregar rest_framework a INSTALLED_APPS en settings.py.

### <font color=#ad39dc>Json Web Token</font>

Esta configuración controla el comportamiento de los JSON Web Tokens (JWT) en la API cuando se usa djangorestframework-simplejwt. Define cómo se generan, validan y manejan los tokens de acceso (access) y refresco (refresh), así como aspectos de seguridad relacionados con cookies y encabezados HTTP.

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'JTI_CLAIM': 'jti',
    'AUTH_COOKIE': 'refresh_token',   # Nombre de la cookie
    'AUTH_COOKIE_HTTP_ONLY': True,    # Solo accesible por HTTP
    'AUTH_COOKIE_SECURE': True,       # Solo en HTTPS (True en producción)
    'AUTH_COOKIE_SAMESITE': 'None',   # Protección CSRF
    'AUTH_COOKIE_PATH': '/',          # Ruta donde es válida la cookie
    'AUTH_COOKIE_DOMAIN': None,       # Dominio (None para localhost)
    'ROTATE_REFRESH_TOKENS': True,    # Genera un nuevo refres token cada vez que se usa el actual
    'BLACKLIST_AFTER_ROTATION': True, # Agrega a la lista negra el token que se uso
}
```

#### ACCESS_TOKEN_LIFETIME

- Tipo: timedelta
- Valor por defecto: timedelta(minutes=5)
- Descripción:
Establece cuánto tiempo es válido el token de acceso (access token). Después de este período, el token expira y el usuario debe autenticarse nuevamente o usar un token de refresco.

#### REFRESH_TOKEN_LIFETIME

- Tipo: timedelta
- Valor por defecto: timedelta(days=1)
- Descripción:
Define la validez del token de refresco (refresh token). Este token se usa para obtener un nuevo access token sin requerir credenciales.


#### ALGORITHM

- Tipo: str
- Valor por defecto: 'HS256'
- Descripción:
Algoritmo usado para firmar los tokens. Opciones comunes:
    - HS256 (HMAC con SHA-256): Usa una clave secreta (SIGNING_KEY).
    - RS256 (RSA con SHA-256): Usa un par de claves pública/privada.

#### SIGNING_KEY

- Tipo: str
- Valor por defecto: settings.SECRET_KEY
- Descripción:
Clave secreta para firmar los tokens. Por defecto, usa la SECRET_KEY de Django.

#### AUTH_HEADER_TYPES

- Tipo: tuple
- Valor por defecto: ('Bearer',)
- Descripción:
Tipos de esquemas de autenticación aceptados en el encabezado Authorization

#### AUTH_HEADER_NAME

- Tipo: str
- Valor por defecto: 'HTTP_AUTHORIZATION'
- Descripción:
Nombre del encabezado HTTP donde se espera el token.

#### AUTH_COOKIE

- Tipo: str
- Valor por defecto: None
- Descripción:
Nombre de la cookie que almacenará el refresh token (útil para autenticación en navegadores).

#### AUTH_COOKIE_HTTP_ONLY

- Tipo: bool
- Valor por defecto: True
- Descripción:
Si es True, la cookie no es accesible desde JavaScript (protección contra XSS).

#### AUTH_COOKIE_SECURE

- Tipo: bool
- Valor por defecto: False
- Descripción:
Si es True, la cookie solo se envía sobre HTTPS (obligatorio en producción).

#### AUTH_COOKIE_SAMESITE

- Tipo: str
- Valor por defecto: 'Lax'
- Descripción:
Política SameSite para prevenir ataques CSRF. Opciones:
    - 'Strict': Cookie solo en solicitudes del mismo sitio.
    - 'Lax' (recomendado): Cookie en solicitudes seguras (GET) cruzadas.
    - 'None': Cookie en cualquier contexto (requiere Secure=True).

#### JTI_CLAIM

- Tipo: str
- Valor por defecto: 'jti'
- Descripción:
Nombre de la claim (atributo) en el JWT que almacena el identificador único del token (usado para blacklisting).

#### AUTH_COOKIE_PATH y AUTH_COOKIE_DOMAIN

Descripción:

- PATH: Ruta donde la cookie es válida (ej: '/' para todo el sitio).
- DOMAIN: Dominio donde la cookie es válida (ej: '.midominio.com', None para localhost en desarrollo).

#### ROTATE_REFRESH_TOKENS

- Tipo: bool
- Valor por defecto: False
- Descripción:
Si es True, cada vez que se usa un refresh token para obtener un nuevo access token, se genera un nuevo refresh token (y el anterior se invalida).

#### BLACKLIST_AFTER_ROTATION

- Tipo: bool
- Valor por defecto: False
- Descripción:
Si es True, los refresh tokens anteriores se añaden a una lista negra (blacklist) después de rotarlos. Requiere la configuración de rest_framework_simplejwt.token_blacklist en INSTALLED_APPS.

### <font color=#ad39dc>CORS_ALLOWED_ORIGINS</font>

Es una configuración importante cuando la API Django necesita ser accedida desde frontends que se ejecutan en diferentes dominios (Cross-Origin Resource Sharing). En este caso por REACT

#### ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad del navegador que restringe las solicitudes HTTP entre diferentes orígenes (dominios). Cuando el frontend (ej. React en http://localhost:3000) intenta acceder a la API Django (ej. http://api.midominio.com), el navegador bloquea la solicitud por razones de seguridad a menos que el servidor permita explícitamente el acceso

#### Configurción de CORS
1. Para habilitar CORS es necesario el paquete django-cors-headers:

```python
    pip install django-cors-headers
```

2. Agregar a INSTALLED_APPS:

```python
    INSTALLED_APPS = [
        ...
        'corsheaders',
        ...
    ]
```

3. Agregar el middleware (debe estar lo más arriba posible):

```python
    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware',  # ¡Debe estar antes de CommonMiddleware!
        ...
        'django.middleware.common.CommonMiddleware',
        ...
    ]
```


## <font color=#ad39dc>CONFIGURACIONES DE SEGURIDAD</font>

```python
# Configuracion CORS
CORS_ALLOWED_ORIGINS = os.getenv('CORS_KEYS', '').split(',') if os.getenv('CORS_KEYS') else []

CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']  # Necesario para CSRF

# CSRF
CSRF_COOKIE_SECURE = IS_PRODUCTION
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'None' # backend y frontend en dominios diferentes
CSRF_USE_SESSIONS = False
CSRF_TRUSTED_ORIGINS = [
    origin for origin in os.getenv('CORS_KEYS', '').split(',') if origin.startswith('https://')
    or origin.startswith('http://')
    ]

# Cookies de sesión
SESSION_COOKIE_SECURE = IS_PRODUCTION
SESSION_COOKIE_SAMESITE = 'None'

# Headers de seguridad
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Axes
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',  
    'django.contrib.auth.backends.ModelBackend',
]

AXES_FAILURE_LIMIT = 10  # Número de intentos fallidos antes de bloquear
AXES_COOLOFF_TIME = 1  # 1 hora de bloqueo (puede ser timedelta(hours=1))
AXES_LOCKOUT_PARAMETERS = ['ip_address', 'username']  # Bloquear por IP + usuario
AXES_RESET_ON_SUCCESS = True  # Reiniciar contador tras login exitoso
AXES_ENABLED = IS_PRODUCTION

# HTTPS en produccion
SECURE_SSL_REDIRECT = IS_PRODUCTION
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# Protección adicional contra ataques de aislamiento entre ventanas
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"

# Evita que contenido externo se ejecute sin permisos explícitos
SECURE_CROSS_ORIGIN_EMBEDDER_POLICY = "require-corp"

# Restringe qué orígenes pueden cargar recursos desde tu servidor
SECURE_CROSS_ORIGIN_RESOURCE_POLICY = "same-origin"

# Limita el tamaño máximo de subida
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB
```

### <font color=#ad39dc>CORS_ALLOW_CREDENTIALS</font>

- Propósito: Permite que las solicitudes entre dominios (cross-origin) incluyan credenciales como cookies o headers de autenticación.
- Cuándo usarlo:
    - Cuando el frontend (ej: React/Vue) necesita enviar cookies/tokens JWT a un backend Django en otro dominio.
    - Requiere que el frontend configure withCredentials: true en peticiones asinconas.
- Advertencia: No habilitar esto si la API es pública sin autenticación

### <font color=#ad39dc>CORS_EXPOSE_HEADERS</font>

- Propósito: Define qué headers personalizados pueden ser accedidos por el frontend desde la respuesta del servidor.
- Ejemplo: X-CSRFToken es necesario para enviar el token CSRF en formularios o peticiones asincronas.

### <font color=#ad39dc>CSRF_COOKIE_SECURE</font>

- Propósito: Si es True, la cookie CSRF solo se envía sobre HTTPS (obligatorio en producción).
- Valor False: Usado en desarrollo con HTTP.


### <font color=#ad39dc>CSRF_COOKIE_HTTPONLY</font>

- Propósito: Permite que JavaScript acceda a la cookie CSRF (necesario para frameworks como React).
- Seguridad: En producción, considerar True si no es necesario leerla desde JS.


### <font color=#ad39dc>CSRF_COOKIE_SAMESITE</font>

- Propósito: Controla cuándo se envía la cookie CSRF en solicitudes cross-origin.
- 'Lax' (recomendado): Envía la cookie en navegación segura (ej: clicks a links).
- 'Strict': Solo en mismas URLs.
- 'None': Requiere Secure=True (para APIs accesibles desde múltiples dominios).

### <font color=#ad39dc>CSRF_USE_SESSIONS</font>

- Propósito: Si es True, almacena el token CSRF en la sesión del usuario en lugar de una cookie.
- Valor False: Usa cookies (más común).

### <font color=#ad39dc>CSRF_TRUSTED_ORIGINS</font>

- Propósito: Lista de dominios permitidos para enviar solicitudes CSRF seguras.

### <font color=#ad39dc>SESSION_COOKIE_HTTPONLY</font>

- Propósito: Hace que la cookie de sesión solo sea accesible por el servidor y no pueda ser leída o modificada por JavaScript en el navegador.

### <font color=#ad39dc>SESSION_COOKIE_SECURE</font>

- Propósito: Similar a CSRF_COOKIE_SECURE, pero para la cookie de sesión.
- Producción: Debe ser True (HTTPS obligatorio).

### <font color=#ad39dc>SESSION_COOKIE_SAMESITE</font>

- Propósito: Igual que CSRF_COOKIE_SAMESITE, aplicado a la cookie de sesión.

### <font color=#ad39dc>SECURE_CONTENT_TYPE_NOSNIFF</font>

- Propósito: Evita que el navegador "adivine" el tipo de contenido (MIME sniffing), previniendo ataques como XSS.

### <font color=#ad39dc>SECURE_BROWSER_XSS_FILTER</font>

- Propósito: Habilita el filtro XSS del navegador (protección adicional contra inyección de scripts).

### <font color=#ad39dc>X_FRAME_OPTIONS</font>

- Propósito: Impide que el sitio se embeda en un iframe (evita clickjacking).
- 'DENY': Bloqueo total.
- 'SAMEORIGIN': Permite iframes solo desde el mismo dominio.


### <font color=#ad39dc>AUTHENTICATION_BACKENDS</font>

Es una configuración de Django que define cómo se autentican los usuarios. Por defecto, Django usa ModelBackend para verificar credenciales contra la base de datos. Aquí se añade AxesStandaloneBackend para integrar funcionalidad de seguridad contra ataques de fuerza bruta.

Axes se debe instalar y colocar en las App Instaladas

```python
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',  
    'django.contrib.auth.backends.ModelBackend',
]
```

#### axes.backends.AxesStandaloneBackend

- Propósito:
    - Bloqueo inteligente de IPs/usuario tras múltiples intentos fallidos de login (protección contra fuerza bruta).
    - Registra intentos fallidos y aplica bloqueos temporales o permanentes.

- Características:
    - Se ejecuta antes que ModelBackend para interceptar ataques.

- Soporta:
    - Límites personalizados de intentos.
    - Bloqueo por IP, usuario, o combinación.
    - Mensajes personalizados al usuario bloqueado.

#### django.contrib.auth.backends.ModelBackend

- Propósito:
    - Backend por defecto de Django.
    - Autentica usuarios contra la base de datos (modelo User).

- Verifica:
    - Nombre de usuario/email y contraseña.
    - Estado is_active del usuario.

#### ¿Cómo Funciona el Flujo de Autenticación?

- Interceptación:
    - Cuando un usuario intenta loguearse, AxesStandaloneBackend verifica si la IP/usuario está bloqueada.
    - Si hay bloqueo, rechaza el acceso inmediatamente.

- Verificación estándar:
    - Si no hay bloqueo, pasa la solicitud a ModelBackend para validar credenciales.

- Registro de intentos:
    - Si el login falla, Axes registra el intento y cuenta hacia el límite de bloqueo.

### <font color=#ad39dc>AXES_FAILURE_LIMIT</font>

- Qué hace: Establece el número máximo de intentos fallidos de inicio de sesión permitidos antes de bloquear al usuario/IP.
- Valor por defecto: 5

- Importante:
    - Cuando un usuario/IP alcanza este límite, se activa el bloqueo.
    - El contador se reinicia después del tiempo definido en AXES_COOLOFF_TIME o con un inicio de sesión exitoso (si AXES_RESET_ON_SUCCESS=True).

### <font color=#ad39dc>AXES_COOLOFF_TIME</font>

- Qué hace: Define la duración del bloqueo después de alcanzar el límite de intentos fallidos.
- Formatos aceptados:
    - Número entero: horas (ej: 1 = 1 hora)
    - timedelta: para mayor precisión (ej: timedelta(minutes=30))
- Recomendación: Usar timedelta para configuraciones más precisas.

### <font color=#ad39dc>AXES_LOCKOUT_PARAMETERS</font>

- Qué hace: Determina los criterios para el bloqueo.
- Opciones:
    - ip_address: Bloquea solo por dirección IP.
    - username: Bloquea solo por nombre de usuario.
    - ip_address, username: Bloquea combinación de IP y usuario (más seguro).
- Ventaja: Bloquear por ambos parámetros previene que atacantes:
    - Usen la misma IP con diferentes usuarios
    - O el mismo usuario desde diferentes IPs

### <font color=#ad39dc>AXES_RESET_ON_SUCCESS</font>

- Qué hace: Reinicia el contador de intentos fallidos después de un inicio de sesión exitoso.
- Comportamiento:
    - True: El contador vuelve a cero tras un login correcto.
    - False: Mantiene el historial de intentos fallidos.
- Uso típico: Habilitado (True) para no penalizar a usuarios legítimos que eventualmente no aciertan su contraseña.


### <font color=#ad39dc>AXES_ENABLED</font>

- Qué hace: Activa o desactiva completamente el sistema de protección de axes.
- Cuándo desactivarlo:
    - Entornos de desarrollo/testing.
    - Cuando se usan otros sistemas de protección.
    - Para diagnóstico de problemas de autenticación.
- Precaución: Nunca desactivar en producción sin tener alternativa de protección.

### <font color=#ad39dc>SECURE_SSL_REDIRECT</font>

Esta opción fuerza que todas las solicitudes HTTP sean redirigidas a HTTPS. Solo se activa si IS_PRODUCTION es True.

- Asegura que los usuarios usen una conexión segura cifrada.
- Evita exponer cookies, tokens o datos en texto plano.
- Mejora la puntuación en herramientas como Lighthouse o SSL Labs.

### <font color=#ad39dc>SECURE_PROXY_SSL_HEADER</font>

Cuando la app está detrás de un proxy inverso (como Railway, Heroku, Nginx, Cloudflare, etc.), Django no puede saber directamente si la conexión original del usuario fue segura (HTTPS), porque las solicitudes que recibe internamente pueden venir como HTTP.

Este header le dice a Django:

- “Confía en el valor del encabezado HTTP_X_FORWARDED_PROTO enviado por el proxy para determinar si la conexión fue HTTPS.”

Railway envía este encabezado automáticamente.

### <font color=#ad39dc>SECURE_REFERRER_POLICY</font>

Controla como envia la cabezera HTTP Referer cuando un usuario navega de el sitio propio a otro dominio. Cada vez que se hace click en un enlace, el navegador envia:

Referer: https://tusitio.com/pagina/secreta

Esto le dice al servidor de destino desde donde viene el click. Al tenerlo en strict-origin-when-cross-origin, si el destino esta dentro del mismo dominio, se envia la URL completa. Al ser de un dominio diferente se envia el origen (scheme + host + puerto). De esta forma se evita fugas de información, se tiene mayor privacidad y no rompe enlaces internos.

### <font color=#ad39dc>SECURE_CROSS_ORIGIN_OPENER_POLICY</font>

Evita que páginas abiertas desde el sitio (o que lo abren) compartan el mismo contexto de navegación.
Protege contra ataques como tabnabbing y aisla mejor la ejecución entre ventanas o pestañas.

### <font color=#ad39dc>SECURE_CROSS_ORIGIN_EMBEDDER_POLICY</font>

Impide que el sitio cargue recursos de otros orígenes si no declaran permisos explícitos (CORP/CORS).
Aumenta la seguridad en APIs modernas como SharedArrayBuffer y previene ejecución de contenido no confiable.

### <font color=#ad39dc>SECURE_CROSS_ORIGIN_RESOURCE_POLICY</font>

Restringe quién puede cargar recursos que provienen del servidor.
Con same-origin, solo el propio dominio puede usar las imágenes, scripts o recursos, evitando hotlinking y consumo indebido.

### <font color=#ad39dc>DATA_UPLOAD_MAX_MEMORY_SIZE</font>

Establece un límite al tamaño máximo de datos que el backend aceptará en memoria durante una subida.
Previene abusos de uploads enormes que pueden causar consumo excesivo de RAM y ataques DoS simples.

### <font color=#ad39dc>LOGGING</font>

```python
# Configuracion del logger
if IS_PRODUCTION:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'file': {
                'level': 'WARNING',
                'class': 'logging.FileHandler',
                'filename': os.path.join(BASE_DIR, 'django.log'),
            },
        },
        'loggers': {
            'django': {
                'handlers': ['file'],
                'level': 'WARNING',
                'propagate': True,
            },
        },
    }
```

Este bloque configura el sistema de logging de Django para que, en producción, registre mensajes de advertencia y error en un archivo llamado django.log.

**if IS_PRODUCTION:**
Solo activa esta configuración en entornos productivos. Así, en desarrollo se puede usar logs por consola sin interferencias.

**'version': 1**
Indica que está usando la versión 1 del sistema de logging de Python, que es la que usa Django.

**'disable_existing_loggers': False**
Permite que los loggers existentes sigan funcionando, en lugar de desactivarlos.

**'handlers': { ... }**
Define cómo y dónde se almacenan los logs. En este caso crea un manejador de logs que:

- Guarda los mensajes con nivel WARNING o superior (ERROR, CRITICAL).
- Usa un archivo llamado django.log, ubicado en el directorio base del proyecto (BASE_DIR).
- Utiliza el manejador de archivos estándar de Python.

**'loggers': { 'django': ... }**
Define los loggers que Django usará. Aquí:

- El logger 'django' (el núcleo del framework) usará el handler 'file'.
- Su nivel mínimo será 'WARNING'.
- propagate: True permite que los logs se pasen también a otros loggers padres si existen.

Cuando la app esté corriendo en producción y ocurra, por ejemplo, un Http404, un error de base de datos o un fallo en vistas, se registrará una línea como:

```js
WARNING 2025-07-24 15:00:00,456 django.request Internal Server Error: /api/endpoint
Traceback (most recent call last):
...
```

- Permite auditar errores sin necesidad de revisar logs del servidor directamente.
- Útil para debuggear producción cuando no se tiene consola activa (como en Railway).
- Compatible con herramientas de monitoreo como Sentry, si se quiere mejorar la gestión de errores más adelante.

## <font color=#ad39dc>CONFIGURACIONES DE ARCHIVOS Y CLOUDFLARE</font>

### <font color=#ad39dc>MEDIA_ROOT</font>

Define la carpeta donde Django almacenará los archivos subidos por los usuarios (imágenes, PDFs, etc.).

```Python
if IS_PRODUCTION:
    MEDIA_ROOT = Path("/app/media")
else:
    MEDIA_ROOT = BASE_DIR / "media"
```

- En producción, se fija a /app/media, una ruta estable dentro del contenedor.
- En desarrollo, usa la carpeta media/ dentro del proyecto.

Esto separa claramente los archivos locales de los archivos en el despliegue.

### <font color=#ad39dc>MEDIA_URL</font>

Es la URL base desde la cual los archivos multimedia serán servidos.

```Python
MEDIA_URL = "/media/"
```

Ejemplo: una imagen subida podría quedar accesible en
/media/imagen.jpg

### CLOUDFLARE

Estas variables habilitan la integración con un almacenamiento S3-compatible (Cloudflare R2, MinIO, AWS S3, etc.). Django las usa cuando, como en este caso, el proyecto emplea un storage backend basado en S3.

```Python
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_ENDPOINT_URL = os.getenv("AWS_S3_ENDPOINT_URL")

AWS_S3_REGION_NAME = "auto"
AWS_S3_SIGNATURE_VERSION = "s3v4"
AWS_DEFAULT_ACL = 'private'
AWS_S3_FILE_OVERWRITE = False

AWS_S3_OBJECT_PARAMETERS = {
    "ContentDisposition": "inline",
    "CacheControl": "max-age=86400",
}
```

### <font color=#ad39dc>AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY</font>

Credenciales que usa Django para autenticar las operaciones en el bucket S3 (subir, leer, borrar archivos).

Estas credenciales:

- Nunca deben estar en el código.
- Se obtienen desde variables de entorno.

### <font color=#ad39dc>AWS_STORAGE_BUCKET_NAME</font>

Nombre del bucket de R2/S3 donde se guardarán los archivos.

### <font color=#ad39dc>AWS_S3_ENDPOINT_URL</font>

URL específica del endpoint de Cloudflare R2 o del proveedor S3.
Ejemplo típico en R2:

```Python
https://<accountid>.r2.cloudflarestorage.com
```

### <font color=#ad39dc>AWS_S3_REGION_NAME</font>

R2 no usa regiones tradicionales, por eso se establece en "auto".

### <font color=#ad39dc>AWS_S3_SIGNATURE_VERSION</font>

Especifica el método de firma para autenticar peticiones.
s3v4 es el estándar seguro y moderno recomendado.

### <font color=#ad39dc>AWS_DEFAULT_ACL </font>

Hace que todos los archivos subidos sean privados por defecto, evitando que queden expuestos públicamente a Internet.

### <font color=#ad39dc>AWS_S3_FILE_OVERWRITE</font>

Evita que un archivo con el mismo nombre sobrescriba a otro previamente subido.
Django generará un nombre único automáticamente.

### <font color=#ad39dc>AWS_S3_OBJECT_PARAMETERS</font>

Parámetros aplicados a cada archivo cuando se almacena:

- ContentDisposition: "inline"
Permite visualizar archivos directamente en el navegador (PDFs, imágenes), en vez de forzar descarga.

- CacheControl: "max-age=86400"
Indica un caché de 24 horas para mejorar performance en CDN y navegadores.

### <font color=#ad39dc>PERMISSIONS_POLICY</font>

Controla el acceso a APIs sensibles del navegador, siguiendo el estándar moderno de Permissions Policy (antes Feature Policy).

```Python
PERMISSIONS_POLICY = {
    "geolocation": [],
    "camera": [],
    "microphone": [],
}
```

Esto indica:

- Bloquea completamente el uso de geolocalización, cámara y micrófono.
- Ningún sitio (incluyendo el mismo dominio) puede usar esas APIs.
- Reduce superficie de ataque y mejora privacidad.

### CSP

```Python
CONTENT_SECURITY_POLICY = {
    "DIRECTIVES": {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", AWS_S3_ENDPOINT_URL],
        "connect-src": ["'self'", AWS_S3_ENDPOINT_URL],
        "frame-ancestors": ["'none'"],
    }
}
```

### <font color=#ad39dc>CONTENT_SECURITY_POLICY</font>

Define qué contenido puede cargarse en el sitio. Es una de las protecciones más fuertes contra ataques XSS.

### <font color=#d79bff>default-src: 'self'</font>

Solo carga contenido desde el mismo dominio por defecto.

### <font color=#d79bff>script-src: 'self'</font>

- Solo permite ejecutar scripts servidos desde el propio servidor.
- Bloquea scripts externos (salvo que se agreguen explícitamente).

### <font color=#d79bff>style-src: 'self', 'unsafe-inline'</font>

- Permite estilos locales.
- 'unsafe-inline' se incluye para permitir estilos inline (temporales o necesarios para librerías como MUI).Si en el futuro se elimina, se aumenta mucho la seguridad, pero es necesario en este proyecto

### <font color=#d79bff>img-src: 'self', data:, AWS_S3_ENDPOINT_URL</font>

- Permite imágenes locales
- Imágenes embebidas en base64 (data:)
- Y las servidas desde R2/S3.

<font color=#d79bff>connect-src: 'self', AWS_S3_ENDPOINT_URL</font>

- Controla las URLs a las que el frontend puede hacer fetch/axios.
- Permite solo llamadas al mismo dominio y al bucket S3.

### <font color=#d79bff>frame-ancestors: 'none'</font>

Evita que el sitio sea incrustado en iframes de otros sitios (clickjacking mitigation).

## SEGURIDAD DEPENDIENDO DE DESARROLLO O PRODUCCIÓN

```Python
if not IS_PRODUCTION:
    CSRF_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
```

Esto logra:

- Cookies accesibles durante desarrollo sin HTTPS.
- Evita problemas al probar peticiones AJAX o formularios locales.
- Mantiene cierta seguridad con SameSite='Lax'.
- En producción, estas opciones se vuelven estrictas y seguras automáticamente.

```Python
if IS_PRODUCTION:
    SECURE_HSTS_SECONDS = 31536000  # 1 año
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
```

### <font color=#ad39dc>SECURE_HSTS_SECONDS</font>

Fuerza a los navegadores a usar siempre HTTPS durante 1 año para el dominio.

### <font color=#ad39dc>SECURE_HSTS_INCLUDE_SUBDOMAINS</font>

Aplica la política SSL estricta también a subdominios.

### <font color=#ad39dc>SECURE_HSTS_PRELOAD</font>

Solicita que el dominio sea incluido en la lista HSTS Preload usada por Chrome, Firefox, Safari y Edge, haciendo imposible acceder vía HTTP incluso la primera vez.

---


