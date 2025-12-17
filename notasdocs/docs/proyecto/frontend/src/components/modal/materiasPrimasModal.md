## 1. Propósito del componente

`MateriasPrimasModal` es un **modal de edición** que permite actualizar un pedido existente de **materias primas**. Su función principal es:

* Mostrar los datos actuales de un pedido
* Permitir modificar proveedor, producto, cantidad, fechas y observaciones
* Validar los datos antes de enviarlos
* Persistir los cambios mediante una llamada `PATCH` al backend

El componente **no crea pedidos nuevos**, solo edita uno existente identificado por `pedido.id_pedido`.

---

## 2. Props que recibe

```jsx
const MateriasPrimasModal = ({ open, onClose, pedido, onUpdated })
```

* `open` (boolean): controla si el modal está visible
* `onClose` (function): cierra el modal
* `pedido` (object): pedido a editar (datos actuales)
* `onUpdated` (function): callback para refrescar la vista padre luego de guardar

---

## 3. Validación con Yup

```js
const schema = yup.object().shape({
  producto: yup.string().required("Selecciona un producto"),
  cantidad: yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("Campo obligatorio"),
  observacion: yup.string().nullable(),
});
```

Reglas clave:

* El producto es obligatorio
* La cantidad debe ser un número positivo
* La observación es opcional

El schema se conecta al formulario mediante `yupResolver`.

---

## 4. Inicialización del formulario

```js
const { control, handleSubmit, reset, setValue, formState } = useForm({
  resolver: yupResolver(schema),
  defaultValues: { ... }
});
```

Campos relevantes:

* Datos del proveedor (`rut_proveedor`, `nombre_proveedor`)
* Datos del producto (`producto`, `id_producto`, `unidad_medida`)
* Información del pedido (`cantidad`, `fecha_entrega`, `observacion`)

---

## 5. Función transformMayus

```js
const transformMayus = (obj, excluir = []) => { ... }
```

Responsabilidad:

* Convierte todos los strings a mayúsculas
* Permite excluir campos específicos (ej. correos)

Se aplica **justo antes de enviar datos al backend** para mantener consistencia.

---

## 6. Carga de datos al abrir el modal

```js
useEffect(() => {
  const fechaEntrega = pedido.fecha_entrega
    ? parse(pedido.fecha_entrega, 'dd/MM/yyyy', new Date())
    : null;

  reset({ ... });
}, [pedido, reset]);
```

Qué hace:

* Cada vez que cambia `pedido`, el formulario se reinicializa
* Convierte la fecha desde string a `Date`
* Precarga todos los campos visibles

Esto asegura que **si se edita otro pedido, el formulario se actualiza correctamente**.

---

## 7. Manejo del RUT del proveedor

### Formateo en tiempo real

```js
const handleChangeRut = (e) => {
  const formattedValue = formatearRut(e.target.value);
  setValue('rut_proveedor', formattedValue, { shouldValidate: true });
};
```

* Aplica formato chileno al RUT mientras se escribe
* Mantiene validación activa

### Búsqueda al perder foco

```js
const handleBlurRut = async (e) => { ... }
```

Flujo:

1. Si el campo está vacío, no hace nada
2. Consulta el backend por RUT
3. Si existe, completa razón social e ID
4. Si no existe, limpia campos y muestra advertencia

---

## 8. Selección de proveedor y producto

Se usa el componente reutilizable `SearchSelect`.

### Proveedor

* Endpoint: `/pedido_materias_primas/buscar-proveedores`
* Al seleccionar:

  * Se setea `rut_proveedor`
  * Se setea `id_proveedor`

### Producto

* Endpoint: `/pedido_materias_primas/buscar-productos`
* Al seleccionar:

  * Se setea `id_producto`
  * Se setea `unidad_medida`

Esto evita errores manuales y asegura consistencia con la base de datos.

---

## 9. Envío del formulario (onSubmit)

```js
const onSubmit = async (data) => { ... }
```

Pasos:

1. Verifica que exista `pedido.id_pedido`
2. Construye el payload con los campos editables
3. Convierte strings a mayúsculas
4. Llama a `PATCH /pedido_materias_primas/:id`
5. Muestra feedback visual
6. Ejecuta `onUpdated()`
7. Cierra el modal

En caso de error:

* Muestra mensaje de error
* Mantiene el modal abierto

---

## 10. Estado de guardado

```js
const [saving, setSaving] = useState(false);
```

Se utiliza para:

* Deshabilitar botones
* Evitar múltiples envíos
* Mostrar estado "Guardando..."

---

## 11. Render del modal

Estructura general:

* `Dialog`: contenedor principal
* `DialogTitle`: título del modal
* `DialogContent`: formulario
* `DialogActions`: botones finales

El formulario está dividido con `Grid` para una distribución clara y responsive.

---

## 12. Flujo completo del usuario

1. Usuario abre modal
2. Se cargan los datos del pedido
3. Modifica proveedor / producto / cantidad / fecha
4. Presiona Guardar
5. Se validan los datos
6. Se actualiza el pedido en backend
7. Se refresca la vista principal
8. Se cierra el modal

---

## 13. Buenas prácticas aplicadas

* Separación clara de responsabilidades
* Validaciones declarativas con Yup
* Control de estado de carga
* Reutilización de componentes (`SearchSelect`)
* Manejo defensivo de errores
* Formularios controlados con `react-hook-form`

---

## 14. Conclusión

Este componente está correctamente diseñado para edición segura de pedidos de materias primas. Es consistente con el resto del proyecto y sigue un patrón reutilizable para futuros modales de edición.


