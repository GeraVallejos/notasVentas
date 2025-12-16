# <font color=#ff5733>Arquitectura de Rutas – loader</font>

## Loaders de Autenticación – `privateLoader` y `publicLoader`

### Propósito

Los loaders se ejecutan **antes del renderizado** y permiten:

* Validar sesión
* Cargar datos globales
* Redirigir sin renderizar componentes

Este enfoque evita:

* Parpadeos de UI
* Renderizado innecesario
* Lógica de auth en componentes

---

### `privateLoader`

```js
export const privateLoader = async () => {
  const { user } = store.getState().auth;
  if (user) return null;

  try {
    await store.dispatch(fetchUserThunk()).unwrap();
    return null;
  } catch {
    throw new Response('Unauthorized', {
      status: 302,
      headers: { Location: '/login' },
    });
  }
};
```

#### Flujo lógico

1. Se revisa el estado global (`Redux`).
2. Si el usuario ya existe → acceso inmediato.
3. Si no existe:

   * Se intenta recuperar sesión (`fetchUserThunk`).
4. Si falla → redirección a `/login`.

**Ventaja:**

* La sesión se valida una sola vez por navegación.

---

### `publicLoader`

```js
export const publicLoader = async () => {
  const { user } = store.getState().auth;

  if (user) {
    throw new Response('Already Authenticated', {
      status: 302,
      headers: { Location: '/notas' },
    });
  }

  try {
    await store.dispatch(fetchUserThunk()).unwrap();
    throw new Response('Already Authenticated', {
      status: 302,
      headers: { Location: '/notas' },
    });
  } catch {
    return null;
  }
};
```

#### Flujo lógico

* Evita que usuarios autenticados accedan a `/login`.
* Reutiliza la misma lógica de recuperación de sesión.

**Resultado:**

* UX limpia y consistente.

---