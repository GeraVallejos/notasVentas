## ComunaAutocomplete

### Qué es

Un `Autocomplete` optimizado para buscar comunas desde un **JSON estático**, con foco en:

* Rendimiento
* UX tolerante
* Reutilización

---

### Análisis del Código

#### 1️⃣ Estado interno

```js
const [filteredOptions, setFilteredOptions] = useState([]);
const [inputValue, setInputValue] = useState(value || '');
```

* `filteredOptions`: opciones visibles
* `inputValue`: texto escrito por el usuario

---

#### 2️⃣ Normalización de texto

```js
const normalizeText = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
```

Permite:

* Ignorar acentos
* Búsqueda más flexible

---

#### 3️⃣ Filtrado controlado

```js
const matches = comunasData
  .filter((comuna) => normalizeText(comuna.nombre).includes(normalizedQuery))
  .slice(0, 10)
  .map((item) => ({ label: item.nombre, full: item }));
```

* Limita resultados
* Evita render excesivo
* Mejora performance

---

#### 4️⃣ Debounce

```js
const debouncedFilter = useMemo(() => debounce(filterComunas, 300), []);
```

* Evita ejecutar lógica en cada tecla
* Reduce renders

---

#### 5️⃣ Sincronización externa

```js
useEffect(() => {
  setInputValue(value || '');
}, [value]);
```

Permite:

* Control desde formularios
* Integración con React Hook Form

---