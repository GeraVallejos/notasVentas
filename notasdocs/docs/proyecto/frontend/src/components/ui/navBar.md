## Propósito del componente

`Navbar` es el componente responsable de renderizar la barra de navegación superior de la aplicación. Su función principal es:

* Mostrar la identidad visual de la aplicación.
* Gestionar el botón de apertura/cierre del menú lateral en pantallas móviles.
* Mostrar información básica del usuario autenticado.
* Proveer una acción clara de cierre de sesión.

Está diseñado para ser **responsivo**, integrarse con **Redux** para el estado de autenticación y utilizar **Material UI** como sistema visual.

---

## Props

```ts
Navbar({
  mobileOpen: boolean,
  onMenuClick: () => void
})
```

### `mobileOpen`

Indica si el menú lateral está actualmente abierto en vista móvil. Se utiliza para alternar el icono entre menú y cierre.

### `onMenuClick`

Función callback que se ejecuta al presionar el botón de menú en dispositivos móviles.

---

## Dependencias principales

* **Material UI**: `AppBar`, `Toolbar`, `Avatar`, `Tooltip`, `IconButton`, etc.
* **Redux Toolkit**: acceso al usuario autenticado y acción de logout.
* **ActionButton**: componente reutilizable para ejecutar acciones con feedback.

---

## Acceso al estado global

```js
const user = useSelector(state => state.auth.user);
```

El componente obtiene el usuario autenticado desde el slice `auth`. Esto permite:

* Mostrar el nombre y apellido del usuario.
* Construir las iniciales para el avatar.
* Controlar si se renderiza o no la sección de usuario.

---

## Lógica de responsividad

```js
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

* En pantallas menores a `md`, se muestra el botón de menú lateral.
* En pantallas grandes, el botón no se renderiza.
* El diseño del botón de logout se compacta en móvil.

---

## Función `getInitials`

```js
const getInitials = (nombre, apellido) => {
  if (!nombre) return '?';
  const primeraLetraNombre = nombre.substring(0, 1).toUpperCase();
  const primeraLetraApellido = apellido ? apellido.substring(0, 1).toUpperCase() : '';
  return `${primeraLetraNombre}${primeraLetraApellido}`;
};
```

Responsable de generar las iniciales que se muestran dentro del `Avatar`.

* Maneja casos donde no existe apellido.
* Incluye una validación defensiva cuando no hay nombre.

---

## Estructura visual

### AppBar

```js
<AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} />
```

* Se posiciona fijo en la parte superior.
* Se asegura que quede por encima del menú lateral.
* Utiliza un gradiente como fondo para reforzar la identidad visual.

---

### Botón de menú móvil

Renderizado solo cuando `isMobile` es `true`:

* Alterna entre icono de abrir y cerrar según `mobileOpen`.
* Ejecuta `onMenuClick` al hacer click.

---

### Identidad de la aplicación

```js
<Link href="/">JJ DETERGENTES</Link>
```

* Funciona como acceso rápido al inicio.
* No utiliza subrayado.
* Mantiene tipografía y color consistentes con el AppBar.

---

### Información del usuario

```js
{user?.nombre && (
  <Tooltip>
    <Avatar>{getInitials(user.nombre, user.apellido)}</Avatar>
  </Tooltip>
)}
```

* Solo se renderiza si existe un usuario autenticado.
* El `Tooltip` muestra el nombre completo.
* El `Avatar` utiliza las iniciales calculadas dinámicamente.

---

## Botón de cierre de sesión

```js
<ActionButton
  action={() => dispatch(logout()).unwrap()}
  onSuccess={() => window.location.href = '/login'}
/>
```

Características clave:

* Ejecuta el thunk `logout` de Redux.
* Usa `unwrap()` para manejar correctamente promesas.
* Redirige al login tras una salida exitosa.
* Ajusta estilos dinámicamente según si es móvil o escritorio.

---

## Consideraciones importantes

* El componente **no maneja navegación interna compleja**, solo acciones de alto nivel.
* Depende de que el estado `auth.user` esté correctamente inicializado.
* El redireccionamiento post-logout se realiza de forma explícita usando `window.location`.

---

## Rol dentro del proyecto

`Navbar` actúa como un componente **layout-level**, común a múltiples vistas, y concentra:

* Identidad visual
* Control del menú
* Contexto del usuario
* Acción global de cierre de sesión

