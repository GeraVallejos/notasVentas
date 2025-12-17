## Archivo: `useLoginForm.js`

Este archivo define un **custom hook** que encapsula toda la lógica del formulario de login usando **React Hook Form** y **Yup** para validaciones.

La idea principal es **reutilizar y simplificar** el manejo del formulario, manteniendo el componente visual limpio.

---

## Responsabilidad del archivo

* Definir el **schema de validación** del login
* Inicializar `react-hook-form` con Yup
* Exponer una API simple para usar el formulario desde un componente

Este hook **no renderiza nada**, solo maneja lógica.

---

## Imports

```js
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

### ¿Por qué estos imports?

* `useForm`: núcleo de React Hook Form
* `yupResolver`: conecta Yup con React Hook Form
* `yup`: define reglas de validación declarativas

---

## Schema de validación

```js
const schema = yup.object().shape({
  username: yup.string().required('Nombre de usuario requerido'),
  password: yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Contraseña requerida'),
});
```

### Qué valida cada campo

* **username**

  * Debe existir
  * No permite vacío

* **password**

  * Debe existir
  * Debe tener al menos 6 caracteres

Los mensajes definidos aquí se mostrarán automáticamente en el formulario.

---

## Custom hook: `useLoginForm`

```js
export const useLoginForm = (onSubmit) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  return {
    ...methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
```

### Parámetro

* `onSubmit`: función que ejecuta la lógica de login (API, Redux, etc.)

Este hook **no sabe qué hace el login**, solo cuándo ejecutarlo.

---

## Configuración de `useForm`

```js
useForm({
  resolver: yupResolver(schema),
  mode: 'onTouched',
});
```

### Qué significa esto

* `resolver`:

  * Usa Yup como motor de validación

* `mode: 'onTouched'`:

  * Valida el campo cuando el usuario lo toca y sale de él
  * Evita errores antes de interactuar

---

## Qué retorna el hook

```js
return {
  ...methods,
  onSubmit: methods.handleSubmit(onSubmit),
};
```

Incluye:

* `register`
* `control`
* `formState` (errors, isSubmitting, etc.)
* `reset`, `setValue`, etc.
* `onSubmit` ya envuelto con validación

Esto permite usar el hook así:

```js
const { register, onSubmit, formState } = useLoginForm(login);
```

---

## Beneficios de este enfoque

* 🔹 Separación de lógica y UI
* 🔹 Validaciones centralizadas
* 🔹 Código más limpio en el componente
* 🔹 Fácil de testear
* 🔹 Reutilizable

---

## Ejemplo de uso (resumen)

```js
const Login = () => {
  const { register, onSubmit, formState } = useLoginForm(handleLogin);

  return (
    <form onSubmit={onSubmit}>
      <input {...register('username')} />
      <input {...register('password')} type="password" />
      <button type="submit">Entrar</button>
    </form>
  );
};
```

---

## Conclusión

Este archivo es un **hook de infraestructura**, ideal para:

* Formularios pequeños y claros
* Reutilización
* Mantener componentes presentacionales simples

Si quieres, el siguiente paso puede ser:

* Extraer **schemas comunes**
* Unificar hooks de formularios
* Agregar tests o tipado con TypeScript
