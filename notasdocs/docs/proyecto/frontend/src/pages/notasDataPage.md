### Propósito

Este componente representa la **página de listado de notas de venta**. Su responsabilidad principal es preparar el contexto necesario (fecha, permisos del usuario y estado de filtrado) y delegar completamente la visualización y lógica de datos al componente `NotasDataGrid`.

No contiene lógica de presentación compleja ni manejo directo de datos, siguiendo el principio de **separación de responsabilidades** entre páginas y componentes reutilizables.

---

### Análisis del código

```js
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import NotasDataGrid from '../components/dataGrids/NotasDataGrid';
```

* `useSelector`: permite acceder al estado global de Redux, específicamente a la información del usuario autenticado.
* `date-fns/format`: se utiliza para generar un string de fecha legible y consistente.
* `NotasDataGrid`: componente encargado del renderizado de la grilla y la lógica asociada a las notas.

---

```js
const fechaActual = new Date();
const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');
```

* Se obtiene la fecha actual al momento de renderizar la página.
* El formato incluye **día, mes, año y hora**, lo que permite diferenciar exportaciones realizadas en distintos momentos.

---

```js
const userGroups = useSelector(state => state.auth.user?.groups || []);
```

* Se extraen los grupos del usuario desde el estado de autenticación.
* Se utiliza un fallback a arreglo vacío para evitar errores en renderizados iniciales.
* Esta información permite que el `NotasDataGrid` aplique **reglas de permisos o visibilidad** según el rol del usuario.

---

```js
<NotasDataGrid
  estado="NO SOLICITADO"
  nombre="Notas de Ventas"
  exportNombre={`Notas_de_Ventas_${fecha}`}
  userGroups={userGroups}
/>
```

* `estado`: filtra las notas que se mostrarán en la grilla.
* `nombre`: título descriptivo del módulo.
* `exportNombre`: nombre dinámico utilizado al exportar datos (por ejemplo, a Excel).
* `userGroups`: permite condicionar acciones o columnas según permisos.

La página actúa únicamente como **orquestadora de props**, manteniendo el componente desacoplado y reutilizable.

---

### Beneficios del enfoque

* Código simple y fácil de mantener.
* Reutilización del `NotasDataGrid` en otros contextos.
* Centralización de reglas de permisos en componentes especializados.
* Páginas ligeras, alineadas con buenas prácticas de React Router.

---

