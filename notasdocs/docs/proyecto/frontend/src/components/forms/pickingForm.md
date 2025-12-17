## 1. Propósito general del componente

El componente **`PickingForm`** implementa un formulario completo para **registrar productos asociados a una nota de venta** (o sin nota), permitiendo:

* Buscar una nota y cargar automáticamente datos del cliente
* Agregar múltiples productos a una **vista previa local**
* Validar reglas de negocio complejas (nota vs local)
* Enviar los productos al backend **uno a uno**, manejando errores parciales

Este enfoque evita perder todo el formulario si un producto falla y mejora la experiencia del usuario.

---

## 2. Dependencias y librerías clave

### Formularios y validación

* `react-hook-form`: manejo del estado del formulario
* `yup` + `@hookform/resolvers/yup`: validación declarativa

### UI

* `@mui/material`: layout, inputs y tabla
* `@mui/icons-material`: iconos de acción

### Utilidades

* `api`: cliente HTTP centralizado
* `notistack`: notificaciones
* `date-fns`: parseo y formateo de fechas

---

## 3. Esquema de validación (`schema`)

El schema **recibe `productosAgregados` como parámetro**, lo que permite validar en función del estado actual.

### Reglas importantes

* `cantidad`

  * Debe ser número entero positivo
  * Se transforma `'' → null` para evitar errores

* `tipo` (Local)

  * **Obligatorio solo si no hay nota**
  * Si no hay nota:

    * Todos los productos agregados deben tener tipo
    * O el formulario debe tener tipo seleccionado

Esto se logra con un `test` personalizado de Yup que inspecciona:

* El valor actual
* Los valores hermanos (`nota`)
* El estado externo (`productosAgregados`)

---

## 4. Helper: `transformMayus`

```js
const transformMayus = (obj, excluir = []) => { ... }
```

### Función

* Convierte a **mayúsculas todos los strings** del payload
* Permite excluir campos específicos

### Motivo

* Normalizar datos antes de enviarlos al backend
* Evitar inconsistencias (ej: observaciones, tipos)

---

## 5. Estado local del componente

```js
const [loading, setLoading]
const [productosAgregados, setProductosAgregados]
const [notaValida, setNotaValida]
```

* `loading`: deshabilita el submit
* `productosAgregados`: vista previa local (tabla)
* `notaValida`: controla si se permite guardar

Este estado **no depende del formulario**, sino del flujo del negocio.

---

## 6. Inicialización del formulario (`useForm`)

* Usa `yupResolver(schema(productosAgregados))`
* `mode: onTouched` → errores aparecen al interactuar
* `defaultValues` explícitos para evitar `undefined`

Esto asegura consistencia incluso tras resets parciales.

---

## 7. Handler `handleBlurNota`

### Flujo

1. El usuario sale del input `nota`
2. Si está vacío:

   * Limpia datos del cliente
   * Marca la nota como válida
3. Si hay valor:

   * Consulta al backend `/nota/cliente_por_nota/`
   * Carga:

     * Cliente
     * Fecha despacho (formateada)
     * Tipo despacho
     * `nota_id`

### Manejo de error

* Si no existe la nota:

  * Limpia campos
  * Muestra snackbar
  * Marca `notaValida = false`

---

## 8. Agregar producto (`handleAgregarProducto`)

Este método **NO envía datos al backend**, solo actualiza la vista previa.

### Validaciones manuales

* Producto válido seleccionado desde el buscador
* Cantidad ingresada
* Si no hay nota → tipo obligatorio

### Acción

* Construye un objeto normalizado
* Lo agrega a `productosAgregados`
* Limpia solo los campos relacionados al producto

Esto permite agregar múltiples productos sin perder la nota o el cliente.

---

## 9. Eliminación de producto

```js
handleEliminarProducto(index)
```

* Elimina por índice
* No afecta el formulario ni el backend

---

## 10. Envío final (`onSubmit`)

### Paso a paso

1. Verifica `notaValida`
2. Si hay un producto escrito pero no agregado → lo agrega
3. Verifica que exista al menos un producto
4. Si no hay nota:

   * Todos los productos deben tener tipo

---

## 11. Envío al backend (loop controlado)

Cada producto se envía **individualmente**:

```js
for (const producto of productosAEnviar) {
  await api.post(...)
}
```

### Ventajas

* Permite errores parciales
* No bloquea todo el pedido

### Manejo de resultados

* `guardadosExitosamente`
* `fallidos`

Se muestran snackbars resumidos y luego:

* Se mantienen en la tabla **solo los fallidos**

---

## 12. Limpieza final

* Limpia solo los campos de producto
* Mantiene nota y cliente
* `loading` vuelve a `false`

---

## 13. Renderizado del JSX

### Estructura visual

* Layout en dos columnas
* Izquierda: entrada de nota y productos
* Derecha: datos del cliente
* Tabla condicional de vista previa
* Botón de guardado final

### Puntos clave

* Uso de `Controller` para inputs controlados
* `SearchSelect` desacopla la búsqueda de productos
* Botón `+` incrustado en el input de cantidad

---

## 14. Decisiones de diseño importantes

* Vista previa local antes de persistir
* Validaciones duplicadas (Yup + lógica) por reglas complejas
* Envío por producto para tolerancia a fallos
* Normalización de datos previa al POST

---

## 15. Posibles mejoras futuras

* Extraer lógica a un hook (`usePickingForm`)
* Memoizar schema para grandes listas
* Reemplazar índice por ID temporal en la tabla
* Mostrar spinner por producto al guardar

---


