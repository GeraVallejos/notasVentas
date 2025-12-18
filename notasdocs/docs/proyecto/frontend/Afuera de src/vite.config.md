### Propósito general

Este archivo define la configuración principal de **Vite**, el bundler y servidor de desarrollo utilizado en el proyecto. Centraliza las reglas relacionadas con el entorno de desarrollo, el proceso de build y la integración con React.

Su correcta configuración garantiza un arranque rápido en desarrollo, una compilación optimizada para producción y compatibilidad con el ecosistema moderno de React.

---

### Importaciones

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
```

* **defineConfig**: Función helper provista por Vite que permite definir la configuración con autocompletado y validación de tipos.
* **@vitejs/plugin-react-swc**: Plugin oficial para React que utiliza **SWC** como compilador.

  * Mejora significativamente los tiempos de compilación y recarga.
  * Soporta JSX, Fast Refresh y transformaciones modernas.

---

### Exportación de la configuración

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
```

La configuración se exporta como un único objeto, dividido en secciones claras.

---

### Plugins

```js
plugins: [react()]
```

* Registra el plugin de React dentro del pipeline de Vite.
* Habilita:

  * Transformación de JSX.
  * Fast Refresh en desarrollo.
  * Integración correcta con herramientas de debugging.

El uso de SWC permite una experiencia más rápida en comparación con Babel.

---

### Configuración del servidor de desarrollo

```js
server: {
  port: 5173,
}
```

* Define el puerto en el que se ejecuta el servidor de desarrollo.
* **5173** es el puerto por defecto recomendado por Vite.
* Facilita consistencia entre entornos locales y documentación interna.

---

### Configuración de build

```js
build: {
  outDir: 'dist',
}
```

* **outDir** especifica el directorio donde se generarán los archivos compilados.
* El valor `dist` es el estándar esperado por:

  * Servicios de hosting (Vercel, Netlify, servidores estáticos).
  * Pipelines de CI/CD.

Esta configuración asegura que el proyecto pueda desplegarse sin ajustes adicionales.

---

### Resumen

Este archivo cumple un rol fundamental al:

* Integrar React de forma eficiente con Vite.
* Definir un entorno de desarrollo rápido y predecible.
* Preparar el proyecto para despliegues en producción compatibles con hosting estático.

---