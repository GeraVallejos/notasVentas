# Hook `useNotaForm`

## Descripción general

El hook `useNotaForm` encapsula **toda la lógica de manejo de formularios y validación** asociada a la creación o edición de una *nota*. Su objetivo principal es **centralizar reglas de validación, valores por defecto y transformación de datos**, desacoplando esta lógica de los componentes visuales.

Está construido sobre **React Hook Form** para el control del estado del formulario y **Yup** para la definición declarativa del esquema de validación.

---

## Dependencias técnicas

```ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

* **react-hook-form**: gestiona el estado, validación y ciclo de vida del formulario.
* **@hookform/resolvers/yup**: permite integrar Yup como motor de validación.
* **yup**: define las reglas de validación de forma declarativa y reutilizable.

---

## Esquema de validación (`schema`)

El esquema Yup define **qué campos existen**, **qué tipo de datos aceptan** y **qué reglas deben cumplirse** antes de permitir el envío del formulario.

```ts
const schema = yup.object().shape({
  num_nota: yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? undefined : value
    )
    .required('Número de nota requerido'),

  razon_social: yup.string().required('Nombre del cliente requerido'),
  rut_cliente: yup.string().required('Rut del cliente requerido'),

  fecha_despacho: yup.date().required('Fecha de despacho requerida'),

  contacto: yup.string().required('Nombre de contacto requerido'),

  correo: yup
    .string()
    .email('Correo inválido')
    .required('Correo requerido'),

  direccion: yup.string().required('Dirección requerida'),
  comuna: yup.string().required('Comuna requerida'),

  telefono: yup
    .string()
    .matches(/^[1-9]\d{8}$/, 'Teléfono debe tener 9 dígitos')
    .required('Teléfono requerido'),

  observacion: yup.string(),

  despacho_retira: yup.string().required('Debe elegir entre despacho o retira'),

  horario_desde: yup.string(),
  horario_hasta: yup.string(),
});
```

### Puntos clave del esquema

* **Transformación de `num_nota`**
  Se utiliza `transform` para evitar que un campo vacío (`''`) sea interpretado como `NaN`. Si el valor original está vacío, se convierte en `undefined`, permitiendo que la validación `required` actúe correctamente.

* **Validación de teléfono**
  Se valida como string con una expresión regular que exige **9 dígitos**, excluyendo el prefijo país, el cual se agrega posteriormente.

* **Campos opcionales**
  `observacion`, `horario_desde` y `horario_hasta` no son obligatorios, pero se incluyen para mantener un modelo de datos consistente.

---

## Inicialización del formulario

```ts
const methods = useForm({
  resolver: yupResolver(schema),
  mode: 'onTouched',
  defaultValues: {
    num_nota: '',
    rut_cliente: '',
    razon_social: '',
    direccion: '',
    comuna: '',
    telefono: '',
    correo: '',
    contacto: '',
    observacion: '',
    fecha_despacho: null,
    horario_desde: '',
    horario_hasta: '',
    despacho_retira: ''
  }
});
```

### Decisiones de implementación

* **`resolver: yupResolver(schema)`**
  Vincula el esquema Yup al ciclo de validación de React Hook Form.

* **`mode: 'onTouched'`**
  La validación se ejecuta cuando el usuario interactúa con un campo, evitando errores prematuros al cargar el formulario.

* **`defaultValues` explícitos**
  Garantizan que todos los campos estén controlados desde el primer render, evitando advertencias de inputs no controlados.

---

## Manejo del submit y transformación de datos

```ts
const handleSubmit = methods.handleSubmit((data) => {
  const dataConPrefijo = {
    ...data,
    telefono: `+56${data.telefono}`,
  };

  onSubmit(dataConPrefijo);
});
```

### Lógica aplicada

* **Separación de responsabilidades**
  La validación ocurre antes de esta función. Aquí solo se transforman los datos finales.

* **Normalización del teléfono**
  Se agrega el prefijo `+56` en el momento del envío, manteniendo el formulario desacoplado de reglas específicas del backend.

* **Delegación del envío**
  El hook no realiza llamadas HTTP. La función `onSubmit` es inyectada desde el componente consumidor, permitiendo reutilización y testing.

---

## API pública del hook

```ts
return {
  ...methods,
  onSubmit: handleSubmit,
};
```

El hook expone:

* Todas las utilidades de `react-hook-form` (`control`, `errors`, `watch`, etc.).
* Una función `onSubmit` ya preparada, validada y con los datos transformados.

---

## Beneficios del enfoque

* Centraliza reglas de negocio del formulario.
* Reduce complejidad en los componentes de UI.
* Facilita mantenimiento y cambios futuros en validaciones.
* Permite reutilizar el formulario en distintos flujos (crear / editar).

---

## Uso esperado

Este hook está diseñado para ser consumido por componentes de formulario que renderizan los inputs y delegan completamente la lógica de validación y envío a `useNotaForm`.
