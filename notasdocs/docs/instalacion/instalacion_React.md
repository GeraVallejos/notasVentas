# <font color=#ff5733>Guía de Instalación de React</font>

Este documento describe el proceso de instalación y configuración inicial de un proyecto **React** en un entorno **Windows**. El objetivo es estandarizar la preparación del entorno de desarrollo para cualquier desarrollador que utilice este proyecto.

---

## Requisitos previos

Antes de comenzar, es necesario contar con los siguientes requisitos instalados en el sistema:

* **Windows 10 / 11**
* **Node.js 18+** (incluye npm)
* **npm** (incluido con Node.js)
* **Git** (recomendado)

Para verificar las versiones instaladas:

```bash
node -v
npm -v
git --version
```

---

## 1. Crear el proyecto React

Para este proyecto se utiliza **Vite** como herramienta de inicialización, debido a su rapidez y configuración moderna.

### Navegar al directorio de trabajo

```bash
cd C:\ruta\al\proyecto
```

### Crear el proyecto con Vite

```bash
npm create vite@latest nombre-del-proyecto
```

Durante la creación:

* Seleccionar **React**
* Elegir **JavaScript** o **TypeScript** según definición del proyecto

Luego acceder al directorio del proyecto:

```bash
cd nombre-del-proyecto
```

#### Tips

* Se recomienda crear una carpeta **frontend** para el proyecto React
* Usar nombres en minúscula y sin espacios

---

## 2. Instalar dependencias base

Dentro del proyecto, instalar las dependencias iniciales:

```bash
npm install
```

Esto instalará todas las librerías definidas en `package.json`.

---

## 3. Instalar librerías utilizadas en el proyecto

El proyecto utiliza las siguientes librerías principales:

### React Router DOM (ruteo)

```bash
npm install react-router-dom
```

### React Hook Form (manejo de formularios)

```bash
npm install react-hook-form
```

### Material UI (interfaz gráfica)

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Axios (consumo de APIs)

```bash
npm install axios
```

---

## 4. Levantar el servidor de desarrollo

Para iniciar el servidor local:

```bash
npm run dev
```

El proyecto quedará disponible en una URL similar a:

```
http://localhost:5173/
```

Si se visualiza la pantalla inicial del proyecto, la instalación fue exitosa.

---

## 5. Estructura base del proyecto

La estructura general del proyecto es la siguiente:

```text
nombre-del-proyecto/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

* **main.jsx**: punto de entrada de la aplicación
* **App.jsx**: configuración principal de rutas y layout
* **services/**: configuración de Axios y servicios de API

---

## 6. Variables de entorno

Para configurar variables de entorno, crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000
```

Las variables deben comenzar con `VITE_` para que Vite pueda exponerlas al proyecto.

---

## 7. Build para producción

Para generar la versión optimizada del proyecto:

```bash
npm run build
```

Se generará la carpeta `dist/`, la cual contiene los archivos listos para despliegue.

---

## 8. Verificación final

La instalación se considera correcta si:

* El proyecto instala dependencias sin errores
* El servidor de desarrollo levanta correctamente
* La aplicación se visualiza en el navegador

El entorno React ha sido configurado correctamente y está listo para desarrollo.

---
