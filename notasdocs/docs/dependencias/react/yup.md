# <font color=#ff5733>Yup</font>

Yup es una librería de **validación de esquemas** basada en Promesas, ampliamente utilizada en aplicaciones React para validar formularios y estructuras de datos. Se integra de forma natural con **React Hook Form**, permitiendo definir reglas de validación declarativas, reutilizables y escalables.

En este proyecto, Yup es el estándar para la validación de formularios.

---

## ¿Por qué Yup?

Yup resuelve problemas comunes de validación:

* Validaciones distribuidas y repetidas en componentes.
* Lógica imperativa difícil de mantener.
* Inconsistencias entre frontend y backend.

Ventajas principales:

* Validación declarativa basada en esquemas.
* Soporte para validaciones síncronas y asíncronas.
* Composición y reutilización de reglas.
* Integración directa con React Hook Form.

---

## Teoría detrás de Yup: Fundamentos y Arquitectura

### 🔷 1. Arquitectura de Yup

Yup se basa en el concepto de **Schema Validation**:

* Un schema describe la forma y reglas de un objeto.
* Los datos se validan contra ese schema.
* El resultado es un objeto validado o un conjunto de errores estructurados.

Tipos principales de schemas:

* `string()`
* `number()`
* `boolean()`
* `date()`
* `array()`
* `object()`

```js
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required(),
  age: yup.number().min(18),
});
```

---

### 🔷 2. Flujo de Validación en Yup

1. Se define un schema.
2. Se pasan los datos a validar.
3. Yup ejecuta las reglas de arriba hacia abajo.
4. Se generan errores tipados por campo.
5. Se retorna el resultado o se lanza una excepción.

Este flujo permite validaciones predecibles y reutilizables.

---

### 🔷 3. Tipos de Validación

#### Validación básica

```js
yup.string()
  .required('Campo obligatorio')
  .email('Email inválido');
```

#### Validación condicional

```js
yup.string().when('isCompany', {
  is: true,
  then: (schema) => schema.required(),
  otherwise: (schema) => schema.notRequired(),
});
```

#### Validación basada en múltiples campos

```js
yup.string().oneOf([
  yup.ref('password'),
], 'Las contraseñas no coinciden');
```

---

### 🔷 4. Manejo de Errores

Yup retorna errores estructurados por campo:

```js
{
  name: 'ValidationError',
  errors: ['Campo obligatorio'],
  inner: [
    { path: 'email', message: 'Email inválido' }
  ]
}
```

Esto permite mapear errores fácilmente a la UI.

---

## Integración con React Hook Form

La integración se realiza mediante `@hookform/resolvers/yup`.

```bash
npm install yup @hookform/resolvers
```

---

### Configuración del resolver

```js
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const { control, handleSubmit } = useForm({
  resolver: yupResolver(schema),
});
```

---

### Uso con MUI

```js
<Controller
  name="email"
  control={control}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      label="Email"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )}
/>
```

---

## Validaciones Asíncronas

Yup permite validaciones que dependen de lógica externa:

```js
yup.string().test(
  'email-unique',
  'El email ya existe',
  async (value) => {
    const exists = await api.checkEmail(value);
    return !exists;
  }
);
```

---

## Reutilización y Composición de Schemas

```js
const baseUserSchema = {
  email: yup.string().email().required(),
};

const createUserSchema = yup.object({
  ...baseUserSchema,
  password: yup.string().min(8).required(),
});
```

Este enfoque favorece la escalabilidad del proyecto.

---

## Buenas Prácticas con Yup

* Centralizar schemas en una carpeta (`schemas/`).
* Reutilizar reglas comunes.
* Evitar validaciones complejas dentro de componentes.
* Mantener mensajes de error claros y consistentes.
* Alinear reglas con validaciones del backend.

---

## Yup vs Validación Manual

| Característica  | Yup    | Validación Manual |
| --------------- | ------ | ----------------- |
| Declarativa     | Sí     | No                |
| Reutilizable    | Alta   | Baja              |
| Integración RHF | Nativa | Manual            |
| Escalabilidad   | Alta   | Baja              |
| Mantenibilidad  | Alta   | Baja              |

---

Yup proporciona un sistema de validación robusto, declarativo y escalable, ideal para formularios complejos en aplicaciones React modernas.

---