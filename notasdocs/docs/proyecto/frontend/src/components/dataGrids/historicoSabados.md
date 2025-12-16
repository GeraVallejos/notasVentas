

Este componente muestra el **histórico de sábados trabajados del personal**, agrupado por mes, con posibilidad de **expandir/colapsar** cada mes para ver el detalle por persona.

---

## 1️⃣ Imports y dependencias

```js
import { useState, useEffect } from 'react';
```

* Hooks básicos de React:

  * `useState`: manejar estados locales
  * `useEffect`: ejecutar lógica al montar el componente

```js
import { Box, Typography, Table, TableBody, TableCell, TableContainer,
TableHead, TableRow, Paper, IconButton, Collapse, CircularProgress } from '@mui/material';
```

* Componentes de **Material UI**:

  * `Table*`: estructura tabular
  * `Collapse`: mostrar/ocultar contenido animado
  * `CircularProgress`: loader

```js
import { format, eachMonthOfInterval, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
```

* `date-fns`:

  * generar meses
  * formatear fechas
  * localización en español

```js
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
```

* `api`: cliente HTTP centralizado
* `useSnackbar`: feedback visual de errores

```js
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
```

* Íconos para indicar expansión / colapso

---

## 2️⃣ Estados del componente

```js
const [historico, setHistorico] = useState([]);
```

* Guarda el histórico completo recibido desde el backend

```js
const [loading, setLoading] = useState(true);
```

* Controla el estado de carga inicial

```js
const [expandedMonths, setExpandedMonths] = useState({});
```

* Objeto que indica qué meses están desplegados
* Ejemplo:

```js
{ "2025-01": true, "2025-02": false }
```

---

## 3️⃣ Cálculo de los últimos 6 meses

```js
const meses = eachMonthOfInterval({
  start: subMonths(new Date(), 6),
  end: new Date()
}).reverse();
```

* Genera una lista de meses desde hace 6 meses hasta hoy
* `reverse()` para mostrar del más reciente al más antiguo

---

## 4️⃣ Expansión / colapso de meses

```js
const toggleMonth = (mes) => {
  setExpandedMonths(prev => ({
    ...prev,
    [mes]: !prev[mes]
  }));
};
```

* Alterna el estado expandido de un mes específico
* Usa el mes (`yyyy-MM`) como clave

---

## 5️⃣ Carga de datos (useEffect)

```js
useEffect(() => {
  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const response = await api.get('/personal/historico-sabados/');
```

* Llama al backend para obtener el histórico

```js
const data = response.data.map(item => ({
  ...item,
  sabados: Array.isArray(item.sabados) ? item.sabados : []
}));
```

* Normaliza los datos
* Garantiza que `sabados` siempre sea un array

```js
setHistorico(data);
```

* Guarda los datos ya normalizados

```js
} catch (error) {
  enqueueSnackbar('Error al cargar histórico', { variant: 'error' });
} finally {
  setLoading(false);
}
```

* Manejo de errores y fin de carga

---

## 6️⃣ Loader de carga

```js
if (loading) {
  return (
    <Box display="flex" justifyContent="center" mt={30}>
      <CircularProgress />
    </Box>
  );
}
```

* Evita renderizar la vista principal mientras no hay datos

---

## 7️⃣ Render principal

### Título

```js
<Typography variant="h5">Histórico de Sábados Trabajados</Typography>
```

---

## 8️⃣ Render por cada mes

```js
{meses.map(mes => {
  const mesKey = format(mes, 'yyyy-MM');
  const mesLabel = format(mes, 'MMMM yyyy', { locale: es });
```

* `mesKey`: clave técnica
* `mesLabel`: texto visible al usuario

```js
const mesData = historico.filter(item => item.mes === mesKey);
```

* Filtra las personas que pertenecen a ese mes

---

## 9️⃣ Cabecera del mes (clickeable)

```js
<Box onClick={() => toggleMonth(mesKey)}>
```

* Permite expandir / colapsar el mes

```js
{expandedMonths[mesKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
```

* Ícono dinámico según estado

```js
<Typography>{mesData.length} personas</Typography>
```

* Muestra cuántas personas trabajaron ese mes

---

## 🔟 Tabla desplegable

```js
<Collapse in={expandedMonths[mesKey]} unmountOnExit>
```

* Solo se renderiza cuando el mes está expandido

### Cabecera

* Nombre
* Sábados trabajados
* Total

### Filas

```js
{mesData.map(item => (
  <TableRow>
    <TableCell>{item.nombre} {item.apellido}</TableCell>
    <TableCell>{item.sabados.join(', ')}</TableCell>
    <TableCell>{item.sabados.length}</TableCell>
  </TableRow>
))}
```

* Lista los sábados trabajados y su total por persona

---

## 11️⃣ Resumen funcional

Este componente:

* Carga el histórico de sábados desde el backend
* Agrupa la información por mes
* Permite expandir cada mes
* Muestra detalle por persona
* Maneja errores y estados de carga

Es una vista **100% de lectura**, pensada para consulta y auditoría.

---

## 12️⃣ Posibles mejoras futuras

* Memoización del filtrado por mes (`useMemo`)
* Paginación si el histórico crece
* Exportación a Excel / PDF
* Separar lógica en un hook (`useHistoricoSabados`)
