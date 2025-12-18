## Descripción general

Este archivo define una función utilitaria responsable de **formatear un RUT chileno** a su representación estándar, incorporando **puntos como separadores de miles** y un **guion antes del dígito verificador**.

La función está diseñada para ser **pura**, reutilizable y segura frente a entradas incompletas, por lo que es especialmente adecuada para su uso en formularios controlados, validaciones previas o normalización de datos antes de ser enviados a una API.

---

## Código

```javascript
export function formatearRut(value) {
  if (!value) return '';

  // Eliminar puntos y guión existentes
  const clean = value.replace(/[^\dkK]/g, '').toUpperCase();

  if (clean.length < 2) return clean;

  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);

  const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${cuerpoConPuntos}-${dv}`;
}
```

---

## Análisis detallado del código

### 1. Validación inicial de la entrada

```javascript
if (!value) return '';
```

* Evita errores cuando la función recibe valores `null`, `undefined` o cadenas vacías.
* Permite utilizar la función directamente en inputs controlados sin validaciones adicionales.

---

### 2. Normalización del valor recibido

```javascript
const clean = value.replace(/[^\dkK]/g, '').toUpperCase();
```

* Elimina cualquier carácter que **no sea un dígito o la letra K/k**.
* Convierte el dígito verificador a mayúscula para estandarizar el formato.
* Permite aceptar entradas en múltiples formatos:

  * `12.345.678-k`
  * `12345678K`
  * `12-345678k`

Todas estas entradas terminan normalizadas a una base común.

---

### 3. Control de longitud mínima

```javascript
if (clean.length < 2) return clean;
```

* Un RUT válido debe tener al menos **un cuerpo y un dígito verificador**.
* Mientras el usuario escribe, esta condición permite mostrar el valor sin forzar formato incompleto.

---

### 4. Separación de cuerpo y dígito verificador

```javascript
const cuerpo = clean.slice(0, -1);
const dv = clean.slice(-1);
```

* `cuerpo`: todos los dígitos excepto el último.
* `dv`: último carácter, correspondiente al dígito verificador.

Esta separación facilita aplicar reglas distintas a cada parte.

---

### 5. Aplicación de separadores de miles

```javascript
const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
```

* Inserta puntos cada tres dígitos desde la derecha.
* Utiliza una expresión regular eficiente y ampliamente utilizada para este propósito.

Ejemplo:

* `12345678` → `12.345.678`

---

### 6. Construcción del resultado final

```javascript
return `${cuerpoConPuntos}-${dv}`;
```

* Devuelve el RUT en formato estándar chileno:

```
XX.XXX.XXX-DV
```

Este formato es adecuado tanto para visualización como para envío a backend.

---

## Comportamiento esperado

| Entrada        | Salida         |
| -------------- | -------------- |
| `12345678k`    | `12.345.678-K` |
| `12.345.678-k` | `12.345.678-K` |
| `1`            | `1`            |
| `` (vacío)     | ``             |

---

## Uso recomendado

* Formateo en tiempo real de inputs de RUT.
* Normalización visual antes de enviar datos a la API.
* Uso combinado con validaciones Yup u otras librerías de esquema.

Esta función **no valida la autenticidad del RUT**, únicamente su formato. La validación del dígito verificador debe realizarse por separado si es requerida.

---

## Ventajas del enfoque

* No depende de librerías externas.
* Maneja entradas parciales sin romper la experiencia de usuario.
* Código simple, legible y fácil de mantener.
* Compatible con React, Redux, formularios controlados y validaciones previas.

---