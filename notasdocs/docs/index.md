Este proyecto es una aplicación web construida con Django, React y MySQL, diseñada para gestionar pedidos de notas de venta previamente generadas en un sistema ERP externo. Su propósito es proporcionar una interfaz amigable y eficiente para realizar solicitudes de pedidos, visualizar estadísticas relevantes mediante un dashboard y consultar registros históricos y pendientes de pedido.

### Tecnologías utilizadas

#### Backend

- Django como framework principal.
- Django REST Framework (DRF) para la creación de una API RESTful.
- Autenticación con JWT utilizando cookies HTTP-only para mayor seguridad.
- MySQL como base de datos relacional.

#### Frontend

- React para la construcción de la interfaz de usuario.
- Redux Toolkit para el manejo eficiente del estado global.
- React Router para la navegación entre páginas protegidas y públicas.
- Material UI (MUI) para una interfaz moderna, accesible y responsiva.

### Funcionalidades principales

- Formulario de pedidos: permite solicitar nuevos pedidos basados en notas de venta existentes.
- Dashboard informativo: muestra estadísticas clave para la toma de decisiones.
- Gestión de pedidos: visualización de pedidos históricos y no solicitados a través de un DataGrid de MUI, con funciones de búsqueda, filtrado y ordenamiento.

Este sistema ofrece una solución eficiente para complementar un ERP ya existente, mejorando el flujo de trabajo en la gestión de pedidos y proporcionando herramientas visuales para su seguimiento.

### Diagrama de Flujo Django

![Middleware](images/DjangoDiagrama.jpg)

---