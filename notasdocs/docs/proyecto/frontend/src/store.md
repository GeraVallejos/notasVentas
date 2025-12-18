## Propósito del archivo

Este archivo define y configura el **store global de Redux** utilizando **Redux Toolkit**. El store es el punto central donde se mantiene el estado de la aplicación y desde el cual los componentes acceden y modifican dicho estado de forma predecible.

En este caso, el store gestiona el estado de autenticación y establece una configuración personalizada del middleware para evitar advertencias innecesarias durante el desarrollo.

---

## Importaciones

```js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
```

* `configureStore`: función provista por Redux Toolkit que simplifica la creación del store, integrando automáticamente buenas prácticas como:

  * Redux DevTools
  * Middleware `redux-thunk`
  * Configuración segura por defecto

* `authReducer`: reducer encargado de manejar todo el estado relacionado con autenticación (usuario, loading, errores, sesión).

---

## Creación del store

```js
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
```

### Estructura del estado global

La propiedad `reducer` define la **forma del estado global**. En este caso:

```js
state = {
  auth: {
    user,
    loading,
    error,
    isAuthenticated
  }
}
```

Cada clave del objeto (`auth`) representa un slice del estado y queda accesible desde los componentes mediante `useSelector`.

---

## Configuración del middleware

```js
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ['meta.config.transformRequest'],
    },
  }),
```

### ¿Qué hace `getDefaultMiddleware`?

Redux Toolkit incluye por defecto una serie de middlewares, entre ellos:

* `redux-thunk` para lógica asíncrona
* `serializableStateInvariantMiddleware` para advertir sobre datos no serializables

### Ajuste del `serializableCheck`

* `serializableCheck` verifica que el estado y las acciones sean serializables.
* En aplicaciones que usan librerías externas (como Axios), pueden existir propiedades internas no serializables.

```js
ignoredPaths: ['meta.config.transformRequest']
```

Esta configuración indica a Redux que **ignore esa ruta específica**, evitando warnings innecesarios sin comprometer la integridad del estado.

---

## Exportación del store

```js
export default store;
```

El store se exporta para ser utilizado en el punto de entrada de la aplicación, normalmente envolviendo la app con:

```jsx
<Provider store={store}>
  <App />
</Provider>
```

Esto permite que cualquier componente acceda al estado global y despache acciones.

---

## Beneficios de esta configuración

* Centralización del estado global
* Integración automática con Redux DevTools
* Manejo claro y escalable de slices
* Configuración segura del middleware
* Preparado para crecer con nuevos reducers

---

## Observación final

Este archivo actúa como la **base de la arquitectura de estado** de la aplicación. Cualquier nuevo módulo que requiera estado global debe integrarse aquí mediante un nuevo reducer, manteniendo una estructura clara y mantenible.

---