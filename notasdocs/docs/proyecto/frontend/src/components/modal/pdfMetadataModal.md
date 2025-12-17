## 1. Propósito del componente

`PDFMetadataModal` es un modal reutilizable que permite **ingresar y editar metadatos asociados a un archivo PDF** antes de guardarlo o subirlo al sistema.

Se utiliza típicamente en flujos donde el usuario carga un PDF y necesita asociar información adicional como título, empresa/proveedor y observaciones.

---

## 2. Props del componente

El componente recibe varias props para hacerlo flexible y reutilizable:

* `open` (boolean): controla si el modal está visible.
* `onClose` (function): función que se ejecuta al cerrar el modal.
* `metadata` (object): información del archivo PDF (nombre, tamaño, páginas, etc.).
* `onSave` (function): callback que recibe los datos del formulario al enviar.
* `title` (string, opcional): título del modal.
* `saveButtonText` (string, opcional): texto del botón de guardar.
* `cancelButtonText` (string, opcional): texto del botón de cancelar.

Esto permite reutilizar el mismo modal en distintos contextos sin duplicar lógica.

---

## 3. Manejo del formulario con react-hook-form

El formulario se gestiona con `react-hook-form`, lo que permite:

* Controlar el estado del formulario
* Manejar validaciones
* Evitar estados locales innecesarios

```js
const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
  defaultValues: {
    title: '',
    empresa: '',
    observacion: ''
  }
});
```

Los valores iniciales se definen vacíos y luego se cargan dinámicamente si existe metadata.

---

## 4. Carga de datos iniciales (useEffect)

Cuando el modal se abre y existe `metadata`, se rellenan automáticamente los campos:

* El título se obtiene desde `metadata.title`
* Si no existe, se usa el nombre del archivo sin `.pdf`
* Empresa y observación se cargan si están disponibles

```js
useEffect(() => {
  if (metadata) {
    reset({
      title: metadata.title || metadata.fileName?.replace('.pdf', '') || '',
      empresa: metadata.empresa || '',
      observacion: metadata.observacion || ''
    });
  }
}, [metadata, reset]);
```

Esto evita que el usuario tenga que completar información que ya existe.

---

## 5. Visualización de información del PDF

Si el objeto `metadata` contiene información del archivo, se muestra un bloque informativo:

* Nombre del archivo
* Tamaño
* Cantidad de páginas

Esto se presenta mediante un `Alert` informativo, sin afectar el formulario.

---

## 6. Campo Título

El campo **Título** es obligatorio y se controla con `Controller`:

```js
<Controller
  name="title"
  control={control}
  rules={{ required: 'El título es requerido' }}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      fullWidth
      label="Título *"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      required
    />
  )}
/>
```

La validación se maneja directamente desde `react-hook-form`.

---

## 7. Campo Empresa con SearchSelect

Para seleccionar la empresa o proveedor se utiliza el componente reutilizable `SearchSelect`.

Características:

* Consulta un endpoint remoto
* Permite buscar por texto
* Devuelve un objeto completo al seleccionar

```js
<SearchSelect
  name="empresa"
  control={control}
  label="Empresa / Proveedor"
  endpoint="/pedido_materias_primas/buscar-proveedores"
  getOptionLabel={(option) => {
    if (typeof option === 'string') return option;
    return option.razon_social || option.nombre || '';
  }}
  onSelect={handleEmpresaSelect}
/>
```

Cuando se selecciona una empresa, se guarda automáticamente la razón social en el formulario.

---

## 8. Campo Observación

Campo opcional de texto libre para agregar notas adicionales al documento PDF.

* No es obligatorio
* Permite múltiples líneas
* No tiene validaciones especiales

---

## 9. Envío del formulario

El formulario se envía usando `handleSubmit`:

```js
const onSubmit = (data) => {
  if (onSave) {
    onSave(data);
  }
};
```

El componente no decide qué hacer con los datos, solo los entrega al padre.

---

## 10. Cierre del modal

Al cerrar el modal:

* Se resetea el formulario
* Se ejecuta `onClose` si existe

Esto asegura que al volver a abrir el modal no queden datos residuales.

---

## 11. Comportamiento del botón Guardar

El botón de guardar:

* Usa el atributo `form` para enviar el formulario desde fuera
* Se deshabilita automáticamente mientras `isSubmitting` es `true`
* Cambia el texto según el estado

Esto evita envíos duplicados.

---

## 12. Resumen

Este componente:

* Es reutilizable y desacoplado
* Centraliza la lógica del formulario
* Muestra información relevante del PDF
* Delega la persistencia al componente padre

