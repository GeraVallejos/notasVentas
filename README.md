# Sistema de Gestión de Pedidos y Operaciones

## Descripción general

Este proyecto es una **aplicación web empresarial** desarrollada con **Django, React y MySQL**, cuyo objetivo es **complementar un sistema ERP externo** mediante la gestión centralizada de pedidos operativos y administrativos.

La plataforma permite trabajar sobre **notas de venta previamente generadas en el ERP**, facilitando la creación de pedidos de despacho, retiro y picking, la solicitud de materias primas e insumos, la gestión documental de facturas y la administración de días sábados trabajados por el personal.

El sistema está diseñado bajo una **arquitectura cliente-servidor**, con una **SPA (Single Page Application)** en el frontend y una **API REST** robusta en el backend, priorizando seguridad, escalabilidad y mantenibilidad.

---

## Objetivos del sistema

* Optimizar el flujo operativo asociado a pedidos y despachos
* Reducir la dependencia directa del ERP para tareas operativas
* Centralizar información histórica y pendiente
* Proveer herramientas visuales para seguimiento y control
* Ofrecer una interfaz moderna, consistente y eficiente

---

## Arquitectura general

* **Backend**: API REST desarrollada en Django
* **Frontend**: SPA desarrollada en React
* **Base de datos**: MySQL
* **Autenticación**: JWT mediante cookies HTTP-only
* **Despliegue**: Vite + Vercel

---

## Backend

### Tecnologías utilizadas

* Django como framework principal
* Django REST Framework (DRF)
* Autenticación JWT con cookies seguras
* MySQL como base de datos relacional

### Responsabilidades

* Exposición de endpoints REST seguros
* Autenticación y autorización de usuarios
* Integración con el ERP externo
* Persistencia y validación de datos
* Control de sesiones y permisos por grupo

---

## Frontend

### Tecnologías utilizadas

* React
* Redux Toolkit
* React Router DOM
* Material UI (MUI)
* React Hook Form + Yup
* Axios
* Vite
* Date-fns
* ExcelJS

---

## Arquitectura del Frontend

El frontend sigue una arquitectura **modular y desacoplada**, donde cada carpeta cumple una responsabilidad clara:

```
src/
├── assets/           # Recursos estáticos
├── auth/             # Autenticación (Redux)
├── components/       # Componentes reutilizables
├── dataGrids/        # Tablas de datos
├── forms/            # Formularios y hooks
├── pages/            # Vistas asociadas a rutas
├── routes/           # Configuración de rutas
├── store/            # Redux Store
├── theme/            # Tema global MUI
├── utils/            # Utilidades comunes
└── main.jsx          # Punto de entrada
```

---

## Autenticación y estado global

* Manejo centralizado con Redux Toolkit
* Estado global de sesión y usuario
* Thunks asíncronos para login, logout y carga de usuario
* Refresh automático de token mediante interceptores Axios

---

## Formularios y validaciones

* React Hook Form para manejo de formularios
* Yup para validaciones declarativas
* Hooks personalizados para encapsular lógica
* Normalización y transformación de datos antes del envío

---

## Visualización y exportación de datos

* MUI DataGrid con configuración en español
* Soporte para filtros, ordenamiento y selección
* Exportación a Excel mediante ExcelJS

---

## Diseño y experiencia de usuario

* Tema global personalizado con Material UI
* Paleta de colores corporativa
* Tipografía consistente
* Layouts diferenciados para autenticación y aplicación
* Diseño responsive

---

## Inicialización y configuración

* Proveedores globales (Redux, Router, Theme, Localization)
* Configuración ESLint
* Configuración Vite optimizada
* Configuración Vercel para SPA

---

## Funcionalidades principales

* Gestión de pedidos de notas de venta
* Gestión de picking
* Gestión de materias primas e insumos
* Gestión documental de facturas
* Gestión de días sábados trabajados
* Dashboard de seguimiento

---

## Conclusión

Este sistema proporciona una **solución robusta, escalable y mantenible** para complementar un ERP existente, mejorando los flujos operativos, la trazabilidad de la información y la experiencia de usuario mediante el uso de tecnologías modernas y buenas prácticas de desarrollo.

---
