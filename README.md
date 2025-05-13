# 🧾 Formulario de Pedidos – Django + React (Vite)

Este proyecto es una aplicación web construida con **Django** en el backend y **React (Vite)** en el frontend. Su objetivo es generar formularios de **pedidos** a partir de **notas de venta**, permitiendo a los usuarios visualizar, gestionar y exportar los datos fácilmente.

Cuenta con un sistema de **autenticación de usuarios (login)** y utiliza **MySQL** como base de datos.

---

## 🚀 Funcionalidades

- 🔐 Login de usuarios.
- ✏️ Crear pedidos desde notas de venta.
- 📄 Visualización de pedidos en una **tabla interactiva**.
- 📥 Exportación de pedidos a **Excel (.xlsx)**.
- 🎨 Interfaz moderna utilizando **Material UI (MUI)**.
- 🔄 Comunicación fluida entre frontend y backend mediante API REST.

---

## 🛠️ Tecnologías utilizadas

### Backend:
- [Django](https://www.djangoproject.com/)
- [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
- **MySQL** – Base de datos

### Frontend:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material UI (MUI)](https://mui.com/)
- [Axios](https://axios-http.com/) – para llamadas a la API

### Librerías adicionales:
- [XLSX](https://www.npmjs.com/package/xlsx) – exportación a Excel
- [React Hook Form](https://react-hook-form.com/) – manejo de formularios
- [Yup](https://github.com/jquense/yup) – validaciones
- [React Router](https://reactrouter.com/) – navegación entre vistas

---

## 📦 Instalación y ejecución

### Requisitos
- Python 3.10+
- Node.js 18+
- npm o yarn
- MySQL

---

## 📁 Estructura del proyecto

├── backend/       # Proyecto Django (API + autenticación + lógica de pedidos)  
├── frontend/      # Proyecto React (Vite + MUI + autenticación)  
├── docs/          # Documentación adicional (MkDocs)  
├── .gitignore  
├── README.md  