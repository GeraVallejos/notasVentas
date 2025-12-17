## Propósito del archivo

Este archivo define el **slice de autenticación** de la aplicación utilizando Redux Toolkit. Centraliza el estado relacionado con la sesión del usuario, el ciclo de vida de la autenticación y la gestión de errores asociados a procesos de login, obtención del usuario autenticado y cierre de sesión.

Su objetivo principal es ofrecer una **fuente única de verdad** para el estado de autenticación, desacoplando la lógica de negocio del manejo de estado de los componentes de UI.

---

## Estado inicial (`initialState`)

```ts
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};
```

Cada propiedad cumple un rol específico:

* **user**: almacena la información del usuario autenticado. Es `null` cuando no existe sesión válida.
* **loading**: indica si existe una operación de autenticación en curso (login, fetch user).
* **error**: contiene el mensaje de error resultante de operaciones fallidas.
* **isAuthenticated**: bandera explícita que indica si la sesión es válida.

La separación entre `user` e `isAuthenticated` permite manejar estados intermedios (por ejemplo, sesión válida pero usuario aún no cargado).

---

## Creación del slice (`createSlice`)

```ts
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { ... },
  extraReducers: (builder) => { ... }
});
```

Redux Toolkit permite definir en un solo lugar:

* Nombre del slice
* Estado inicial
* Reducers síncronos
* Manejo de acciones asíncronas (thunks)

Esto reduce el boilerplate y mejora la legibilidad del flujo de estado.

---

## Reducers síncronos

### `clearError`

```ts
clearError: (state) => {
  state.error = null;
}
```

Restablece el estado de error. Se utiliza normalmente cuando se desea limpiar mensajes de error antes de un nuevo intento de autenticación o al cambiar de vista.

---

### `clearStore`

```ts
clearStore: () => initialState,
```

Restablece completamente el estado del slice a su valor inicial. Es útil en escenarios como:

* Limpieza global del store
* Logout forzado
* Reinicio de la aplicación

Al devolver directamente `initialState`, se garantiza que no queden residuos de estado previo.

---

## Manejo de acciones asíncronas (`extraReducers`)

Este bloque gestiona el ciclo de vida de los **thunks de autenticación** definidos externamente.

```ts
import { login, fetchUserThunk, logout } from './authThunk';
```

Cada thunk genera automáticamente tres estados: `pending`, `fulfilled` y `rejected`.

---

### Login

#### `login.pending`

```ts
state.loading = true;
state.error = null;
```

Indica que el proceso de autenticación ha comenzado. Se limpia cualquier error previo para evitar inconsistencias visuales.

---

#### `login.fulfilled`

```ts
state.loading = false;
state.isAuthenticated = true;
```

Marca la sesión como autenticada. En este punto aún no se asigna el usuario, ya que normalmente este se obtiene mediante un thunk separado.

---

#### `login.rejected`

```ts
state.loading = false;
state.error = action.payload?.detail || 'Error desconocido';
```

Finaliza el estado de carga y almacena el mensaje de error. Se prioriza el mensaje entregado por el backend, con un fallback genérico.

---

### Obtención del usuario autenticado (`fetchUserThunk`)

#### `fetchUserThunk.pending`

```ts
state.loading = true;
```

Indica que se está validando o recuperando la sesión actual.

---

#### `fetchUserThunk.fulfilled`

```ts
state.loading = false;
state.user = action.payload;
state.isAuthenticated = true;
```

Actualiza el estado con la información del usuario y confirma que la sesión es válida.

---

#### `fetchUserThunk.rejected`

```ts
state.loading = false;
state.isAuthenticated = false;
state.user = null;
```

Se ejecuta cuando el token no es válido o la sesión ha expirado. El estado vuelve a una condición no autenticada.

---

### Logout

#### `logout.fulfilled`

```ts
state.user = null;
state.isAuthenticated = false;
```

Elimina la información del usuario y marca la sesión como cerrada. El estado de carga no se utiliza aquí porque el efecto principal es inmediato en el frontend.

---

## Acciones exportadas

```ts
export const { clearError, clearStore } = authSlice.actions;
```

Estas acciones pueden ser utilizadas directamente desde componentes o middlewares para controlar el estado sin depender de thunks.

---

## Reducer exportado

```ts
export default authSlice.reducer;
```

El reducer es el punto de integración con el store global de Redux.

---

## Resumen técnico

Este slice:

* Centraliza el estado de autenticación
* Maneja de forma explícita estados de carga, error y sesión
* Se integra limpiamente con thunks asíncronos
* Evita lógica de autenticación dispersa en los componentes

---