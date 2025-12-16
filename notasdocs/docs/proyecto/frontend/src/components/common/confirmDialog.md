## ConfirmDialog

### Qué es

Modal genérico de confirmación para acciones críticas.

---

### Análisis del Código

```js
const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => (
```

* Totalmente controlado por el padre
* No mantiene estado interno

---

#### UX de confirmación

```js
<WarningAmberIcon color="warning" />
```

* Refuerza visualmente el riesgo

```js
<Button variant="outlined">Cancelar</Button>
<Button variant="contained" color="error">Confirmar</Button>
```

* Botones semánticos
* Prevención de errores del usuario

---