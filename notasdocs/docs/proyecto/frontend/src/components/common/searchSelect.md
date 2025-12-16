### ¿Qué es?

`SearchSelect` es un componente reutilizable que implementa un **campo de búsqueda con autocompletado remoto**, integrado con **React Hook Form** y **MUI Autocomplete**.

Está diseñado para trabajar con **endpoints dinámicos** y grandes volúmenes de datos, evitando cargar listas completas en memoria.

---

### Responsabilidades principales

1. Sincronizar el input con React Hook Form.
2. Consultar datos remotos según el texto ingresado.
3. Aplicar debounce para optimizar llamadas HTTP.
4. Renderizar sugerencias dinámicas.
5. Exponer callbacks al seleccionar una opción.

---

### Props del componente

1. `name`

   * Nombre del campo en React Hook Form.

2. `control`

   * Objeto `control` del formulario.

3. `label`

   * Etiqueta visual del input.

4. `endpoint`

   * Ruta de la API para búsqueda.

5. `getOptionLabel`

   * Función que define cómo se muestra cada opción.

6. `onSelect`

   * Callback opcional al seleccionar un elemento.

7. `debounceTime`

   * Tiempo de espera antes de ejecutar la búsqueda.

---

### Estado local

```js
const [options, setOptions] = useState([]);
```

* Almacena las opciones obtenidas desde la API.
* Se actualiza dinámicamente según el texto ingresado.

---

### Lógica de búsqueda

#### Función de consulta

```js
const fetchOptions = async (texto) => {
```

Flujo:

1. Validación de texto vacío

   * Limpia las opciones si no hay input.

2. Llamada al backend

   * Envía el texto como parámetro `q`.

3. Actualización de opciones

   * Se asume que el backend devuelve un array.

---

#### Debounce memoizado

```js
const debouncedFetch = useMemo(
  () => debounce(fetchOptions, debounceTime),
  [endpoint, debounceTime]
);
```

Motivaciones:

1. Evitar llamadas HTTP en cada pulsación.
2. Mantener estabilidad entre renders.
3. Permitir reutilización con distintos endpoints.

---

### Integración con React Hook Form

```jsx
<Controller
  name={name}
  control={control}
  render={({ field, fieldState }) => (
```

* `Controller` actúa como puente entre RHF y MUI.
* Permite manejar inputs no controlados internamente.

---

### Configuración del Autocomplete

Aspectos clave:

1. `freeSolo`

   * Permite escribir valores que no estén en la lista.

2. `value={null}`

   * No se almacenan objetos completos en el formulario.

3. `inputValue={field.value}`

   * El formulario controla únicamente el texto.

---

### Manejo de eventos

#### Cambio de texto

```js
onInputChange={(e, newInputValue) => {
  field.onChange(newInputValue);
  debouncedFetch(newInputValue);
}}
```

* Sincroniza el input con RHF.
* Ejecuta la búsqueda remota con debounce.

---

#### Selección de opción

```js
onChange={(e, value) => {
```

Flujo:

1. Extrae el texto visible usando `getOptionLabel`.
2. Actualiza el formulario con un string.
3. Ejecuta `onSelect` si está definido.

---

### Renderizado del input

```jsx
<TextField
  {...params}
  label={label}
  error={!!fieldState.error}
  helperText={fieldState.error?.message}
/>
```

* Manejo completo de errores desde RHF.
* Componente completamente reutilizable.

---