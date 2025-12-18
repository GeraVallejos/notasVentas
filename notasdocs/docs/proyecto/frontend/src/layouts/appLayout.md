Este archivo define el layout principal de la aplicación, encargado de orquestar la estructura visual base y la convivencia entre navegación superior, menú lateral y contenido dinámico.

---

## Propósito del componente

`AppLayout` actúa como contenedor raíz de las vistas protegidas o principales del sistema. Su responsabilidad es:

* Definir la estructura general de la interfaz.
* Integrar la barra de navegación superior (`Navbar`).
* Integrar el menú lateral (`Sidebar`).
* Reservar el espacio donde React Router renderiza las rutas hijas mediante `Outlet`.
* Gestionar el comportamiento responsive del menú en dispositivos móviles.

Este componente no contiene lógica de negocio ni estado global; su enfoque es puramente estructural y de layout.

---

## Dependencias utilizadas

* **@mui/material**

  * `Box`: contenedor flexible basado en flexbox.
  * `Toolbar`: espaciador que replica la altura del AppBar.

* **react-router-dom**

  * `Outlet`: punto de renderizado de rutas anidadas.

* **React**

  * `useState`: manejo de estado local para el menú móvil.

* **Componentes internos**

  * `Navbar`: barra superior de navegación.
  * `Sidebar`: menú lateral de la aplicación.

---

## Estado local

```js
const [mobileOpen, setMobileOpen] = useState(false);
```

* `mobileOpen`: controla si el menú lateral está abierto o cerrado en resoluciones móviles.
* Este estado se comparte entre `Navbar` y `Sidebar` mediante props, permitiendo una sincronización consistente del comportamiento.

---

## Manejadores de eventos

```js
const handleMenuToggle = () => setMobileOpen((prev) => !prev);
const handleMenuClose = () => setMobileOpen(false);
```

* `handleMenuToggle`

  * Alterna el estado del menú móvil.
  * Se utiliza típicamente desde el botón de menú en la barra superior.

* `handleMenuClose`

  * Cierra explícitamente el menú.
  * Se utiliza cuando el usuario selecciona una opción del `Sidebar` o interactúa fuera de él.

Esta separación evita ambigüedades y facilita el control del flujo de apertura/cierre.

---

## Estructura del render

```jsx
<Box sx={{ display: 'flex' }}>
  <Navbar mobileOpen={mobileOpen} onMenuClick={handleMenuToggle} />
  <Sidebar mobileOpen={mobileOpen} onClose={handleMenuClose} />

  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <Outlet />
  </Box>
</Box>
```

### Contenedor raíz

* Usa `display: flex` para permitir la convivencia horizontal del `Sidebar` y el contenido principal.
* Facilita una estructura adaptable a escritorio y móvil.

### Navbar

* Recibe el estado `mobileOpen` para reflejar visualmente el estado del menú.
* Dispara `onMenuClick` para alternar el menú en resoluciones pequeñas.

### Sidebar

* Controlado completamente por el estado del layout.
* Recibe:

  * `mobileOpen`: define si está visible.
  * `onClose`: callback para cerrar el menú.

Esto asegura que el `Sidebar` sea un componente controlado y predecible.

### Área principal (`main`)

* `flexGrow: 1` permite que el contenido ocupe todo el espacio restante.
* `Toolbar` se utiliza como separador vertical:

  * Replica la altura del `AppBar`.
  * Evita que el contenido renderizado por `Outlet` quede oculto debajo de la barra superior.

### Outlet

* Punto donde React Router renderiza las rutas hijas.
* Permite que este layout sea reutilizado para múltiples vistas sin duplicar estructura.

---

## Consideraciones de diseño

* El layout sigue una arquitectura de **contenedor único**, donde el estado de navegación se centraliza.
* Facilita el mantenimiento y la escalabilidad del sistema de navegación.
* Mantiene una clara separación entre:

  * Layout (estructura)
  * Navegación (Navbar / Sidebar)
  * Contenido (rutas)

---

## Buenas prácticas aplicadas

* Estado mínimo y localizado.
* Componentes controlados mediante props.
* Uso correcto de `Outlet` para layouts anidados.
* Evita lógica de negocio dentro del layout.

---

## Rol dentro de la arquitectura

`AppLayout` funciona como el esqueleto visual de la aplicación. Todas las vistas principales dependen de este componente para garantizar una experiencia consistente, responsive y alineada con la navegación global del sistema.
