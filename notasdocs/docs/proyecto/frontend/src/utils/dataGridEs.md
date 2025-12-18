## Propósito del archivo

Este archivo define un **objeto de configuración de localización (i18n)** para **MUI DataGrid**, adaptando todos los textos visibles de la grilla al idioma español. Su objetivo es proporcionar una experiencia de usuario coherente, profesional y completamente localizada, evitando textos por defecto en inglés.

El objeto `dataGridEs` se utiliza normalmente al configurar el componente DataGrid mediante la prop `localeText`.

---

## Rol dentro de la arquitectura

* Centraliza todos los textos de la DataGrid en un único módulo
* Facilita el mantenimiento y futuras modificaciones de idioma
* Evita duplicación de textos en múltiples componentes
* Permite consistencia semántica en toda la aplicación

Este archivo **no contiene lógica de negocio**, únicamente **configuración declarativa**.

---

## Estructura general del objeto

El objeto `dataGridEs` está organizado por secciones funcionales del DataGrid:

* Estados generales
* Barra de herramientas (toolbar)
* Gestión de columnas
* Filtros
* Menús de columna
* Paginación
* Selección de filas
* Agrupaciones y jerarquías
* Agregaciones

Cada clave corresponde exactamente a la API pública de `localeText` de MUI X.

---

## Estados generales

```js
noRowsLabel: 'Sin filas',
noResultsOverlayLabel: 'Resultados no encontrados'
```

Definen los textos mostrados cuando:

* No existen filas cargadas
* Una búsqueda o filtro no retorna resultados

---

## Barra de herramientas (Toolbar)

Incluye traducciones para:

* Selector de densidad de filas
* Gestión de columnas visibles
* Panel de filtros
* Campo de búsqueda rápida
* Exportación de datos

Ejemplo:

```js
toolbarExportCSV: 'Descargar como CSV',
toolbarExportExcel: 'Descargar como Excel'
```

Esto asegura que todas las acciones de exportación se presenten claramente en español.

---

## Gestión de columnas

```js
columnsManagementSearchTitle: 'Buscar',
columnsManagementShowHideAllText: 'Mostrar/Ocultar todas'
```

Controla los textos del panel que permite:

* Buscar columnas
* Mostrar u ocultar columnas
* Restablecer configuraciones

---

## Sistema de filtros

Incluye:

* Etiquetas del panel de filtros
* Operadores lógicos
* Operadores de comparación
* Placeholders y mensajes auxiliares

Ejemplo:

```js
filterOperatorContains: 'contiene',
filterOperatorEquals: 'es igual'
```

Además, se definen **operadores dinámicos** mediante funciones que ajustan el texto según el contexto.

---

## Filtros en encabezados (Header Filters)

```js
headerFilterOperatorContains: 'Contiene',
headerFilterOperatorBefore: 'Esta antes de'
```

Estos textos se utilizan cuando el filtrado se realiza directamente desde los encabezados de columna.

---

## Menú de columnas

```js
columnMenuSortAsc: 'Ordenar ASC',
columnMenuHideColumn: 'Ocultar'
```

Define los textos del menú contextual de cada columna, garantizando claridad en acciones comunes como ordenamiento y visibilidad.

---

## Selección de filas

Incluye textos accesibles y descriptivos para:

* Seleccionar filas individuales
* Seleccionar todas las filas
* Mensajes de filas seleccionadas

Ejemplo:

```js
footerRowSelected: (count) => `${count} filas seleccionadas`
```

Se utilizan funciones para manejar correctamente singular y plural.

---

## Paginación

```js
paginationRowsPerPage: 'Filas por página:'
```

Y etiquetas accesibles para navegación:

```js
paginationItemAriaLabel: (type) => {
  if (type === 'first') return 'Ir a la primera página';
}
```

Estas funciones mejoran accesibilidad y usabilidad.

---

## Agrupaciones y jerarquías

Soporta:

* Agrupación de columnas
* Tree Data
* Master / Detail

Ejemplo:

```js
groupColumn: (name) => `Agrupar por ${name}`
```

Permite textos dinámicos basados en el nombre de la columna.

---

## Agregaciones

```js
aggregationFunctionLabelSum: 'suma',
aggregationFunctionLabelAvg: 'promedio'
```

Traducciones de funciones de agregación utilizadas en columnas numéricas.

---

## Exportación del módulo

```js
export default dataGridEs;
```

El objeto se exporta como configuración reutilizable y puede ser importado en cualquier DataGrid de la aplicación.

---

## Buenas prácticas aplicadas

* Uso exclusivo de claves soportadas por MUI DataGrid
* Funciones para pluralización y accesibilidad
* Separación clara entre configuración y lógica
* Preparado para escalado o internacionalización futura

---

## Uso típico

```jsx
<DataGrid
  rows={rows}
  columns={columns}
  localeText={dataGridEs}
/>
```

Este patrón garantiza que toda la grilla se renderice completamente en español.

---

