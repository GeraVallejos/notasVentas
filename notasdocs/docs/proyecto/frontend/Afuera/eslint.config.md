### Propósito del archivo

Este archivo define la configuración de ESLint para el proyecto frontend basado en React. Su objetivo principal es establecer reglas de análisis estático de código que permitan mantener consistencia, calidad y buenas prácticas durante el desarrollo, especialmente en aplicaciones modernas con React Hooks y Fast Refresh.

---

### Estructura general

El archivo exporta un arreglo de configuraciones, lo que corresponde al formato moderno de ESLint (Flat Config). Esto permite definir múltiples bloques de configuración de forma más clara y modular.

```js
export default [
  { ignores: ['dist'] },
  { /* configuración principal */ }
]
```

* El primer bloque define rutas o carpetas que ESLint debe ignorar.
* El segundo bloque contiene la configuración efectiva que se aplica a los archivos JavaScript y JSX del proyecto.

---

### Exclusión de carpetas

```js
{ ignores: ['dist'] }
```

* Evita que ESLint analice el directorio `dist`, el cual normalmente contiene archivos generados automáticamente durante el build.
* Previene falsos positivos y reduce el tiempo de análisis.

---

### Alcance de archivos

```js
files: ['**/*.{js,jsx}'],
```

* Limita la aplicación de esta configuración a archivos `.js` y `.jsx`.
* Asegura que el linting solo se ejecute sobre código fuente relevante del frontend.

---

### Opciones de lenguaje

```js
languageOptions: {
  ecmaVersion: 2020,
  globals: globals.browser,
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
},
```

* **ecmaVersion**: Permite el uso de características modernas de JavaScript.
* **globals.browser**: Declara variables globales del navegador (`window`, `document`, etc.) como válidas.
* **jsx**: Habilita la sintaxis JSX propia de React.
* **sourceType: module**: Indica que el código utiliza ES Modules (`import` / `export`).

---

### Plugins utilizados

```js
plugins: {
  'react-hooks': reactHooks,
  'react-refresh': reactRefresh,
},
```

* **react-hooks**: Garantiza el uso correcto de Hooks (`useEffect`, `useState`, etc.).
* **react-refresh**: Ayuda a mantener compatibilidad con Fast Refresh, evitando patrones que rompan la recarga en caliente.

---

### Reglas base

```js
...js.configs.recommended.rules,
...reactHooks.configs.recommended.rules,
```

* Se heredan las reglas recomendadas por ESLint para JavaScript estándar.
* Se agregan las reglas oficiales recomendadas para React Hooks.

Esto establece una base sólida sin necesidad de definir manualmente cada regla.

---

### Reglas personalizadas

#### Variables no utilizadas

```js
'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
```

* Marca como error las variables no utilizadas.
* Excluye constantes o identificadores en mayúsculas, comúnmente usados para:

  * Enumeraciones
  * Configuraciones
  * Constantes globales

---

#### React Fast Refresh

```js
'react-refresh/only-export-components': [
  'warn',
  { allowConstantExport: true },
],
```

* Emite una advertencia si un archivo exporta algo que no sea un componente React.
* Mejora la estabilidad del Fast Refresh durante el desarrollo.
* Permite exportar constantes sin romper la recarga en caliente.

---

### Beneficios de esta configuración

* Refuerza buenas prácticas en React y Hooks.
* Reduce errores comunes en tiempo de desarrollo.
* Mejora la experiencia de desarrollo con Fast Refresh.
* Mantiene el código consistente y predecible en equipos de trabajo.

---

### Rol dentro de la arquitectura

Este archivo actúa como una **pieza de control de calidad transversal**, aplicándose a todo el código fuente del frontend. No afecta el runtime de la aplicación, pero es clave para:

* Mantenibilidad
* Escalabilidad
* Onboarding de nuevos desarrolladores
* Cumplimiento de estándares técnicos


---