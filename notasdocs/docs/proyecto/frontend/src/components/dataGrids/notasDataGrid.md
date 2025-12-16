## Propósito del componente

`NotasDataGrid` es un componente de presentación y gestión de datos que utiliza **MUI DataGrid** para mostrar, editar, exportar y eliminar notas de venta. Está diseñado como una vista central de trabajo, donde el usuario puede revisar información estructurada, interactuar con registros individuales y ejecutar acciones controladas según su rol.

El componente no se limita a renderizar una tabla: orquesta la carga de datos, la transformación de fechas, la gestión de permisos, la apertura de modales y la confirmación de acciones destructivas.

---

## Responsabilidades principales

* Obtener notas desde la API
* Filtrar notas según estado
* Normalizar y formatear datos para el DataGrid
* Controlar permisos de eliminación según grupo de usuario
* Abrir modal de edición con datos preparados
* Confirmar y ejecutar eliminación de notas
* Exportar datos visibles a Excel

---

## Función utilitaria `formatearNota`

Antes de que los datos lleguen al DataGrid, cada nota se transforma mediante esta función.

### Objetivos

* Mantener una copia de la fecha original (`fecha_despacho_original`)
* Convertir fechas ISO a formatos legibles
* Separar fecha y hora para columnas independientes
* Asegurar consistencia de tipos (evitar `null` o valores no string)

### Ventajas

* El DataGrid recibe datos listos para mostrar
* Se evita lógica de formateo en las columnas
* Facilita reutilización de los datos en modales y exportación

---

## Estados del componente

* `notas`: lista de notas formateadas
* `loading`: controla el estado de carga inicial
* `modalOpen`: visibilidad del modal de edición
* `notaSeleccionada`: nota activa para edición
* `deletingId`: indica qué fila está siendo eliminada
* `confirmOpen`: controla el diálogo de confirmación
* `notaToDelete`: referencia de la nota a eliminar

Cada estado tiene una única responsabilidad, evitando estados acoplados o ambiguos.

---

## Carga de datos (`fetchNotas`)

Se utiliza `useCallback` para evitar recrear la función en cada render.

### Flujo

1. Se solicita la lista completa de notas a la API
2. Se filtran por `estado_solicitud`
3. Se transforman con `formatearNota`
4. Se actualiza el estado `notas`

El `finally` asegura que el estado `loading` se desactive incluso ante errores.

---

## Control de permisos

```js
const esVentas = userGroups?.includes('Ventas');
```

Este flag define si el usuario pertenece al grupo Ventas.

* Usuarios de Ventas: no pueden eliminar
* Otros usuarios: ven la columna de eliminación

La lógica se resuelve a nivel de columnas, no en la UI condicional, lo que mantiene el DataGrid coherente.

---

## Definición de columnas

### Columnas base

Incluyen información comercial, logística y de auditoría:

* Cliente
* Fechas
* Contacto
* Estado
* Usuario creador/modificador

### Columna de eliminación

* No exportable
* No sortable
* Detiene propagación del evento para evitar abrir el modal
* Muestra estado de carga individual por fila

La columna solo se agrega si el usuario tiene permisos.

---

## Interacción con filas

### Doble clic

Abre el modal de edición y transforma la nota al formato esperado por el formulario.

Se renombran campos y se normalizan valores como teléfono y fechas.

---

## Eliminación de notas

La eliminación sigue un flujo seguro:

1. Solicitud de eliminación
2. Apertura de diálogo de confirmación
3. Llamada a la API
4. Actualización optimista del estado
5. Manejo de errores

Esto evita pérdidas accidentales de información.

---

## Exportación a Excel

La exportación:

* Respeta columnas visibles
* Excluye columnas no exportables
* Utiliza el mismo set de datos mostrado

Esto garantiza consistencia entre UI y archivo exportado.

---

## DataGrid: configuración clave

* `getRowId`: asegura claves estables
* `density="compact"`: optimiza uso de espacio
* `CustomToolbar`: centraliza acciones
* `localeText`: traducción al español
* `initialState`: orden y visibilidad inicial

La configuración está pensada para uso intensivo y grandes volúmenes de datos.

---

## Componentes auxiliares

* `EditNotaModal`: edición controlada de notas
* `ConfirmDialog`: confirmación de acciones destructivas
* `CustomToolBar`: acciones globales del grid

Estos componentes desacoplan responsabilidades y mejoran mantenibilidad.

---

## Consideraciones de diseño

* Separación clara entre datos, UI y acciones
* Código preparado para escalabilidad
* Pensado para entornos productivos reales
* Compatible con mantenimiento por terceros

Este componente actúa como una pieza central del módulo de gestión de notas, priorizando robustez, claridad y control de errores.

---