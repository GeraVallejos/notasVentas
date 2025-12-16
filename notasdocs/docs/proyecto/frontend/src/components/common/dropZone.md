### Qué es

`DropZone` es un componente reutilizable para **carga de archivos**, soportando:

* Drag & Drop
* Selección manual
* Filtros por extensión
* Estado de carga

---

### Estado interno

```js
const [isDragging, setIsDragging] = useState(false);
```

Este estado controla:

* Estilos visuales
* Feedback inmediato al usuario

---

### Manejo de eventos Drag & Drop

#### 1. Drag over

```js
e.preventDefault();
setIsDragging(true);
```

Evita el comportamiento por defecto del navegador y activa el estado visual.

---

#### 2. Drop

```js
const files = Array.from(e.dataTransfer.files).filter(...);
```

Lógica clave:

1. Convierte `FileList` a array
2. Filtra por extensiones permitidas
3. Delegación a `onFilesDrop`

---

### Selección manual de archivos

```js
const input = document.createElement('input');
```

Este patrón permite:

* Evitar inputs visibles
* Mantener una UI limpia
* Soportar múltiples archivos

---

### Estado de carga

```js
{loading && <Box>...</Box>}
```

* Overlay bloqueante
* Evita interacciones
* Feedback claro al usuario

---