## Propósito del archivo

Este archivo define la barra lateral de navegación de la aplicación. Su función principal es mostrar el menú principal, organizar las rutas por secciones desplegables y adaptar su comportamiento según el tamaño de pantalla y el rol del usuario.

El archivo contiene **dos componentes principales**:

* `SidebarContent`: renderiza el contenido del menú (items y submenús).
* `Sidebar`: envuelve el contenido dentro de un `Drawer` de MUI y maneja la versión móvil y escritorio.

---

## Dependencias principales

* **Material UI**: componentes visuales (`Drawer`, `List`, `Collapse`, etc.) y helpers de responsividad.
* **React Router**: `NavLink` para navegación activa.
* **Redux**: obtención del usuario y sus grupos para control de permisos.
* **date-fns**: obtención del año actual para el footer.
* **Assets locales**: imágenes PNG utilizadas como iconos del menú.

---

## Constantes

```js
const drawerWidth = 180;
```

Define el ancho fijo del sidebar tanto en versión móvil como escritorio.

---

## Componente: SidebarContent

### Responsabilidad

Renderiza la lista de opciones del menú, incluyendo:

* Secciones colapsables
* Enlaces de navegación
* Renderizado condicional según rol

### Estado local

```js
const [openNotas, setOpenNotas] = useState(false);
const [openFacturas, setOpenFacturas] = useState(false);
const [openMaterias, setOpenMaterias] = useState(false);
const [openPicking, setOpenPicking] = useState(false);
```

Cada estado controla la apertura/cierre de un submenú.

---

### Control de permisos

```js
const grupo = useSelector((state) => state.auth.user?.groups || []);
const adminGroup = grupo.some((g) => g.includes('Admin'));
```

* Se obtiene el grupo del usuario desde Redux.
* Solo los usuarios con rol **Admin** pueden ver Facturas, Insumos, Picking y Sábados.

---

### Estructura del menú

#### Menú Notas

Siempre visible.

* Nueva Nota
* Lista de Notas
* Histórico de Notas

Se maneja mediante un `Collapse` controlado por `openNotas`.

---

#### Menú Facturas (solo admin)

Incluye:

* Lista de Facturas
* Facturas Pagadas

---

#### Menú Insumos (Materias Primas)

Incluye:

* Pedir Insumos
* Lista de Insumos
* Histórico de Insumos

---

#### Menú Picking

Incluye:

* Nuevo Pedido
* Lista de Pedidos
* Histórico de Pedidos

---

#### Acceso directo Sábados

No es colapsable.
Solo visible para administradores.

---

### Navegación

Cada opción utiliza `NavLink`:

```js
<ListItemButton component={NavLink} to="/ruta" />
```

Esto permite:

* Navegación SPA
* Estilos automáticos para la ruta activa
* Cierre automático del drawer en móvil mediante `onClick`

---

## Componente: Sidebar

### Responsabilidad

Define el tipo de `Drawer` a utilizar según el tamaño de pantalla.

---

### Detección de tamaño de pantalla

```js
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

* `true`: pantallas pequeñas (móvil/tablet)
* `false`: pantallas grandes (desktop)

---

### Sidebar en móvil

```js
<Drawer variant="temporary" />
```

Características:

* Se abre y cierra mediante `mobileOpen`
* Se cierra al hacer click en una opción
* Mantiene el componente montado para mejor performance

---

### Sidebar en escritorio

```js
<Drawer variant="permanent" />
```

Características:

* Siempre visible
* Contiene dos secciones:

  * Contenido del menú
  * Footer fijo inferior

---

### Footer

```js
© {getYear(new Date())} Gerardo Vallejos
```

* Año dinámico
* Texto informativo
* Solo visible en escritorio

---

## Flujo general de funcionamiento

1. El componente detecta si la pantalla es móvil o escritorio.
2. Renderiza el tipo de `Drawer` correspondiente.
3. `SidebarContent` renderiza el menú según el rol del usuario.
4. Los submenús se expanden o colapsan mediante estado local.
5. En móvil, al seleccionar una opción, el drawer se cierra.

---

## Beneficios de esta implementación

* Navegación clara y jerárquica
* Control de permisos centralizado
* Diseño responsive sin duplicar lógica
* Código fácil de extender (nuevos menús o roles)

---

## Posibles mejoras futuras

* Reemplazar imágenes por SVG o iconos MUI
* Centralizar definición de rutas en una constante
* Convertir los submenús en una estructura de datos dinámica
* Animaciones personalizadas para `Collapse`
