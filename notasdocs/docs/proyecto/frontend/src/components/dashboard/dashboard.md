## ¿Qué es este archivo?

Este archivo define el componente **Dashboard**, que corresponde a la vista principal de análisis y resumen del sistema. Su responsabilidad es **consultar datos agregados al backend**, procesarlos y **presentarlos de forma visual** mediante gráficos, métricas y un mapa geográfico.

El componente actúa como un **orquestador de datos y visualización**, integrando:

1. Consumo de API
2. Manejo de filtros por fecha
3. Transformación de datos crudos
4. Renderizado condicional (loading / error / vacío)
5. Gráficos (PieChart y BarChart)
6. Visualización geográfica por comuna

---

## Dependencias principales

### React

* `useState`: manejo de estados locales (datos, loading, errores, fechas)
* `useEffect`: ejecución automática de la carga inicial
* `useCallback`: memoización de funciones para evitar renders innecesarios

### MUI

* Componentes de layout y UI (`Grid`, `Paper`, `Typography`, `Box`, etc.)
* `useTheme`: acceso a la paleta y estilos globales

### MUI X Charts

* `PieChart`: distribución de notas por estado
* `BarChart`: evolución de notas por día

### Utilidades

* `date-fns`: manejo y formato de fechas
* `notistack`: feedback visual al usuario
* `api`: cliente HTTP centralizado (Axios)
* `normalizarNombre`: estandarización de nombres de comunas

---

## Estados del componente

```js
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

* `data`: respuesta completa del backend
* `loading`: controla spinners y bloqueos visuales
* `error`: mensaje de error legible para el usuario

### Estados de fechas

```js
const [fechaInicio, setFechaInicio] = useState(subDays(new Date(), 1));
const [fechaFin, setFechaFin] = useState(addDays(new Date(), 7));
```

Se inicializan con un rango razonable por defecto:

* Desde ayer
* Hasta una semana adelante

Esto permite mostrar información útil apenas se carga el dashboard.

### Estados derivados

```js
const [notasPorDiaSemana, setNotasPorDiaSemana] = useState([]);
const [dataDespachos, setDataDespachos] = useState([]);
```

Estos estados **no vienen listos desde la API**, sino que se construyen a partir de la respuesta:

* `notasPorDiaSemana`: datos listos para el gráfico de barras
* `dataDespachos`: datos normalizados para el mapa

---

## Preparación de datos para gráficos

### Datos del gráfico de torta

```js
const pieData = data?.notas?.por_estado?.map((item, index) => ({
  id: item.despacho_retira,
  value: item.total,
  label: item.despacho_retira,
  color: colores[index % 2],
})) ?? [];
```

Lógica:

1. Se accede de forma segura a `data.notas.por_estado`
2. Se transforma cada item al formato requerido por `PieChart`
3. Se asignan colores alternados
4. Si no hay datos, se retorna un arreglo vacío

Esto evita errores de render cuando el backend no devuelve información.

---

## Función principal de carga de datos

```js
const fetchData = useCallback(async (inicio, fin) => { ... }, []);
```

### Responsabilidades

1. Activar estado de carga
2. Consultar el endpoint `/dashboard/resumen/`
3. Enviar fechas formateadas al backend
4. Procesar y normalizar la respuesta
5. Manejar errores
6. Finalizar el loading

### Llamada a la API

```js
const response = await api.get('/dashboard/resumen/', {
  params: {
    fecha_inicio: format(inicio, 'yyyy-MM-dd'),
    fecha_fin: format(fin, 'yyyy-MM-dd')
  }
});
```

Se envían fechas en formato estándar para evitar problemas de parsing en backend.

---

## Transformación de datos

### Datos para el mapa

```js
setDataDespachos(
  (response.data.comunas?.resumen || [])
    .map(item => ({
      comuna: normalizarNombre(item.cliente__comuna),
      despacho_retira: item.despacho_retira,
      total: item.total,
    }))
    .filter(item => item.despacho_retira === 'DESPACHO')
);
```

Decisiones clave:

1. Se normaliza el nombre de la comuna para que coincida con el GeoJSON
2. Se filtran solo los registros de tipo `DESPACHO`
3. Se entrega al mapa una estructura consistente

---

### Datos para el gráfico de barras

```js
const datosNotas = [];
response.data.notas.por_dia.forEach(item => {
  const parsed = parse(item.day, 'yyyy-MM-dd', new Date());
  datosNotas.push({
    fecha: format(parsed, 'dd/MM'),
    fechaRaw: item.day,
    total: item.total
  });
});
```

Aquí:

1. Se parsea la fecha recibida como string
2. Se formatea para visualización
3. Se conserva el valor original si se necesita luego

---

## Manejo de errores

```js
catch (err) {
  let errorMessage = 'Error al cargar datos';
  if (err.response?.data?.error) {
    errorMessage = err.response.data.error;
  }
  setError(errorMessage);
}
```

Se prioriza:

1. Mensaje del backend
2. Código HTTP
3. Error genérico

Esto mejora la experiencia del usuario y el diagnóstico.

---

## Filtro por fechas

```js
const handleFilterSubmit = (e, inicio, fin) => { ... }
```

Lógica:

1. Previene submit por defecto
2. Valida rango de fechas
3. Muestra advertencia si es inválido
4. Actualiza estados
5. Reejecuta `fetchData`

Esto desacopla el componente de filtro del dashboard.

---

## Renderizado condicional

Antes de renderizar el contenido principal:

* Si está cargando y no hay datos → spinner
* Si hay error → mensaje

Esto evita pantallas rotas o inconsistentes.

---

## Secciones visuales

### 1. Resumen total + gráfico de torta

* Total de notas
* Rango de fechas activo
* Distribución por estado

### 2. Gráfico de barras

* Evolución diaria de notas
* Resalta el día actual
* Escala ajustada a enteros

### 3. Espacio extensible

* Contenedor preparado para futuras métricas

### 4. Mapa de despachos

* Usa GeoJSON de la RM
* Pinta comunas según volumen de despachos
* Se alimenta con datos normalizados

---

## Conclusión

Este componente:

1. Centraliza la lógica de consulta del dashboard
2. Separa claramente datos, visualización y filtros
3. Maneja errores y estados intermedios
4. Está preparado para escalar con nuevas métricas

Es un ejemplo de **componente contenedor** que coordina múltiples subcomponentes sin acoplarse a su implementación interna.
