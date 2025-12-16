## Propósito del componente

Este componente renderiza una **grilla mensual de sábados trabajados por personal**, permitiendo:

* Visualizar todos los sábados de un mes
* Marcar o desmarcar asistencia por persona
* Guardar los cambios en backend
* Exportar la información a Excel
* Navegar al histórico
* Cambiar el mes visualizado

Es un componente **stateful**, con fuerte interacción con backend y generación dinámica de columnas.

---

## Imports y dependencias

### React y estado

* `useState`: manejo de estado local (mes, datos, loading, cambios)
* `useEffect`: carga inicial de datos
* `useCallback`: memoización de la función de carga

### UI y DataGrid

* `DataGrid`: tabla principal
* `Box`, `Checkbox`, `Button`, `CircularProgress`: layout y controles

### Fechas

Se usa `date-fns` para:

* Calcular los sábados del mes
* Formatear fechas
* Localización en español

### Utilidades propias

* `dataGridEs`: textos del DataGrid en español
* `CustomToolBar`: toolbar con exportación
* `exportExcel`: exportar datos
* `api`: cliente HTTP

---

## Función getSaturdaysOfMonth

```js
function getSaturdaysOfMonth(date) {
```

### Qué hace

Recibe una fecha cualquiera y devuelve **todas las fechas de sábado del mes**, en formato `yyyy-MM-dd`.

### Flujo interno

1. Genera todos los días del mes
2. Filtra solo los días cuyo `getDay()` es `6` (sábado)
3. Devuelve un arreglo de strings

Esto permite generar columnas dinámicas según el mes seleccionado.

---

## Estados del componente

```js
const [mes, setMes] = useState(new Date());
const [personal, setPersonal] = useState([]);
const [originalData, setOriginalData] = useState([]);
const [loading, setLoading] = useState(true);
const [hasChanges, setHasChanges] = useState(false);
```

### Responsabilidad de cada estado

* `mes`: mes actualmente seleccionado
* `personal`: datos editables que se muestran en la grilla
* `originalData`: copia de respaldo para revertir cambios
* `loading`: estado global de carga / guardado
* `hasChanges`: controla si el botón guardar está habilitado

---

## Cálculo de sábados

```js
const saturdays = getSaturdaysOfMonth(mes)
```

Cada vez que cambia el mes, se recalculan los sábados y, por consecuencia, las columnas.

---

## fetchData (carga principal)

Esta es la función más importante del componente.

### Qué hace

1. Obtiene el listado de personal
2. Para cada persona:

   * Consulta sus sábados trabajados
   * Genera un objeto con flags por fecha
3. Construye filas listas para el DataGrid

### Estructura resultante por persona

```js
{
  id_personal: 1,
  nombre_completo: "Juan Pérez",
  "2024-09-07": true,
  "2024-09-14": false
}
```

Esto permite que cada sábado sea una columna editable.

### Manejo de errores

* Si falla un sábado individual, se inicializa en `false`
* Si falla todo, se muestra snackbar de error

---

## useEffect inicial

```js
useEffect(() => {
  fetchData();
}, []);
```

Carga los datos solo una vez al montar el componente.

---

## handleCheckboxChange

```js
const handleCheckboxChange = (id, date, checked) => {
```

### Qué hace

* Actualiza el valor del checkbox en el estado local
* Marca que existen cambios pendientes

No guarda nada en backend aún.

---

## handleSaveChanges

### Flujo completo

1. Recorre todo el personal
2. Para cada persona:

   * Obtiene los sábados marcados
   * Envía la lista completa al backend
3. Recarga los datos
4. Muestra feedback al usuario

### Decisión clave

Se envía **la lista completa de sábados**, no solo diferencias.

Esto simplifica la lógica del backend y evita inconsistencias.

### En caso de error

* Se muestra mensaje
* Se revierte el estado local usando `originalData`

---

## Columnas del DataGrid

### Columna fija

```js
{
  field: 'nombre_completo',
  headerName: 'Nombre'
}
```

### Columnas dinámicas por sábado

Se generan usando `map` sobre `saturdays`.

Cada columna:

* Usa la fecha como `field`
* Muestra el día y mes formateado
* Renderiza un `Checkbox`

El checkbox actualiza el estado local al cambiar.

---

## Exportación a Excel

```js
const onExport = () => {
```

### Qué hace

* Convierte `true / false` en `X / ''`
* Reutiliza las mismas columnas del DataGrid
* Exporta usando `exportExcel`

---

## Render condicional por loading

Mientras `loading` es `true`, se muestra solo un spinner centrado.

---

## Render principal

### DataGrid

Configuración relevante:

* `getRowId`: usa `id_personal`
* `hideFooter`: sin paginación
* `disableColumnMenu`: grilla simple
* `CustomToolBar`: exportación
* `sorting` inicial por nombre

### Barra inferior

Contiene:

* Navegación a histórico
* Selector de mes
* Botón guardar cambios

El botón guardar solo se habilita si hay cambios.

---

## Resumen arquitectónico

Este componente:

* Genera columnas dinámicas basadas en fechas
* Mantiene estado editable desacoplado del backend
* Implementa control de cambios y rollback
* Centraliza lógica compleja sin delegarla a la grilla

Es un muy buen ejemplo de **DataGrid avanzado con backend real**.
