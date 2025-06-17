# <font color=#ff5733>Guía de Instalación de Django</font>

Este documento es una guía para el proceso de instalación de un proyecto Django en la máquina local. es necesario seguir cada paso para configurar correctamente el entorno.

## Requisitos previos

Antes de comenzar, hay que tener los siguientes requisitos instalados en el sistema:

- **Python 3.8+**
- **Pip** 
- **Virtualenv** 

## 1. Crear un entorno virtual

Es recomendable utilizar un entorno virtual para evitar conflictos con otras librerías de Python que se pueda tener instaladas globalmente. Para crear un entorno virtual, estos son los pasos:

### Navegar al directorio de trabajo
<font color="blue">cd /ruta/a/tu/proyecto</font>

### Crear un entorno virtual 
<font color="blue">python3 -m venv env</font>

### Activar el entorno virtual

<font color="blue">venv\Scripts\activate</font>

#### Tips

- En la carpeta del proyecto crear el entorno virtual con virtualenv venv 
- Para activar el entorno se hace en la carpeta Scripts y luego ./activate
- Si esta correcto, en la terminal se verá el nombre de la carpeta antes de la ruta


## 2. Instalar Django

Una vez que se tenga el entorno virtual activo, es posible instalar Django utilizando `pip`:

<font color="blue">pip install django</font>

## 3. Crear un nuevo proyecto Django

<font color="blue">django-admin startproject nombre_del_proyecto</font>

<font color="blue">cd nombre_del_proyecto</font>

#### Tips

- Crear carpeta donde irá el proyecto de Backend (backend)
- Cambiar a la carpeta del proyecto (cd backendNombre) 
- Crear el proyecto django-admin startproject nombreProyecto
- Se crea el archivo manage.py, el cual maneja todo el proyecto
- En la carpeta del proyecto (cd nombreProyecto)
- Pedirá las migraciones iniciales, pero es preferible hacerlas después de crear el modelo del usuario para que no tenga conflictos


## 4. Verificar la instalación

<font color="blue">python manage.py runserver</font>

Esto iniciará el servidor de desarrollo en http://127.0.0.1:8000/. Si se visualiza la página predeterminada de Django, significa que la instalación fue exitosa.

## 5. Crear la Aplicación

<font color="blue">python manage.py startapp nombre_de_app </font>

Esto creará una nueva carpeta con la estructura básica de una aplicación Django. Ahora se puede empezar a desarrollar la funcionalidad de la aplicación.

#### Tips
- Es necesario conectar la aplicación con el proyecto de Django, en settings.py

```python
INSTALLED_APPS = [
    'nombre.apps.NombreConfig',

]
```
