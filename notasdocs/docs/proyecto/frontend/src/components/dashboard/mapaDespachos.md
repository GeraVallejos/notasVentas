## Qué es este componente?

`MapaDespachos` es un componente de **visualización geográfica** que muestra la distribución de despachos por comuna utilizando un mapa interactivo basado en Leaflet.

Su función es **transformar datos agregados en una representación visual clara y exploratoria**.

---

## Responsabilidades principales

1. Recibir datos de despachos ya procesados.
2. Relacionar datos con geometría geográfica (GeoJSON).
3. Aplicar reglas de color según volumen.
4. Mostrar tooltips informativos.
5. Renderizar una leyenda y ranking Top 5.

---

## Normalización y matching de datos

### Mapa de nombres

```js
const nombresComunas = {};
geoData.features.forEach(feature => {
  nombresComunas[feature.properties.Comuna_Normalizada] = feature.properties.Comuna;
});
```

### Objetivo

* Evitar errores por diferencias de acentos o mayúsculas.
* Permitir matching confiable entre datos del backend y el GeoJSON.

---

## Enriquecimiento de datos

```js
const dataEnriquecida = dataDespachos.map(item => ({
  ...item,
  nombreOriginal: nombresComunas[item.comuna] || item.comuna
}));
```

### Por qué se hace

* El backend usa nombres normalizados.
* La UI necesita nombres legibles para el usuario.

---

## Top 5 comunas

```js
const topComunas = [...dataEnriquecida]
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);
```

### Lógica

1. Se clona el array para no mutar props.
2. Se ordena por volumen descendente.
3. Se limita a las 5 comunas más relevantes.

---

## Mapa de despachos

```js
const mapaDespachos = dataDespachos.reduce((acc, item) => {
  acc[item.comuna] = item.total;
  return acc;
}, {});
```

### Ventaja

* Acceso O(1) al total por comuna.
* Simplifica el cálculo de estilos por feature.

---

## Sistema de colores

```js
const getColor = (cantidad) => { ... };
```

### Diseño

* Escala progresiva basada en volumen.
* Permite lectura rápida de densidad.
* Separación clara entre comunas con y sin despachos.

---

## Estilado del GeoJSON

```js
const style = (feature) => {
  const cantidad = mapaDespachos[feature.properties.Comuna_Normalizada] || 0;
  return {
    fillColor: getColor(cantidad),
    weight: 1,
    color: 'white',
    fillOpacity: 0.7
  };
};
```

### Qué ocurre aquí

* Leaflet llama esta función por cada comuna.
* El color depende del volumen de despachos.
* No hay lógica de estado, solo cálculo puro.

---

## Tooltips por feature

```js
layer.bindTooltip(`${comunaOriginal}: ${cantidad} despacho(s)`);
```

### Objetivo

* Información inmediata al pasar el cursor.
* No sobrecargar la UI con labels permanentes.

---

## Renderizado del mapa

* `MapContainer` inicializa el mapa.
* `TileLayer` usa OpenStreetMap.
* `GeoJSON` dibuja las comunas.
* `key` forzado para refrescar estilos cuando cambian datos.

---

## Diseño general

* La leyenda es flotante y no interfiere con el mapa.
* Separación clara entre visualización y datos.
* El componente es reutilizable para otros mapas cambiando el GeoJSON.

---