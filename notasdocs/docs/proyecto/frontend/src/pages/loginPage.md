### Propósito del archivo

Este componente define la página de autenticación del sistema. Su responsabilidad principal es **presentar el formulario de inicio de sesión** y **restablecer el estado global de autenticación** al ingresar a la ruta `/login`, garantizando una sesión limpia.

---

### Importaciones y dependencias

```js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearStore } from '../auth/authSlice';
```

* `useEffect`: ejecuta efectos secundarios al montar el componente.
* `useDispatch`: permite despachar acciones a Redux.
* `clearStore`: acción que restablece completamente el estado de autenticación.

```js
import { LoginForm } from '../components/forms/LoginForm';
```

* Componente responsable del formulario y lógica de login.

```js
import { Grid, Box } from '@mui/material';
import jj_baner from '../assets/imagenes/jj_baner.jpg';
```

* Componentes de layout de MUI para estructurar la vista.
* Imagen estática utilizada como banner visual.

---

### Limpieza del estado global

```js
const dispatch = useDispatch();

useEffect(() => {
  dispatch(clearStore());
}, [dispatch]);
```

* Al montar la página, se ejecuta `clearStore()`.
* Se eliminan:

  * Usuario autenticado
  * Flags de sesión
  * Errores residuales
* Esto previene inconsistencias al acceder nuevamente al login tras un logout o sesión expirada.

---

### Estructura de layout

```js
<Grid container sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
```

* Contenedor principal a pantalla completa.
* Evita scroll innecesario.

---

### Columna del formulario

```js
<Grid size={{ xs: 12, md: 6 }} container direction="column" ...>
  <LoginForm />
</Grid>
```

* Ocupa:

  * 100% del ancho en móvil
  * 50% del ancho en pantallas medianas o superiores
* Centra vertical y horizontalmente el formulario.
* `LoginForm` encapsula toda la lógica de validación, envío y feedback.

---

### Columna visual (banner)

```js
<Grid size={{ xs: false, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
```

* Visible solo en escritorio.
* Mejora la experiencia visual sin afectar usabilidad en móvil.

```js
<Box
  sx={{
    backgroundImage: `url(${jj_baner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.8,
  }}
/>
```

* Imagen decorativa sin impacto funcional.
* Uso de `Box` evita imágenes `<img>` innecesarias y permite control total de estilos.

---

### Responsabilidades del componente

* Inicializar una sesión limpia
* Presentar la interfaz de login
* Separar claramente:

  * Lógica de autenticación (`LoginForm`)
  * Layout visual (`LoginPage`)

---

### Buenas prácticas aplicadas

* Separación de responsabilidades
* Uso correcto de `useEffect` para efectos de montaje
* Layout responsive con MUI Grid
* Manejo centralizado del estado con Redux

---

### Rol dentro de la arquitectura

Este componente actúa como **página de entrada al sistema**, sirviendo como punto de control inicial del flujo de autenticación y garantizando consistencia del estado global antes de iniciar sesión.
