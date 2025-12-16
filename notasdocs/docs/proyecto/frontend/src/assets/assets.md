# 📁 Assets

La carpeta **assets** agrupa todos los recursos estáticos utilizados por el proyecto. Estos archivos **no contienen lógica de negocio**, pero son esenciales para la presentación visual, la experiencia de usuario y la configuración estructural basada en datos.

Su correcta organización permite desacoplar la interfaz del código funcional, mejorar la mantenibilidad y facilitar cambios visuales sin impactar la lógica de la aplicación.

---

## 🎯 Objetivos de la carpeta assets

* Centralizar recursos reutilizables.
* Evitar duplicación de archivos estáticos.
* Mantener el código limpio y enfocado en lógica.
* Facilitar cambios visuales sin modificar componentes.
* Permitir versionado y control de recursos gráficos y datos.

---

## 📂 Estructura General

```txt
assets/
├── icons/
│   └── *.svg | *.png
├── images/
│   └── *.png | *.jpg | *.webp
├── maps/
│   └── *.json
```

Cada subcarpeta tiene una responsabilidad clara y bien definida.

---

## 🖼️ images/

### 📌 Propósito

Contiene imágenes utilizadas en la interfaz del usuario, como:

* Logos de la aplicación
* Imágenes decorativas o de fondo
* Recursos visuales para pantallas específicas

Estas imágenes se consideran **estáticas** y no cambian dinámicamente durante la ejecución.

### 🧠 Lógica de uso

* Se importan directamente en componentes React.
* El bundler (Vite / Webpack) se encarga de optimizar y versionar los archivos.
* No contienen lógica ni metadatos asociados.

```js
import logo from '@/assets/images/logo.png';

<img src={logo} alt="Logo" />;
```

### ✅ Buenas prácticas

* Usar nombres descriptivos y consistentes.
* Preferir formatos optimizados (`webp`, `svg`).
* Evitar imágenes innecesariamente grandes.

---

## 🎨 icons/

### 📌 Propósito

Almacena íconos personalizados del proyecto que **no provienen de librerías externas** (por ejemplo, íconos propios que complementan MUI Icons).

Se utilizan para:

* Botones de acción
* Indicadores visuales
* Elementos decorativos específicos del dominio

### 🧠 Lógica de uso

* Se importan como recursos SVG o imágenes.
* Permiten independencia visual frente a librerías externas.
* Facilitan la personalización visual del sistema.

```js
import EditIcon from '@/assets/icons/edit.svg';

<img src={EditIcon} alt="Editar" />;
```

### 🔍 ¿Por qué no mezclar con MUI Icons?

* MUI Icons cubre íconos genéricos.
* Los íconos en assets representan **branding o dominio específico**.
* Mantiene separación clara entre dependencias externas y recursos propios.

---

## 🗺️ maps/ (JSON)

### 📌 Propósito

Contiene archivos JSON que representan **mapas de datos estáticos** utilizados por la aplicación. Estos archivos funcionan como **configuración estructural**, no como datos dinámicos provenientes de una API.

Ejemplos de uso:

* Mapeos de códigos a etiquetas
* Configuración de columnas (DataGrid)
* Relaciones clave → valor
* Catálogos estáticos

---

### 🧠 Lógica detrás del uso de JSON

* El JSON actúa como una **fuente de verdad estática**.
* Permite modificar comportamientos sin tocar código.
* Facilita lectura, versionado y revisión.
* Evita hardcodear estructuras en componentes.

```json
{
  "A": "Activo",
  "I": "Inactivo"
}
```

```js
import estadosMap from '@/assets/maps/estados.json';

const label = estadosMap[estadoCodigo];
```

---

## 🧩 Relación con la Arquitectura del Proyecto

* **assets** no depende de ningún módulo.
* Es consumido por:

  * Componentes UI
  * Layouts
  * Configuración visual
* No debe importar código JS/TS.

Esto garantiza una arquitectura **unidireccional y limpia**.

---

## ⚠️ Qué NO debe ir en assets

* Lógica de negocio
* Funciones JS
* Hooks personalizados
* Datos dinámicos (API)

Si un archivo requiere lógica o mutación, **no pertenece a assets**.

---

## ✅ Beneficios de esta separación

* Código más limpio y legible
* Escalabilidad del proyecto
* Cambios visuales sin riesgo funcional
* Mejor colaboración en equipo
* Arquitectura alineada a buenas prácticas frontend

---

## 📌 Conclusión

La carpeta **assets** actúa como el **repositorio central de recursos estáticos** del proyecto. Su uso correcto mejora la mantenibilidad, reduce acoplamiento y refuerza una arquitectura frontend profesional y escalable.

---
