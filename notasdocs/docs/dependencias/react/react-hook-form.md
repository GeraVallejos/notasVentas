# <font color=#ff5733>React Hook Form</font>

Es una librería ligera (~9KB) para gestionar formularios en React con un enfoque basado en hooks. Sus principales ventajas son:

- Alto rendimiento: Minimiza renders innecesarios.
- Validación fácil: Soporta esquemas (Yup, Zod) o validación nativa.
- Manejo de errores intuitivo: Acceso rápido a mensajes de error.
- Sin dependencias innecesarias: Más liviana que Formik o Redux Form.
- Controlado o No Controlado: Funciona con ambos enfoques.

### Teoría Y Conceptos Clave

**A. Registro de Campos (register)**

Conecta inputs al formulario sin necesidad de estado local.

Ejemplo básico:

```js
<input {...register("nombre")} />
```

Esto registra el campo nombre en el formulario.

**B. Manejo de Envío (handleSubmit)**

RHF procesa los datos cuando el formulario pasa la validación.

Estructura:

```js
const onSubmit = (data) => console.log(data); // "data" = valores del form
<form onSubmit={handleSubmit(onSubmit)}>
```

**C. Validación**

Es posible usar:

Validación nativa (HTML5 + JS):

```js
<input 
  {...register("email", { 
    required: "Email es obligatorio", 
    pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
  })} 
/>
```

Esquemas externos (Yup/Zod):

```js
import { yupResolver } from '@hookform/resolvers/yup';
const schema = yup.object().shape({ email: yup.string().email().required() });

const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });
```

**D. Manejo de Errores (formState.errors)**

Los errores se acceden desde formState.

```js
const { formState: { errors } } = useForm();
<span>{errors.nombre?.message}</span>
```

### Uso Básico

`npm install react-hook-form`

**Ejemplo:**

```js
import { useForm } from 'react-hook-form';

function Formulario() {
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => alert(JSON.stringify(data));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register("nombre", { required: "Campo obligatorio" })} 
        placeholder="Nombre"
      />
      {errors.nombre && <span>{errors.nombre.message}</span>}

      <button type="submit">Enviar</button>
    </form>
  );
}
```

**Validación con Yup**

```js
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Requerido"),
  edad: yup.number().min(18, "Debes ser mayor de edad").required(),
});

function Formulario() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("edad")} type="number" placeholder="Edad" />
      {errors.edad && <p>{errors.edad.message}</p>}
    </form>
  );
}
```

### Características Avanzadas

**A. Formularios Dinámicos (Campos Array)**

Usar useFieldArray para listas de campos:

```js
import { useFieldArray } from 'react-hook-form';

function Form() {
  const { control, register } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "usuarios", // Nombre del array
  });

  return (
    <form>
      {fields.map((item, index) => (
        <div key={item.id}>
          <input {...register(`usuarios.${index}.nombre`)} />
          <button onClick={() => remove(index)}>Eliminar</button>
        </div>
      ))}
      <button onClick={() => append({ nombre: "" })}>Agregar Usuario</button>
    </form>
  );
}
```

**B. Integración con UI Libraries (MUI, Chakra)**

```js
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

function Form() {
  const { control } = useForm();

  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <TextField {...field} label="Email" />
      )}
    />
  );
}
```

**C. Resetear Formulario**

```js
const { reset } = useForm();

<button onClick={() => reset({ nombre: "", email: "" })}>Limpiar</button>
```

---