## 1. Propósito del componente

`MPrimasForm` es un formulario React encargado de **crear pedidos de materias primas (insumos)**. El componente permite:

* Buscar y validar proveedores por RUT
* Buscar y validar productos por código
* Autocompletar datos relacionados
* Validar información antes del envío
* Crear el pedido mediante la API

Está construido sobre **React Hook Form**, **MUI**, **MUI X Pickers** y **Axios**, siguiendo el mismo patrón de formularios del proyecto.

---

## 2. Dependencias principales

```ts
useSnackbar            // Feedback visual al usuario
usePrimasForm          // Hook de RHF con validaciones
api                    // Cliente Axios centralizado
formatearRut           // Normalización de RUT chileno
date-fns               // Manejo de fechas
MUI + Pickers          // UI
SearchSelect           // Autocomplete con búsqueda remota
```

Cada dependencia cumple una función clara y separada, evitando lógica duplicada dentro del componente.

---

## 3. Estructura general del componente

```tsx
const MPrimasForm = () => {
  helpers
  form = usePrimasForm(onSubmit)
  handlers
  return JSX
}
```

El archivo mantiene una estructura lineal:

1. Hooks y helpers
2. Lógica de submit
3. Handlers de eventos
4. Render JSX

---

## 4. Helper: transformación a mayúsculas

```ts
const transformMayus = (obj, excluir = []) => {
  const nuevoObj = { ...obj };
  for (const key in nuevoObj) {
    if (typeof nuevoObj[key] === 'string' && !excluir.includes(key)) {
      nuevoObj[key] = nuevoObj[key].toUpperCase();
    }
  }
  return nuevoObj;
};
```

### Función

* Normaliza strings antes de enviarlos al backend
* Permite excluir campos sensibles (ej: correos)
* Centraliza una regla de negocio frecuente

---

## 5. Inicialización del formulario

```ts
const form = usePrimasForm(async (data) => { ... })
```

`usePrimasForm` encapsula:

* `useForm`
* esquema de validación (Yup o similar)
* `onSubmit`

Esto mantiene el componente liviano y enfocado solo en flujo.

---

## 6. Flujo de envío del formulario

### 6.1 Búsqueda de proveedor (opcional)

```ts
if (data.rut_proveedor) {
  const { data: provData } = await api.get('/proveedores/por-rut/', { ... })
}
```

* El proveedor **no es obligatorio**
* Si no existe, se notifica pero no se bloquea el flujo

---

### 6.2 Búsqueda de producto (obligatoria)

```ts
const { data: prodData } = await api.get('/productos/por-codigo/', { ... })
```

* Si el producto no existe, el flujo se **interrumpe**
* No se permite crear pedidos sin producto válido

---

### 6.3 Construcción del payload

```ts
const payload = {
  id_proveedor,
  id_producto,
  cantidad,
  unidad_medida,
  fecha_entrega,
  observacion,
};
```

Se envía únicamente la información necesaria, manteniendo desacoplado el backend del formulario.

---

### 6.4 Envío a la API

```ts
await api.post('/pedido_materias_primas/', transformMayus(payload));
```

* Normalización previa
* Manejo de errores HTTP
* Feedback visual

---

## 7. Handlers de campos

### 7.1 RUT del proveedor

```ts
const handleChangeRut = (e) => {
  const formattedValue = formatearRut(e.target.value);
  form.setValue('rut_proveedor', formattedValue);
};
```

* Formatea en tiempo real
* Mantiene el valor siempre válido

```ts
const handleBlurRut = async (e) => { ... }
```

* Busca proveedor al perder foco
* Autocompleta razón social e ID
* Limpia campos si no existe

---

### 7.2 Código de producto

```ts
const handleBlurProducto = async (e) => { ... }
```

* Autocompleta:

  * nombre
  * unidad de medida
  * ID interno

---

## 8. Integración con SearchSelect

```tsx
<SearchSelect
  name="razon_social"
  endpoint="/pedido_materias_primas/buscar-proveedores"
/>
```

* Permite búsqueda remota con debounce
* Sincroniza valores adicionales al seleccionar
* Reutilizable en otros formularios

---

## 9. Manejo de fechas

```tsx
<DatePicker
  value={parseISO(form.watch('fecha_entrega'))}
  onChange={(date) => form.setValue('fecha_entrega', format(date, 'yyyy-MM-dd'))}
/>
```

* El formulario almacena **strings ISO**
* El picker trabaja con `Date`
* Conversión explícita y validada

---

## 10. Envío del formulario

```ts
const handleSubmitPrima = (e) => {
  e.preventDefault();
  form.onSubmit();
};
```

Separar el submit permite:

* lógica previa
* extensiones futuras
* mejor legibilidad

---

## 11. Render JSX

* `FormProvider` comparte el contexto del formulario
* `Controller` se usa para inputs complejos
* `Grid + Stack` organizan el layout
* El botón refleja el estado `isSubmitting`

---

## 12. Decisiones técnicas

* RHF para performance y control
* API desacoplada
* Autocompletado progresivo
* Normalización centralizada
* Componentes reutilizables

---

## 13. Resultado

Este componente implementa un **flujo robusto y escalable** para pedidos de insumos, manteniendo:

* buena UX
* reglas de negocio claras
* código mantenible

