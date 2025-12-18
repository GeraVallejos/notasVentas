### Propósito

`themeJJ` define el tema visual central de la aplicación utilizando `createTheme` de Material UI. Centraliza decisiones de diseño como colores, tipografía, radios, y overrides de componentes, facilitando mantenimiento y escalabilidad.

### Paleta de colores

* **Modo**: `light`
* **Primario / Secundario**: tonos azules utilizados de forma consistente en botones, AppBar y acciones principales.
* **Background**: separación clara entre fondo general (`default`) y superficies (`paper`).
* **Estados**: colores explícitos para error, success, warning e info.

Esta definición asegura coherencia visual y facilita cambios globales sin modificar componentes individuales.

### Tipografía

* Fuente base: combinación de `Saira` con fuentes fallback estándar.
* Jerarquía clara para encabezados (`h1`, `h2`, `h3`).
* Botones sin transformación automática de texto, priorizando legibilidad.

### Shape

* `borderRadius: 0` establece un estilo visual recto y sobrio en toda la aplicación.

### Overrides de componentes

* **MuiButton**: padding consistente y bordes rectos.
* **MuiTextField**: valores por defecto estandarizados (`outlined`, `small`).
* **MuiAppBar**: color alineado con la paleta primaria.
* **MuiPaper**: eliminación de bordes redondeados para coherencia visual.

### Localización

* Se incorpora `esES` para adaptar componentes como DatePickers al idioma y formato regional.

---

## Consideraciones arquitectónicas

* La separación entre `AppTheme` y `themeJJ` desacopla la definición del tema de su aplicación.
* Facilita testing, reutilización y futuras extensiones (por ejemplo, dark mode).
* Centraliza el diseño como una capa transversal de la aplicación.

---