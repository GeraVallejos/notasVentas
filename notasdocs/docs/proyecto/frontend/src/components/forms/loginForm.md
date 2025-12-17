## Propósito del componente

`LoginForm` implementa el formulario de autenticación del sistema. Su responsabilidad es:

* Capturar credenciales de usuario (username y password)
* Validar y gestionar el formulario usando React Hook Form (mediante un hook personalizado)
* Ejecutar el login contra la API
* Manejar estado visual (loading, mostrar/ocultar contraseña)
* Persistir opcionalmente el username usando `localStorage`

El componente está enfocado exclusivamente en **UI + orquestación**, delegando la lógica de validación al hook `useLoginForm`.

---

## Imports y dependencias

### React

* `useState`: controla estados locales (mostrar contraseña, recordar usuario)
* `useEffect`: inicializa el formulario con datos guardados en localStorage

### MUI

Se utilizan componentes de MUI para estructura y estilo:

* Contenedores: `Box`, `Stack`
* Inputs: `TextField`, `Checkbox`
* Interacción: `Button`, `IconButton`
* Utilidades visuales: `InputAdornment`, `Typography`
* Responsive: `useTheme`, `useMediaQuery`

Los íconos (`Person`, `Lock`, `Visibility`, `VisibilityOff`) se usan únicamente como adornos visuales de los inputs.

### Formularios

* `FormProvider` de React Hook Form permite compartir el contexto del formulario con todos los campos sin pasar props manualmente.
* `useLoginForm` encapsula la configuración del formulario (register, onSubmit, validaciones).

### Infraestructura

* `api`: instancia de Axios configurada para comunicarse con el backend
* `useSnackbar`: muestra mensajes de error al usuario

---

## Estados locales

```ts
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
```

### `showPassword`

* Controla si el campo password se renderiza como `text` o `password`.
* Solo afecta a la UI, no al valor enviado.

### `rememberMe`

* Indica si el username debe persistirse en `localStorage`.
* Se sincroniza manualmente con el checkbox.

---

## Responsive behavior

```ts
const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
```

* Permite ajustar el ancho del formulario según el tamaño de pantalla.
* La lógica responsive se mantiene simple y declarativa.

---

## Inicialización del formulario

```ts
const form = useLoginForm(async (data) => { ... });
```

### Responsabilidad del callback

El callback pasado al hook se ejecuta cuando el formulario es válido y se envía:

1. Maneja la persistencia del username según `rememberMe`
2. Realiza la petición de login
3. Redirige al home en caso de éxito
4. Maneja errores y feedback visual

### Flujo interno

```text
Submit → useLoginForm → callback
                       ├─ localStorage
                       ├─ POST /token/
                       └─ redirect o snackbar error
```

El componente **no** maneja validaciones directamente.

---

## Manejo de login

```ts
await api.post('/token/', data);
window.location.replace('/');
```

* Se usa `replace` en lugar de `navigate` para evitar volver al login con el botón atrás.
* El manejo de tokens queda fuera de este componente (responsabilidad del backend o interceptor).

Errores:

```ts
const msg = error.response?.data?.detail || 'Error al iniciar sesión';
```

* Se prioriza el mensaje entregado por el backend.

---

## Mostrar / ocultar contraseña

```ts
const togglePasswordVisibility = () => setShowPassword(prev => !prev);
```

* Función simple y pura.
* Se conecta directamente al `IconButton` del input.

---

## Persistencia del username

```ts
useEffect(() => {
  const savedUsername = localStorage.getItem('rememberedUsername');
  if (savedUsername) {
    form.setValue('username', savedUsername);
    setRememberMe(true);
  }
}, []);
```

### Lógica

* Solo se ejecuta una vez al montar el componente.
* Sincroniza:

  * estado del checkbox
  * valor del formulario

Esto evita que el formulario tenga lógica duplicada.

---

## Estructura del formulario

### `FormProvider`

Envuelve el formulario para que todos los campos accedan a:

* `register`
* `errors`
* `formState`

Sin prop drilling.

---

## Campo Username

```tsx
<TextField {...form.register('username')} />
```

* El input queda completamente controlado por React Hook Form.
* `error` y `helperText` dependen del estado de validación.
* Se desactiva autocorrect y autocomplete por consistencia.

---

## Campo Password

Características:

* Tipo dinámico (`text` / `password`)
* Ícono de mostrar/ocultar
* Sin autocomplete

```tsx
type={showPassword ? 'text' : 'password'}
```

Toda la lógica visual está desacoplada del valor real del input.

---

## Checkbox "Recordarme"

```ts
onChange={(e) => {
  const checked = e.target.checked;
  setRememberMe(checked);
  if (!checked) {
    localStorage.removeItem('rememberedUsername');
  }
}}
```

* Mantiene sincronía explícita entre UI y almacenamiento.
* Evita estados intermedios inconsistentes.

---

## Botón de envío

```tsx
disabled={form.formState.isSubmitting}
```

* Evita múltiples envíos simultáneos.
* El texto del botón refleja el estado del submit.

---

## Resumen de responsabilidades

| Capa         | Responsabilidad            |
| ------------ | -------------------------- |
| UI           | Renderizar inputs y layout |
| Estado local | UI (password, remember)    |
| Formulario   | Validación y submit (hook) |
| API          | Login                      |
| Feedback     | Snackbar                   |

---

## Observaciones técnicas

* Correcta separación de responsabilidades
* Buen uso de React Hook Form
* Componente fácil de testear
* Bajo acoplamiento con la lógica de negocio

---

## Posibles mejoras

* Extraer lógica de `rememberMe` a un hook
* Manejar loading global de autenticación
* Tipar el formulario con TypeScript
* Manejar errores por código HTTP

---
