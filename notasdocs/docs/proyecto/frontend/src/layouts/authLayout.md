## Propósito del componente

`AuthLayout` es un **layout estructural** utilizado para envolver las vistas de autenticación (por ejemplo: login, recuperación de contraseña, registro). Su responsabilidad es **proveer un contenedor de pantalla completa** y delegar el renderizado del contenido específico a React Router mediante `Outlet`.

Este componente **no contiene lógica de negocio**, estado local ni dependencias externas a la maquetación. Su diseño busca ser **simple, reutilizable y desacoplado** de las vistas hijas.

---

## Importaciones

```js
import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
```

### Detalle de dependencias

* **`Grid` (MUI)**
  Se utiliza como contenedor principal para aprovechar el sistema de layout de Material UI y garantizar una correcta adaptación al tamaño de la pantalla.

* **`Outlet` (React Router)**
  Permite renderizar dinámicamente las rutas hijas asociadas a este layout, según la configuración del router.

---

## Definición del componente

```js
const AuthLayout = () => {
  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      <Outlet />
    </Grid>
  );
};
```

### Análisis del layout

* **`Grid container`**
  Declara el contenedor raíz como un grid de Material UI, habilitando un sistema de layout flexible y consistente.

* **`height: '100vh'`**
  Fuerza al layout a ocupar el **100% de la altura del viewport**, condición habitual en pantallas de autenticación para evitar scroll innecesario y centrar visualmente el contenido.

* **`overflow: 'hidden'`**
  Previene el scroll externo del layout. El control del overflow queda delegado a los componentes internos si fuese necesario.

* **`<Outlet />`**
  Actúa como punto de inserción para las vistas hijas (por ejemplo `LoginPage`, `ResetPasswordPage`, etc.), manteniendo el layout independiente del contenido.

---

## Responsabilidades

Este componente se encarga exclusivamente de:

* Definir un **contenedor de pantalla completa** para vistas de autenticación.
* Servir como **layout padre** en la jerarquía de rutas.
* Mantener una separación clara entre estructura y contenido.

No es responsabilidad de este componente:

* Manejar autenticación o validaciones.
* Gestionar estado global o local.
* Renderizar elementos visuales específicos (formularios, mensajes, botones).

---

## Uso típico en el router

Este layout se utiliza habitualmente de la siguiente forma:

```js
{
  path: '/login',
  element: <AuthLayout />,
  children: [
    { index: true, element: <LoginPage /> }
  ]
}
```

De esta manera, todas las rutas hijas heredan la estructura definida por `AuthLayout`.

---

## Beneficios del enfoque

* **Alta cohesión**: el layout cumple una única función clara.
* **Reutilización**: puede extenderse fácilmente a otras vistas de autenticación.
* **Mantenibilidad**: cambios estructurales se realizan en un único punto.
* **Consistencia visual**: todas las vistas de autenticación comparten el mismo marco base.

---

## Conclusión

`AuthLayout` es un componente de infraestructura que proporciona una base sólida y limpia para las vistas de autenticación. Su simplicidad es intencional y favorece una arquitectura clara, escalable y alineada con buenas prácticas en aplicaciones React con React Router y Material UI.
