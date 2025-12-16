# <font color=#ff5733>Redux Toolkit</font>

Redux Toolkit (RTK) es la forma oficial y recomendada de usar **Redux** para el manejo de estado global en aplicaciones React. Fue diseñado para reducir el boilerplate, estandarizar buenas prácticas y simplificar patrones complejos presentes en Redux clásico.

---

## ¿Por qué Redux Toolkit?

Redux Toolkit resuelve los principales problemas históricos de Redux:

* Exceso de código repetitivo (actions, reducers, constants).
* Configuración compleja del store.
* Manejo manual de inmutabilidad.
* Curva de aprendizaje elevada.

RTK proporciona abstracciones de alto nivel que encapsulan estas complejidades sin perder control ni predictibilidad.

---

## Teoría detrás de Redux Toolkit: Fundamentos y Funcionamiento Interno

### 🔷 1. Arquitectura de Redux Toolkit

Redux Toolkit se construye sobre Redux, integrando varias herramientas clave:

**A. Store (Single Source of Truth)**

* El estado global se almacena en un único objeto centralizado.
* Solo puede modificarse mediante acciones.

RTK provee `configureStore`, que:

* Combina reducers automáticamente.
* Incluye middleware por defecto (`redux-thunk`).
* Habilita Redux DevTools sin configuración adicional.

```js
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});
```

---

**B. Reducers + Actions (Slices)**

RTK introduce el concepto de **slice**, que agrupa:

* Estado inicial
* Reducers
* Action creators

Todo en una sola definición.

```js
import { createSlice } from '@reduxjs/toolkit';

const exampleSlice = createSlice({
  name: 'example',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Mutación segura con Immer
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = exampleSlice.actions;
export default exampleSlice.reducer;
```

> Internamente, RTK utiliza **Immer**, lo que permite escribir código mutable que se convierte en inmutable de forma segura.

---

**C. Middleware y Thunks**

Redux Toolkit incluye **redux-thunk** por defecto para manejar lógica asíncrona.

Para ello se utiliza `createAsyncThunk`, que genera automáticamente:

* Acción `pending`
* Acción `fulfilled`
* Acción `rejected`

```js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get('/api/users');
    return response.data;
  }
);
```

---

### 🔷 2. Flujo de Datos en Redux Toolkit

1. El componente despacha una acción (`dispatch`).
2. El reducer del slice procesa la acción.
3. Immer genera un nuevo estado inmutable.
4. El store notifica a los componentes suscritos.
5. React vuelve a renderizar con el nuevo estado.

Este flujo sigue estrictamente el patrón **unidireccional** de Redux.

---

### 🔷 3. Manejo de Estado Asíncrono

Ejemplo completo con `extraReducers`:

```js
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

---

### 🔷 4. Integración con React

Redux Toolkit se utiliza junto a **react-redux**.

#### Configuración del Provider

```js
import { Provider } from 'react-redux';
import { store } from './store';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

#### Uso en componentes

```js
import { useDispatch, useSelector } from 'react-redux';

function Counter() {
  const value = useSelector((state) => state.example.value);
  const dispatch = useDispatch();

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

---

### 🔷 5. Normalización y Escalabilidad

Buenas prácticas recomendadas:

* Un slice por dominio funcional.
* Evitar lógica compleja dentro de componentes.
* Centralizar llamadas a API en thunks.
* Normalizar entidades cuando el estado crece (por id).

---

### 🔷 6. Redux Toolkit + React Router

Redux Toolkit puede convivir con loaders/actions de React Router:

* Redux: estado global (auth, usuario, UI).
* Router loaders: datos específicos de rutas.

No se recomienda duplicar datos entre ambos.

---

### 🔷 7. Redux Toolkit vs Redux Clásico

| Característica | Redux Toolkit      | Redux Clásico        |
| -------------- | ------------------ | -------------------- |
| Boilerplate    | Bajo               | Alto                 |
| Inmutabilidad  | Automática (Immer) | Manual               |
| Async          | createAsyncThunk   | Thunks manuales      |
| DevTools       | Incluido           | Configuración manual |
| Escalabilidad  | Alta               | Compleja             |

---

### Mejores Prácticas con Redux Toolkit

* Usar RTK como única forma de Redux.
* Mantener slices pequeños y enfocados.
* No mutar estado fuera de reducers.
* Usar selectors para desacoplar componentes.

---

Redux Toolkit proporciona una arquitectura robusta, predecible y escalable para el manejo de estado global en aplicaciones React modernas.

---
