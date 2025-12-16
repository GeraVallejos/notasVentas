# <font color=#ff5733>Material UI (MUI)</font>

Material UI (MUI) es una librería de componentes UI para React basada en **Material Design** de Google. Proporciona componentes accesibles, personalizables y listos para producción, permitiendo construir interfaces consistentes y escalables.

Este proyecto utiliza **MUI Core**, **MUI Icons** y **MUI X Pickers** como base del sistema de interfaz.

---

## ¿Por qué Material UI?

MUI es ampliamente utilizado en aplicaciones empresariales por las siguientes razones:

* Componentes listos para producción y accesibles (ARIA).
* Sistema de estilos basado en temas.
* Integración nativa con React.
* Alto nivel de personalización sin sacrificar consistencia visual.
* Ecosistema completo (icons, pickers, data grid, etc.).

---

## Teoría detrás de MUI: Fundamentos y Arquitectura

### 🔷 1. Arquitectura de Material UI

Material UI se organiza en capas:

**A. Componentes Base (@mui/material)**

* Implementan los principios de Material Design.
* Incluyen lógica de accesibilidad, estados y estilos.
* Ejemplos: Button, TextField, Dialog, Grid, AppBar.

```js
import { Button, TextField } from '@mui/material';
```

---

**B. Sistema de Estilos (Emotion)**

MUI utiliza **Emotion** como motor de estilos por defecto:

* CSS-in-JS
* Estilos dinámicos basados en props
* Scoped styles (evita colisiones globales)

```js
<Button sx={{ mt: 2, backgroundColor: 'primary.main' }}>
  Guardar
</Button>
```

---

**C. Theme Provider (Sistema de Temas)**

El tema es el núcleo de la personalización visual:

* Paleta de colores
* Tipografía
* Breakpoints
* Espaciado
* Overrides de componentes

```js
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

### 🔷 2. Flujo de Renderizado en MUI

1. El componente recibe props.
2. MUI resuelve estilos del tema.
3. Emotion genera las clases CSS.
4. Se renderiza el componente accesible.
5. React actualiza el DOM.

Este enfoque mantiene el renderizado eficiente y consistente.

---

## MUI Icons

### 🔷 3. Arquitectura de Iconos

MUI Icons provee más de 2.000 iconos SVG oficiales de Material Design.

* Cada icono es un componente React.
* Se renderizan como SVG (escalables y livianos).
* Integración directa con props y estilos MUI.

```js
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

<Button startIcon={<AddIcon />}>
  Agregar
</Button>
```

**Ventajas**:

* No requiere librerías externas.
* Compatible con el sistema de temas.
* Fácil control de tamaño y color.

---

## MUI X – Date & Time Pickers

### 🔷 4. Arquitectura de Pickers

Los Pickers pertenecen a **@mui/x-date-pickers** y están diseñados como componentes controlados.

Requieren un **date adapter** para manejar fechas.

```js
npm install @mui/x-date-pickers date-fns
```

---

### LocalizationProvider y Adapter

```js
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
  <App />
</LocalizationProvider>
```

---

### Uso de DatePicker

```js
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

<DatePicker
  label="Fecha"
  value={value}
  onChange={(newValue) => setValue(newValue)}
  renderInput={(params) => <TextField {...params} />}
/>
```

---

## Integración con React Hook Form

MUI se integra con React Hook Form mediante `Controller`:

```js
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

<Controller
  name="email"
  control={control}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      label="Email"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      fullWidth
    />
  )}
/>
```

---

## Buenas Prácticas con MUI

* Centralizar el tema en un único archivo.
* Usar `sx` para estilos específicos y simples.
* Evitar estilos inline repetitivos.
* Reutilizar componentes base.
* Usar Grid y Stack para layouts consistentes.

---

## MUI vs CSS Tradicional

| Característica | MUI           | CSS Tradicional    |
| -------------- | ------------- | ------------------ |
| Componentes    | Listos        | Manuales           |
| Accesibilidad  | Incluida      | Manual             |
| Temas          | Centralizados | No nativo          |
| Escalabilidad  | Alta          | Media              |
| Consistencia   | Alta          | Depende del equipo |

---

## MUI X – Data Grid

### 🔷 5. Arquitectura de DataGrid

MUI DataGrid pertenece a **@mui/x-data-grid** y está diseñado para manejar grandes volúmenes de datos de forma eficiente.

Características principales:

* Virtualización de filas y columnas.
* Paginación controlada y no controlada.
* Sorting, filtering y selección de filas.
* Integración nativa con MUI Theme.
* Optimizado para performance (renderizado parcial).

```bash
npm install @mui/x-data-grid
```

---

### Componentes disponibles

* **DataGrid**: versión gratuita (uso general).
* **DataGridPro** / **Premium**: funcionalidades avanzadas (licencia).

En este proyecto se utiliza **DataGrid**.

---

### Configuración básica

```js
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nombre', flex: 1 },
  { field: 'price', headerName: 'Precio', type: 'number', flex: 1 },
];

const rows = [
  { id: 1, name: 'Producto A', price: 1200 },
  { id: 2, name: 'Producto B', price: 950 },
];

<DataGrid
  rows={rows}
  columns={columns}
  pageSizeOptions={[5, 10, 25]}
  initialState={{
    pagination: { paginationModel: { pageSize: 10, page: 0 } },
  }}
  disableRowSelectionOnClick
/>
```

---

### 🔷 Flujo interno del DataGrid

1. Recepción de filas y columnas.
2. Normalización interna de datos.
3. Virtualización (solo renderiza lo visible).
4. Aplicación de sorting/filtering.
5. Renderizado optimizado.

Este flujo permite manejar miles de filas sin impacto significativo en rendimiento.

---

### Integración con estado global (Redux Toolkit)

```js
const rows = useSelector((state) => state.products.data);

<DataGrid rows={rows} columns={columns} />
```

Se recomienda:

* Mantener los datos en Redux.
* Controlar filtros/paginación desde el store solo si es necesario.

---

### Integración con APIs (Axios)

```js
useEffect(() => {
  dispatch(fetchProducts());
}, []);
```

El DataGrid actúa únicamente como capa de presentación.

---

### Personalización y estilos

```js
<DataGrid
  sx={{
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: 'primary.main',
      color: 'white',
    },
  }}
/>
```

---

### Buenas prácticas con DataGrid

* Usar `flex` en columnas para layouts responsivos.
* Evitar recrear `columns` en cada render.
* No pasar funciones inline costosas.
* Usar paginación server-side cuando el dataset es grande.

---

### DataGrid vs Tabla HTML

| Característica | DataGrid  | Tabla HTML |
| -------------- | --------- | ---------- |
| Virtualización | Sí        | No         |
| Performance    | Alta      | Baja       |
| Sorting        | Integrado | Manual     |
| Paginación     | Integrada | Manual     |
| Accesibilidad  | Alta      | Manual     |

---

Material UI proporciona un sistema completo de diseño y componentes que acelera el desarrollo y mantiene consistencia visual en aplicaciones React modernas.
un sistema completo de diseño y componentes que acelera el desarrollo y mantiene consistencia visual en aplicaciones React modernas.

---
