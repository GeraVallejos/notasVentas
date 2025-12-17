Este archivo concentra toda la **lógica asíncrona de autenticación** de la aplicación utilizando `createAsyncThunk` de Redux Toolkit. Su objetivo principal es **comunicarse con la API**, manejar errores de forma controlada y exponer resultados claros al `authSlice`, manteniendo una separación estricta entre lógica de red y manejo de estado.

---

## Importaciones

```js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';
```

* `createAsyncThunk`: utilidad de Redux Toolkit que simplifica la creación de acciones asíncronas y genera automáticamente los estados `pending`, `fulfilled` y `rejected`.
* `api`: instancia centralizada (normalmente Axios) encargada de la configuración base de las peticiones HTTP (baseURL, headers, interceptores, tokens, etc.).

---

## Thunk: `login`

```js
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/token/', credentials);
      return res.data.message;
    } catch (error) {
      const message = error.response?.data?.detail || 'Error de login';
      return thunkAPI.rejectWithValue({ detail: message });
    }
  }
);
```

### Responsabilidad

Gestionar el proceso de autenticación enviando las credenciales al backend y reportar el resultado al store.

### Flujo de ejecución

1. **Entrada de datos**
   `credentials` contiene las credenciales del usuario (por ejemplo, `username` y `password`).

2. **Solicitud HTTP**
   Se realiza un `POST` al endpoint `/token/`, que valida las credenciales.

3. **Resultado exitoso**

   ```js
   return res.data.message;
   ```

   El valor retornado será recibido por el reducer en el caso `fulfilled`.

4. **Manejo de error**

   ```js
   return thunkAPI.rejectWithValue({ detail: message });
   ```

   * Permite propagar un error controlado.
   * Evita lanzar excepciones no manejadas.
   * Facilita mostrar mensajes de error coherentes en la UI.

---

## Thunk: `fetchUserThunk`

```js
export const fetchUserThunk = createAsyncThunk(
  'auth/fetchUserThunk',
  async (_, thunkAPI) => {

    if (window.location.pathname === '/login') {
      return;
    }

    try {
      const res = await api.get('/usuario/actual/');
      return res.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue({ detail: 'Usuario no autenticado' });
    }
  }
);
```

### Responsabilidad

Obtener la información del usuario actualmente autenticado y sincronizarla con el estado global.

### Flujo de ejecución

1. **Condición preventiva**

   ```js
   if (window.location.pathname === '/login') return;
   ```

   Evita realizar la llamada cuando el usuario se encuentra en la pantalla de login.

2. **Solicitud protegida**
   Se consulta el endpoint `/usuario/actual/`, el cual depende de un token o sesión válida.

3. **Resultado exitoso**

   ```js
   return res.data;
   ```

   La información del usuario se almacena posteriormente en `state.user`.

4. **Error de autenticación**

   ```js
   rejectWithValue({ detail: 'Usuario no autenticado' })
   ```

   Permite al slice limpiar el estado de sesión.

---

## Thunk: `logout`

```js
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await api.post('/usuario/logout/');
      return true;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue({ detail: 'Error al cerrar sesión' });
    }
  }
);
```

### Responsabilidad

Cerrar la sesión del usuario tanto a nivel de backend como de estado global.

### Flujo de ejecución

1. **Solicitud de cierre de sesión**
   Se envía un `POST` al endpoint `/usuario/logout/`.

2. **Resultado exitoso**

   ```js
   return true;
   ```

   El valor no es relevante; el reducer solo necesita saber que la acción se completó correctamente.

3. **Error**
   Se propaga un error controlado mediante `rejectWithValue`.

---

## Integración con `authSlice`

Estos thunks están diseñados para ser consumidos por el `authSlice` mediante `extraReducers`, permitiendo:

* Control centralizado del estado de autenticación
* Manejo consistente de estados `loading`, `error` e `isAuthenticated`
* Separación clara entre lógica asíncrona y reducers

---

## Conclusión

Este archivo actúa como la **capa de orquestación de autenticación**, garantizando:

* Código predecible y mantenible
* Manejo de errores uniforme
* Escalabilidad del sistema de autenticación

---
