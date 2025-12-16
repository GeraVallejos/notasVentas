## Propósito del componente

`FacturasDataGrid` es un componente de alto nivel encargado de **gestionar facturas en PDF** dentro de una grilla (`DataGrid`). Sus responsabilidades principales son:

* Listar facturas según su estado
* Subir nuevos PDFs con metadatos
* Visualizar y descargar facturas
* Marcar facturas como pagadas
* Eliminar facturas
* Exportar la información a Excel

El componente combina lógica de **UI**, **comunicación con API**, **gestión de archivos** y **control de estado**.

---

## Función auxiliar: `formatearFacturas`

```js
const formatearFacturas = (pdf) => ({ ... })
```

### Objetivo

Normaliza y adapta los datos crudos del backend para que sean consumidos fácilmente por el `DataGrid`.

### Transformaciones clave

* Fechas (`created_at`, `updated_at`) se convierten a formato `dd/MM/yyyy`
* Tamaño del archivo se transforma de bytes a MB
* Textos (`empresa`, `observacion`) se normalizan a mayúsculas
* Se definen URLs de visualización y descarga con fallback

Esto evita lógica repetida en las columnas del grid y centraliza el formateo.

---

## Estado del componente

```js
const [facturas, setfacturas]
const [loading, setLoading]
const [uploading, setUploading]
const [confirmOpen, setConfirmOpen]
const [confirmOpenPagar, setConfirmOpenPagar]
const [metadataModalOpen, setMetadataModalOpen]
const [currentFile, setCurrentFile]
const [currentMetadata, setCurrentMetadata]
const [pdfSeleccionado, setPdfSeleccionado]
```

### Descripción

* `facturas`: filas mostradas en el DataGrid
* `loading`: estado de carga inicial
* `uploading`: controla el DropZone
* `confirmOpen`: confirmación de eliminación
* `confirmOpenPagar`: confirmación de pago
* `metadataModalOpen`: modal para editar metadatos del PDF
* `currentFile`: archivo PDF actual
* `currentMetadata`: metadata extraída del PDF
* `pdfSeleccionado`: fila seleccionada para acciones

---

## Obtención de datos: `fetchFacturas`

```js
const fetchFacturas = useCallback(async () => { ... })
```

### Flujo

1. Solicita todas las facturas al endpoint `/facturas/`
2. Filtra por `estado`
3. Aplica `formatearFacturas`
4. Actualiza el estado del componente

Se usa `useCallback` para evitar recrear la función innecesariamente.

---

## Subida de archivos PDF

### `handleFilesDrop`

* Recibe archivos desde `DropZone`
* Extrae metadata del PDF usando `usePDFMetadata`
* Guarda el archivo y metadata temporalmente
* Abre el modal de confirmación

Solo procesa **un archivo a la vez**.

---

### Normalización del nombre de archivo

```js
const normalizeFileName = (file) => { ... }
```

Evita problemas comunes:

* Espacios
* Caracteres especiales
* Nombres inconsistentes

Esto es clave para compatibilidad con sistemas de archivos y backend.

---

### Guardado final del PDF: `handleSaveMetadata`

* Crea un `FormData`
* Adjunta archivo + metadata
* POST a `/facturas/`
* Refresca la grilla

La responsabilidad de validación queda delegada al backend.

---

## Acciones sobre facturas

### Ver factura

```js
window.open(pdf.signed_url)
```

Abre el PDF en una nueva pestaña usando una URL segura.

---

### Descargar factura

Se crea dinámicamente un `<a>` para forzar descarga con nombre personalizado.

---

### Eliminar factura

* Abre `ConfirmDialog`
* Ejecuta DELETE `/facturas/{id}/`
* Refresca la grilla

---

### Marcar como pagada

* PATCH `/facturas/{id}/`
* Cambia estado a `PAGADO`
* Refresca la grilla

---

## Exportación a Excel

```js
exportExcel(columnsToExport, facturas, exportNombre)
```

* Se excluyen columnas marcadas con `disableExport`
* Se reutiliza lógica común del proyecto

---

## Definición de columnas

Las columnas del `DataGrid`:

* Separan claramente **datos** de **acciones**
* Usan `renderCell` para controlar layout y comportamiento
* Excluyen columnas de acción del export

Esto mantiene la grilla flexible y reutilizable.

---

## Renderizado condicional

* Loader global mientras se cargan datos
* `DropZone` bloqueado durante subida o extracción
* Modales controlados por estado local

---

## Componentes externos utilizados

* `DropZone`: carga de archivos
* `ConfirmDialog`: confirmaciones críticas
* `PDFMetadataModal`: edición de metadata
* `CustomToolBar`: exportación y acciones globales

El componente actúa como **orquestador**, no como dueño de toda la lógica.

---

## Decisiones técnicas destacadas

* Separación clara entre formateo de datos y renderizado
* Uso consistente de `useCallback` y `useEffect`
* Manejo explícito de estados de confirmación
* Evita lógica compleja dentro del JSX

---

## Resumen

`FacturasDataGrid` es un componente robusto, bien estructurado y alineado con buenas prácticas de React:

* Código predecible
* Lógica desacoplada
* Fácil de extender
* Preparado para entornos reales de negocio

---
