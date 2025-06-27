# <font color=#ff5733>Notistack</font>

Notistack es una extensión de los snackbars de Material-UI que permite:

- Apilar múltiples notificaciones (a diferencia del snackbar nativo de MUI, que solo muestra una a la vez).
- Personalizar cada snackbar individualmente (posición, duración, estilo, etc.).
- Control programático (cerrar, reabrir o actualizar notificaciones desde cualquier parte de la app).
- Soporte para React (funciona perfectamente con hooks y context).

Esencialmente, resuelve el problema de manejar múltiples mensajes emergentes sin que se solapen o desaparezcan abruptamente.

### Teoría y Funcionamiento

- El Snackbar nativo de Material-UI solo muestra un mensaje a la vez. Si se disparan varias notificaciones seguidas, se pierden.
- Notistack usa una cola (queue) para manejar múltiples mensajes y los muestra en orden.
- Permite diferentes tipos de snackbars (éxito, error, advertencia, info) con estilos predefinidos.
- Es altamente personalizable (puedes modificar animaciones, tiempo de duración, posición, etc.).

#### Arquitectura básica

1. Provider (SnackbarProvider) → Envuelve la aplicación y gestiona el estado global de las notificaciones.

2. Hooks (useSnackbar) → Permite disparar notificaciones desde cualquier componente.

3. Snackbars apilados → Se muestran en una pila (stack) según su prioridad.

### Uso Básico

`npm install notistack @mui/material @emotion/react @emotion/styled`

#### **Envolver la aplicación en `SnackbarProvider`:**

```js
// App.js o index.js
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <RestoDeTuApp />
    </SnackbarProvider>
  );
}
```

`maxSnack`: Número máximo de notificaciones visibles a la vez.

`autoHideDuration`: Tiempo en ms antes de que se cierre automáticamente (opcional).

#### **Mostrar notificaciones**

Se usa el `useSnackbar` en cualquier componente

```js
import { useSnackbar } from 'notistack';

function MiComponente() {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    // Notificación básica
    enqueueSnackbar('Mensaje de éxito', { variant: 'success' });
    
    // Con opciones personalizadas
    enqueueSnackbar('Error crítico', { 
      variant: 'error',
      persist: true, // No se cierra automáticamente
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  };

  return <button onClick={handleClick}>Mostrar Notificación</button>;
}
```

#### **Variables disponibles**

| Tipo | Uso típico |
|------|------|
| default |	Mensaje neutro |
| success |	Operación exitosa |
| error | Algo falló |
| warning |	Advertencia |
| info | Información adicional |

#### **Personalización Avanzada**

A. Cambiar estilos

Se puede sobrescribir los estilos con makeStyles (o sx en MUI):

```js
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  success: { backgroundColor: '#4caf50' },
  error: { backgroundColor: '#f44336' },
}));

// Luego pasarlo al provider:
<SnackbarProvider classes={useStyles()}>
```

B. Añadir acciones (botones)

```js
enqueueSnackbar('Mensaje con acción', {
  action: (
    <Button color="inherit" onClick={() => alert('Acción ejecutada')}>
      Cerrar
    </Button>
  ),
});
```

C. Cerrar notificaciones manualmente

```js
const { enqueueSnackbar, closeSnackbar } = useSnackbar();

const key = enqueueSnackbar('Mensaje que puede cerrarse', {
  action: (key) => (
    <Button onClick={() => closeSnackbar(key)}>Cerrar</Button>
  ),
});
```

---