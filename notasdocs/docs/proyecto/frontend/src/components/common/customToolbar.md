### Qué es

`CustomToolBar` es una barra de herramientas personalizada para **MUI DataGrid**, diseñada para:

* Integrar búsqueda rápida (QuickFilter)
* Adaptarse a pantallas pequeñas
* Proveer una acción de exportación
* Mantener una UX consistente entre desktop y móvil

No gestiona datos directamente: solo **orquesta controles de UI**.

---

### Responsabilidad

* Renderizar controles del DataGrid
* Delegar acciones (exportar, filtrar)
* Adaptar comportamiento según tamaño de pantalla

---

### Análisis del código paso a paso

#### Importaciones desde DataGrid

```js
import {
  Toolbar,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ToolbarButton,
  QuickFilterTrigger,
} from "@mui/x-data-grid";
```

Estos elementos permiten **extender la toolbar oficial** sin romper la integración con DataGrid.

* `QuickFilter`: contenedor lógico
* `QuickFilterControl`: input controlado
* `QuickFilterTrigger`: botón para expandir en móvil

---

#### Detección de tamaño de pantalla

```js
const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
```

Este flag gobierna múltiples decisiones:

* Mostrar u ocultar el trigger
* Expandir o colapsar el input
* Mostrar texto del botón Exportar

---

#### Styled components internos

```js
const StyledQuickFilter = styled(QuickFilter)({ ... });
```

Se usan `styled` locales para:

* Evitar estilos globales
* Controlar animaciones
* Acoplar estilos al estado interno

---

#### Control de expansión

```js
opacity: ownerState.expanded ? 0 : 1;
pointerEvents: ownerState.expanded ? 'none' : 'auto';
```

Aquí se logra el efecto:

1. El botón desaparece
2. El input aparece
3. Ambos ocupan la misma grilla

Esto evita reflow y mantiene estabilidad visual.

---

#### Input controlado por DataGrid

```js
<QuickFilterControl render={({ ref, ...controlProps }, state) => (...)} />
```

El input:

* No maneja estado propio
* Usa el estado interno del DataGrid
* Se sincroniza automáticamente con el grid

---

#### Limpieza del filtro

```js
<QuickFilterClear>
```

* Solo aparece si hay valor
* Resetea el filtro del grid
* No requiere lógica adicional

---

#### Acción de exportación

```js
<Button onClick={onExport}>
```

* `onExport` se recibe como prop
* La toolbar no conoce el formato ni lógica
* Mantiene separación de responsabilidades

---