## ¿Para qué sirve este componente?

`EditNotaModal` es un **modal de edición de una Nota de Venta** que permite:

1. Editar datos generales de la nota
2. Editar datos del cliente asociados a la nota
3. Detectar automáticamente si se modificaron datos del cliente
4. Preguntar al usuario si desea **actualizar también al cliente**
5. Guardar los cambios de forma segura usando la API

---

## Imports y dependencias

### UI (Material UI)

Se utilizan componentes de MUI para construir el modal y los formularios:

* `Dialog`, `DialogContent`, `DialogActions`: estructura del modal
* `TextField`, `Select`, `MenuItem`: campos de formulario
* `FormControl`, `FormHelperText`: manejo de errores
* `Stack`, `Box`, `Typography`: layout y texto

---

### Formularios y validación

```js
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

* **React Hook Form** maneja el estado del formulario
* **Yup** define las reglas de validación
* `Controller` se usa para componentes controlados (DatePicker, Select, Autocomplete)

---

### Fechas y horas

```js
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { parse, format, isValid } from 'date-fns';
```

Permiten convertir correctamente fechas y horas entre:

* `Date`
* string (`HH:mm`)
* formato visual (`dd/MM/yyyy`)

---

## Esquema de validación (Yup)

```js
const schema = yup.object().shape({
  num_nota: yup.number().required('Número de nota requerido'),
  razon_social: yup.string().required('Nombre del cliente requerido'),
  fecha_despacho: yup
    .date()
    .required('Fecha de despacho requerida')
    .typeError('Fecha inválida'),
  telefono: yup
    .string()
    .matches(/^[1-9]\d{8}$/, 'Debe tener 9 dígitos')
    .required('Teléfono requerido'),
  despacho_retira: yup.string().required('Debe elegir despacho o retira'),
  estado_solicitud: yup
    .string()
    .oneOf(['SOLICITADO', 'NO SOLICITADO'])
    .required('Estado obligatorio'),
});
```

### Lógica clave

* `typeError` evita errores silenciosos con fechas inválidas
* `matches` valida teléfonos chilenos
* `oneOf` restringe valores permitidos

---

## Inicialización del formulario

```js
const methods = useForm({
  resolver: yupResolver(schema),
  mode: 'onTouched',
  defaultValues: {}
});
```

* La validación ocurre al tocar campos
* Los valores se cargan dinámicamente con `reset()`

---

## Estados locales

```js
const [loading, setLoading] = useState(false);
const [clienteOriginal, setClienteOriginal] = useState(null);
const [confirmarActualizacion, setConfirmarActualizacion] = useState(false);
```

| Estado                   | Función                           |
| ------------------------ | --------------------------------- |
| `loading`                | Bloquea botones durante guardado  |
| `clienteOriginal`        | Snapshot para detectar cambios    |
| `confirmarActualizacion` | Controla el modal de confirmación |

---

## Carga de datos al abrir el modal

```js
useEffect(() => {
  if (nota) {
    setClienteOriginal({ ... });
    reset({ ...nota });
  }
}, [nota]);
```

### Qué hace este efecto

* Guarda los datos originales del cliente
* Normaliza teléfono (sin +56)
* Convierte fechas string → `Date`
* Rellena el formulario completo

---

## Detección de campos editados

```js
const camposEditados = useMemo(() => {
  if (!clienteOriginal) return [];
  return campos.filter(c => actuales[c] !== clienteOriginal[c]);
}, [...]);
```

### ¿Por qué es importante?

* Evita actualizar el cliente sin necesidad
* Permite mostrar exactamente **qué cambió**
* Mejora la UX y reduce errores

---

## Flujo de envío del formulario

### 1️⃣ Submit principal

```js
const onSubmit = async (data) => {
  if (camposEditados.length > 0) {
    setConfirmarActualizacion(true);
  } else {
    guardarNota(data);
  }
};
```

| Escenario          | Acción          |
| ------------------ | --------------- |
| Cliente modificado | Preguntar       |
| Solo nota          | Guardar directo |

---

### 2️⃣ Guardar solo la nota

```js
await api.put(`/nota/${nota.id_nota}/`, payload);
```

* Normaliza teléfono
* Convierte fecha a ISO
* Cierra modal al finalizar

---

### 3️⃣ Actualizar cliente + nota

```js
await api.patch('/cliente/por-rut/', clientePayload);
await guardarNota(data);
```

Primero actualiza cliente, luego la nota.

---

## Modal de confirmación

Este modal aparece **solo si se modificaron datos del cliente**:

* Muestra los campos editados en rojo
* Permite decidir si actualizar o no

Esto protege la base de datos de cambios accidentales.

---

## Conclusión

Este componente:

* Aplica correctamente **React Hook Form + Yup**
* Tiene una lógica clara y mantenible
* Maneja fechas y horas de forma segura
* Implementa una excelente experiencia de usuario
* Está listo para escalar o reutilizarse

---


