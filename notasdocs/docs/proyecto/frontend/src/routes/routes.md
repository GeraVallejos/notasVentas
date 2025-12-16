# <font color=#ff5733>Arquitectura de Rutas – React Router</font>

Este documento describe en detalle la arquitectura de ruteo del proyecto utilizando **React Router v6+ (Data Router API)**. Se explican la lógica, responsabilidades y flujo interno de cada archivo involucrado en la carpeta `routes`.

El sistema de rutas está dividido conceptualmente en tres capas:

1. **Definición de rutas (router principal)**
2. **Loaders de autenticación (público / privado)**
3. **Protección por grupos (autorización)**

---

## Definición de Rutas – `getRoutes`

### Propósito

Este archivo define la **estructura completa de navegación** de la aplicación utilizando `createBrowserRouter`. Centraliza:

* Layouts principales
* Rutas públicas y privadas
* Protección por autenticación
* Protección por roles/grupos

---

### Código

```js
export const getRoutes = () => createBrowserRouter([
  {
    element: <AppLayout />,
    loader: privateLoader,
    children: [ /* rutas privadas */ ],
  },
  {
    element: <AuthLayout />,
    loader: publicLoader,
    children: [ /* rutas públicas */ ],
  },
]);
```

---

### 🔹 Concepto Clave: Layouts como contenedores

* **AppLayout**

  * Contenedor de toda la aplicación autenticada
  * Incluye navbar, sidebar, footer, etc.

* **AuthLayout**

  * Contenedor exclusivo para autenticación
  * Evita renderizar UI privada

Cada layout actúa como un **router outlet**.

---

### 🔹 Rutas privadas

```js
{
  element: <AppLayout />,
  loader: privateLoader,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'notas', element: <NotasPage /> },
  ],
}
```

**Lógica:**

1. React Router ejecuta `privateLoader` antes de renderizar.
2. Si el usuario está autenticado → se renderiza `AppLayout`.
3. Si no lo está → redirección automática a `/login`.

---

### 🔹 Protección por grupos (roles)

```js
{
  path: 'materias-primas',
  element: (
    <GroupsRouter group="Admin">
      <MateriasPrimasPage />
    </GroupsRouter>
  ),
}
```

Este patrón desacopla **autenticación** de **autorización**:

* Loader → valida sesión
* GroupsRouter → valida permisos

---

### 🔹 Ruta comodín

```js
{ path: '*', element: <HomePage /> }
```

Garantiza que cualquier ruta inválida redirija a una página válida.

---




## 🧠 Arquitectura General

```text
BrowserRouter
 ├── AuthLayout (publicLoader)
 │    └── Login
 └── AppLayout (privateLoader)
      ├── Rutas públicas autenticadas
      └── Rutas protegidas por GroupsRouter
```

---

## Buenas Prácticas Aplicadas

* Autenticación fuera de componentes
* Autorización desacoplada
* Redux como fuente única de sesión
* Layouts como frontera de seguridad
* Redirecciones previas al render

---

✅ Esta arquitectura proporciona un sistema de navegación **seguro, escalable y mantenible**, alineado con aplicaciones React empresariales.
