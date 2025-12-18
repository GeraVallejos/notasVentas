## Propósito

Este componente representa la **página de creación o edición de una nota de venta**. Su única responsabilidad es renderizar el formulario principal encapsulado en `NotaForm`.

No contiene lógica adicional, lo que refuerza un diseño limpio y predecible.

---

### Análisis del código

```js
import { NotaForm } from "../components/forms/NotaForm"
```

* Se importa el formulario principal encargado de manejar:

  * Estado del formulario
  * Validaciones
  * Envío de datos
  * Integración con backend

---

```js
const NotasPage = () => {
  return (
    <>
      <NotaForm />
    </>
  )
}
```

* El fragmento (<>...</>) no añade nodos innecesarios al DOM.
* Toda la complejidad queda encapsulada dentro del formulario.
* La página cumple el rol de **contenedor de ruta**, no de lógica.

---

### Beneficios del enfoque

* Alta cohesión: cada archivo cumple una única función.
* Facilita pruebas unitarias y mantenimiento.
* Permite reutilizar `NotaForm` en otros flujos (edición, duplicado, etc.).
* Mantiene las páginas alineadas con una arquitectura escalable.

---