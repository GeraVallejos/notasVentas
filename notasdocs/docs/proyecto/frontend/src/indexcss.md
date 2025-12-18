## Propósito del archivo

Este archivo define **estilos CSS globales** que aseguran un comportamiento correcto del layout principal de la aplicación y establecen las dimensiones necesarias para componentes que dependen explícitamente del tamaño del contenedor, como los mapas renderizados con **Leaflet**.

Su objetivo principal es:

* Garantizar que la aplicación pueda ocupar el **100% del viewport**.
* Evitar problemas de renderizado relacionados con alturas colapsadas.
* Asegurar que los mapas se visualicen correctamente dentro de la interfaz.

---

## Código

```css
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

.leaflet-container {
  height: 500px;
  width: 100%;
}
```

---

## Explicación detallada

### 1. Selector `html, body, #root`

```css
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
```

#### Función

Este bloque establece la **base estructural del layout** de la aplicación React.

#### Detalle de cada propiedad

* **`height: 100%`**
  Permite que el árbol completo de la aplicación pueda calcular alturas relativas correctamente. Esto es fundamental cuando se utilizan:

  * Layouts flexibles
  * Componentes con `height: 100vh` o `flexGrow`
  * Sidebars, AppBars o contenedores de pantalla completa

* **`margin: 0` y `padding: 0`**
  Elimina los márgenes y rellenos por defecto del navegador, evitando:

  * Espacios no deseados alrededor de la aplicación
  * Scrollbars innecesarios
  * Desalineaciones visuales

#### Importancia en aplicaciones React

En aplicaciones montadas sobre un único nodo (`#root`), este ajuste es **imprescindible** para que los layouts basados en Flexbox o Grid funcionen correctamente.

---

### 2. Selector `.leaflet-container`

```css
.leaflet-container {
  height: 500px;
  width: 100%;
}
```

#### Función

Define explícitamente el tamaño del contenedor donde se renderizan los mapas de Leaflet.

#### Por qué es necesario

Leaflet **no renderiza correctamente** un mapa si su contenedor no tiene una altura definida. Sin este estilo:

* El mapa puede no mostrarse
* Puede aparecer colapsado con altura 0
* Puede generar errores visuales difíciles de depurar

#### Detalle de las propiedades

* **`height: 500px`**
  Establece una altura fija que garantiza la visualización del mapa. Este valor puede ajustarse según el contexto del layout (pantalla completa, modal, formulario, etc.).

* **`width: 100%`**
  Permite que el mapa se adapte horizontalmente al contenedor padre, manteniendo un diseño responsivo.

---

## Buenas prácticas asociadas

* Centralizar estos estilos en un archivo global evita duplicación y errores visuales.
* Si se requiere mayor flexibilidad, la altura del contenedor puede manejarse dinámicamente mediante clases adicionales o estilos inline.
* Este archivo debe cargarse **una sola vez** al inicio de la aplicación.

---

## Resumen

Este archivo:

* Establece una base sólida para el layout global de la aplicación.
* Previene errores comunes de renderizado en React.
* Garantiza el correcto funcionamiento de mapas Leaflet.
* Aporta consistencia visual y estructural en toda la aplicación.

---
