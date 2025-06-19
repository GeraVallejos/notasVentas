# <font color=#ff5733>Date fns</font>
 
 Es una librería moderna de JavaScript para manipulación de fechas. Su filosofía se basa en:

- Modularidad: Importa solo las funciones que necesitas (reduce el bundle size).
- Inmutabilidad: Nunca modifica fechas originales (retorna nuevas instancias).
- Pureza: Funciones sin side effects.
- TypeScript: Soporte nativo.

### Principios Teóricos Clave

- Paradigma Funcional

    Cada función en date-fns es autocontenida y determinística:

```js
import { addDays, format } from 'date-fns';

const hoy = new Date();
const mañana = addDays(hoy, 1); // No modifica `hoy` (inmutabilidad)
console.log(format(mañana, 'yyyy-MM-dd')); // "2023-05-21"
```

- Tratamiento de Fechas como Objetos Date Nativos
    A diferencia de Moment.js (que usa su propio objeto), date-fns trabaja con el objeto Date de JavaScript, evitando overhead.

- Internacionalización (i18n) Modular

```js
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

format(new Date(), 'PPPP', { locale: es }); // "martes, 23 de mayo de 2023"
```

### Funciones Esenciales

- Formateo de Fechas

```js
import { format } from 'date-fns';

format(new Date(), 'yyyy-MM-dd');       // "2023-05-23"
format(new Date(), "HH:mm 'hrs'");      // "14:30 hrs"
format(new Date(), 'PPPP');             // "Tuesday, May 23rd, 2023"
```

- Manipulación de Fechas

```js
import { addDays, subMonths, differenceInDays } from 'date-fns';

const hoy = new Date();
addDays(hoy, 7);       // Suma 7 días
subMonths(hoy, 2);      // Resta 2 meses
differenceInDays(fechaFin, fechaInicio); // Días entre dos fechas
```

- Comparación de Fechas

```js
import { isAfter, isEqual, isWithinInterval } from 'date-fns';

isAfter(fecha1, fecha2);          // true si fecha1 > fecha2
isEqual(fecha1, fecha2);          // true si son iguales
isWithinInterval(fecha, { start, end }); // ¿Está `fecha` en el intervalo?
```

- Parsing y Validación

```js
import { parseISO, isValid } from 'date-fns';

const fecha = parseISO('2023-05-23'); // Convierte string ISO a Date
isValid(fecha); // true si es una fecha válida
```

### Internacionalización (i18n)

```js
import { format, setDefaultOptions } from 'date-fns';
import { es, fr, de } from 'date-fns/locale';

// Configuración global
setDefaultOptions({ locale: es });

format(new Date(), 'PPPP'); // "martes, 23 de mayo de 2023"

// Por función
format(new Date(), 'PPPP', { locale: fr }); // "mardi 23 mai 2023"
```

### Uso Avanzado en React

- Hook Personalizado para Fechas

```js
import { useState } from 'react';
import { format, addDays } from 'date-fns';

function useDateManager(initialDate = new Date()) {
  const [date, setDate] = useState(initialDate);

  const addDaysToDate = (days) => setDate(addDays(date, days));

  return {
    date,
    formattedDate: format(date, 'yyyy-MM-dd'),
    addDaysToDate,
  };
}
```

- Integración con React Router (ejemplo de filtro por fecha)

```js
import { useLoaderData } from 'react-router-dom';
import { format, subDays } from 'date-fns';

export async function loader() {
  const fechaInicio = subDays(new Date(), 30); // Últimos 30 días
  const response = await fetch(`/api/ventas?since=${format(fechaInicio, 'yyyy-MM-dd')}`);
  return response.json();
}

function VentasComponent() {
  const data = useLoaderData();
  // ...
}
```

---