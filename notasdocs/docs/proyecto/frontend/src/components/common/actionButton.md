# components/common

La carpeta **components/common** contiene componentes **reutilizables, desacoplados del dominio**, diseñados para encapsular patrones frecuentes de interacción, UI y efectos colaterales.

A diferencia de las páginas o componentes de negocio, estos archivos se enfocan en **cómo** se ejecuta una acción o se interactúa con el usuario, no en **qué** se está haciendo a nivel funcional.

---

## Rol Arquitectónico

* Abstraer patrones repetidos
* Centralizar lógica transversal
* Reducir complejidad en páginas
* Mantener consistencia visual y de comportamiento

Estos componentes suelen ser usados por **pages, layouts o formularios**, pero no dependen de ellos.

---

##  ActionButton

###  Qué es

`ActionButton` es un botón genérico para ejecutar **acciones asíncronas**, incorporando automáticamente:

* Estado de carga
* Manejo de errores
* Feedback visual
* Comportamiento responsive

El componente **no conoce la lógica de negocio**: solo ejecuta una función y maneja su ciclo de vida.

---

### Props del componente

```js
action        // Función async que ejecuta la acción
label         // Texto del botón
onSuccess     // Callback opcional tras éxito
icon          // Ícono MUI
variant       // Variante del botón
color         // Color del botón
fullWidth     // Ocupa todo el ancho
sx            // Estilos adicionales
tooltip       // Texto para tooltip en móvil
```

---

### Análisis del Código Paso a Paso

#### 1️⃣ Estado de carga

```js
const [loading, setLoading] = useState(false);
```

* Controla si la acción está en curso
* Se usa para:

  * Deshabilitar el botón
  * Mostrar spinner
  * Evitar múltiples ejecuciones

---

#### 2️⃣ Integración con Snackbar

```js
const { enqueueSnackbar } = useSnackbar();
```

* Permite mostrar errores globales
* Evita que cada página implemente su propio manejo de errores

---

#### 3️⃣ Detección de dispositivo

```js
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

* Determina si el usuario está en móvil
* Modifica:

  * Tamaño
  * Padding
  * Texto visible

---

#### 4️⃣ Ejecución de la acción

```js
const handleClick = async () => {
  setLoading(true);
  try {
    await action();
    if (onSuccess) onSuccess();
  } catch (error) {
    enqueueSnackbar(error?.message || error || 'Ha ocurrido un error', {
      variant: 'error',
    });
  } finally {
    setLoading(false);
  }
};
```

**Flujo completo:**

1. Activa loading
2. Ejecuta la acción
3. Maneja éxito opcional
4. Captura error
5. Limpia estado

---

#### 5️⃣ Renderizado condicional

```js
{loading ? <CircularProgress /> : !isMobile && label}
```

* Si está cargando → spinner
* En móvil → solo ícono
* En desktop → ícono + texto

---

#### 6️⃣ Tooltip en móvil

```js
return isMobile && label ? (
  <Tooltip title={tooltip || label}>
    <span>{button}</span>
  </Tooltip>
) : button;
```

* Mantiene accesibilidad
* Evita saturar la UI

---

## 📌 Conclusión

Los componentes en **components/common** encapsulan patrones técnicos complejos en piezas simples, reutilizables y declarativas.

Esto permite:

* Páginas más limpias
* Menos bugs repetidos
* Mejor experiencia de usuario
* Arquitectura frontend profesional
