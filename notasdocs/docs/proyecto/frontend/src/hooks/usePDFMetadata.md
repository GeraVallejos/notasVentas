## Propósito del hook

`usePDFMetadata` es un *custom hook* de React diseñado para encapsular la lógica relacionada con la **extracción inicial de metadatos de archivos PDF** antes de su persistencia o procesamiento posterior. El hook abstrae tanto la generación de metadatos básicos como el control del estado de carga asociado al proceso.

Su objetivo principal es:

* Centralizar la lógica de extracción de información del archivo.
* Proveer un estado claro de ejecución (`extracting`) para control de UI.
* Mantener el componente consumidor desacoplado de detalles de implementación.

---

## Estructura general del código

```js
import { useState } from "react";

const usePDFMetadata = () => {
  const [extracting, setExtracting] = useState(false);

  const extractPDFMetadata = async (file) => {
    setExtracting(true);
    try {
      const metadata = {
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        title: file.name.replace('.pdf', ''),
      };
      
      return metadata;
    } catch (error) {
      console.error("Error extrayendo metadatos:", error);
      throw error;
    } finally {
      setExtracting(false);
    }
  };

  return { extractPDFMetadata, extracting };
};

export default usePDFMetadata;
```

---

## Análisis detallado del código

### 1. Manejo de estado interno

```js
const [extracting, setExtracting] = useState(false);
```

Se utiliza un estado booleano para representar si el proceso de extracción se encuentra en ejecución. Este estado cumple un rol clave en la interfaz de usuario:

* Permite deshabilitar botones mientras se procesa el archivo.
* Facilita la visualización de indicadores de carga.
* Evita ejecuciones concurrentes no deseadas.

El estado se gestiona exclusivamente dentro del hook, manteniendo a los componentes consumidores libres de esta responsabilidad.

---

### 2. Función `extractPDFMetadata`

```js
const extractPDFMetadata = async (file) => {
  setExtracting(true);
```

La función principal del hook recibe un objeto `File`, normalmente proveniente de un `<input type="file" />`. Desde el inicio se establece el estado `extracting` en `true`, señalando que el proceso ha comenzado.

El uso de una función `async` permite que el hook sea fácilmente extendido en el futuro para:

* Lectura del contenido real del PDF.
* Integración con librerías de parsing.
* Llamadas a servicios externos.

---

### 3. Construcción del objeto de metadatos

```js
const metadata = {
  fileName: file.name,
  fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
  title: file.name.replace('.pdf', ''),
};
```

En este bloque se genera un objeto plano con metadatos básicos:

* **fileName**: nombre original del archivo.
* **fileSize**: tamaño convertido a megabytes, formateado para presentación.
* **title**: nombre del archivo sin la extensión `.pdf`, pensado para ser utilizado como valor inicial editable.

La lógica es deliberadamente simple y determinística, asegurando que la función sea rápida y confiable.

---

### 4. Manejo de errores

```js
catch (error) {
  console.error("Error extrayendo metadatos:", error);
  throw error;
}
```

Aunque la implementación actual no lanza errores de forma explícita, el bloque `catch` cumple un rol preventivo:

* Permite capturar errores futuros si se agrega lógica más compleja.
* Garantiza que los errores sean propagados al consumidor del hook.
* Facilita el debugging sin ocultar fallos silenciosamente.

---

### 5. Finalización del proceso

```js
finally {
  setExtracting(false);
}
```

El uso de `finally` asegura que el estado `extracting` se restablezca correctamente, independientemente del resultado de la operación. Esto es crítico para mantener la consistencia visual y funcional de la interfaz.

---

## API expuesta por el hook

El hook retorna un objeto con dos propiedades:

```js
{
  extractPDFMetadata, // Función asincrónica para obtener metadatos
  extracting          // Estado booleano del proceso
}
```

Esta API permite una integración clara y explícita en componentes, evitando dependencias implícitas o estados duplicados.

---

## Consideraciones de diseño

* El hook sigue el principio de **single responsibility**, limitándose exclusivamente a la extracción de metadatos.
* No depende de librerías externas, lo que reduce acoplamiento y complejidad.
* Está preparado para escalar sin modificar la interfaz pública.

---

## Posibles extensiones

* Lectura de metadatos internos del PDF (autor, fecha, páginas).
* Validación del tipo MIME del archivo.
* Normalización del título (mayúsculas, reemplazo de caracteres).
* Integración con validaciones previas a la carga.

Este enfoque mantiene el hook como una pieza reutilizable, predecible y alineada con buenas prácticas de arquitectura en React.
