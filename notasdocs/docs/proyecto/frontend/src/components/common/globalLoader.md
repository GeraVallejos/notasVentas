### Qué es

`GlobalLoader` es un componente de **bloqueo global de UI**, usado cuando la aplicación no puede renderizar contenido aún.

Ejemplo típico:

* Carga inicial de usuario
* Validación de sesión

---

### Diseño del componente

```js
<Fade in={true}>
```

* Animación suave
* Evita parpadeos
* Mejora percepción de carga

---

### Contenedor principal

```js
height: '100vh'
display: 'flex'
```

Garantiza:

* Centrado vertical y horizontal
* Bloqueo completo de la pantalla

---

### Loader visual

```js
<CircularProgress />
```

* Indicador estándar
* No distrae
* Claramente reconocible

---

### Mensaje informativo

```js
<Typography>
  Cargando datos de usuario...
</Typography>
```

Reduce incertidumbre del usuario explicando **qué está ocurriendo**.

---