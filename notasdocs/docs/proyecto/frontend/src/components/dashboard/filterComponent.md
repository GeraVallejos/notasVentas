## ¿Qué es este componente?

`FilterComponent` es un componente **presentacional y de control de filtros de fecha** que se utiliza para seleccionar un rango temporal (fecha inicio y fecha fin) y notificar ese rango a un componente padre (por ejemplo, el Dashboard).

No realiza llamadas a API ni contiene lógica de negocio. Su responsabilidad es **gestionar estado temporal de UI**, validar interacción básica del usuario y delegar la acción final al padre.

---

## Responsabilidades principales

1. Mostrar dos selectores de fecha (inicio y fin).
2. Mantener un estado temporal independiente del estado global del Dashboard.
3. Sincronizarse con cambios externos de fechas.
4. Ejecutar el callback `handleFilterSubmit` al enviar el formulario.
5. Reflejar el estado de carga (loading) en la UI.

---

## Uso de `memo`

El componente está envuelto en `memo`:

```js
const FilterComponent = memo((props) => { ... })
```

### ¿Por qué?

* Evita renders innecesarios cuando las props no cambian.
* Es especialmente útil en dashboards donde hay múltiples gráficos y renders costosos.
* El componente solo se vuelve a renderizar si cambian las fechas o `loading`.

---

## Estados internos

```js
const [tempFechaInicio, setTempFechaInicio] = useState(initialFechaInicio);
const [tempFechaFin, setTempFechaFin] = useState(initialFechaFin);
```

### ¿Por qué usar estado temporal?

* Permite que el usuario cambie fechas **sin disparar inmediatamente el filtro**.
* El filtro solo se aplica al presionar el botón "Aplicar".
* Mejora la experiencia de usuario y evita llamadas innecesarias a la API.

---

## Sincronización con props externas

```js
useEffect(() => {
  setTempFechaInicio(initialFechaInicio);
  setTempFechaFin(initialFechaFin);
}, [initialFechaInicio, initialFechaFin]);
```

### Lógica

* Si el Dashboard actualiza las fechas (por ejemplo, reset global), el filtro se sincroniza.
* Evita estados inconsistentes entre padre e hijo.

---

## Manejo del submit

```js
const handleSubmit = (e) => {
  e.preventDefault();
  handleFilterSubmit(e, tempFechaInicio, tempFechaFin);
};
```

### Claves

* El formulario previene el comportamiento por defecto.
* Delegación total de la validación de negocio al componente padre.
* Mantiene este componente simple y reutilizable.

---

## Configuración común de DatePicker

```js
const commonDatePickerProps = {
  format: "dd/MM/yyyy",
  slotProps: {
    textField: {
      size: "small",
      sx: textFieldStyles,
    },
  },
};
```

### Ventajas

* Evita duplicación de código.
* Mantiene consistencia visual.
* Facilita cambios futuros (formato, tamaño, estilos).

---

## Renderizado y UX

* Usa `Paper` como contenedor visual.
* Layout horizontal con `Stack`.
* Botón deshabilitado mientras `loading` es `true`.
* Indicador visual (`CircularProgress`) cuando se está cargando.

---

