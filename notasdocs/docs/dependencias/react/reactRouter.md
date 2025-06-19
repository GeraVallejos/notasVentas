# <font color=#ff5733>React Router</font>

React Router es la biblioteca estándar para el enrutamiento (navegación entre páginas) en aplicaciones React. Permite crear aplicaciones de una sola página (SPA) con navegación que simula la experiencia de múltiples páginas, manteniendo la interfaz sincronizada con la URL.

Sus principales funciones son:

- Mapeo de rutas a componentes: Asocia URLs específicas con componentes React
- Navegación declarativa: Permite definir enlaces y rutas de forma declarativa
- Anidamiento de rutas: Soporta rutas hijas y layouts anidados
- Gestión del historial: Maneja el historial del navegador (atrás/adelante)
- Protección de rutas: Permite implementar autenticación y autorización

### Componentes clave

| Componente/Hook |	Descripción |
|-------|-------|
| `RouterProvider` | Provee el router creado con createBrowserRouter (reemplaza a <BrowserRouter>).|
| `Form` |  Reemplaza `form` para enviar datos a action sin recargar la página. |
| `Link` | Navegación SPA (igual que en v6).
| `NavLink` |	Como <Link>, pero con estilos activos (ej: className={({ isActive }) => ...}). |
| `Outlet` | Renderiza rutas hijas (para layouts anidados). |
| `ScrollRestoration` | Auto-ajusta el scroll al cambiar de ruta. |

### Hooks esenciales

| Hook | Descripción |
|------|------|
| useLoaderData() | Accede a los datos cargados por loader. |
| useActionData() |	Obtiene la respuesta de un action (ej: después de un `Form`). |
| useRouteError() |	Maneja errores de carga/acción (reemplaza captura manual con try/catch). |
| useNavigation() |	Detecta estados de navegación (loading, submitting, idle). |
| useFetcher() | Para cargar datos o acciones sin navegar (ej: APIs modales). |

### Ejemplo de uso

```js
import { 
  createBrowserRouter,
  RouterProvider,
  Form,
  Link,
  Outlet,
  useLoaderData,
  useRouteError 
} from 'react-router-dom';

// 1. Define rutas con loaders/actions
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: () => fetch('/api/data'), // Carga datos
      },
      {
        path: 'posts',
        action: ({ request }) => {        // Maneja submits
          return createPost(await request.formData());
        },
        element: <Posts />,
      },
    ],
  },
]);

// 2. Provee el router
function App() {
  return <RouterProvider router={router} />;
}

// 3. Componentes con hooks de RRv7
function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
      </nav>
      <Outlet /> {/* Renderiza rutas hijas */}
    </div>
  );
}

function Posts() {
  const data = useLoaderData(); // Datos del loader
  return (
    <Form method="post"> {/* Envía a la acción definida */}
      <input name="title" />
      <button>Guardar</button>
    </Form>
  );
}

function ErrorPage() {
  const error = useRouteError(); // Accede al error
  return <div>Error: {error.message}</div>;
}
```

---
