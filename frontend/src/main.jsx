import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import './index.css';

import { getRoutes } from './routes/Routes';
import store from './store';
import AppTheme from './theme/AppTheme';

const router = getRoutes();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <AppTheme>
          <RouterProvider router={router} />
        </AppTheme>
      </SnackbarProvider>
    </Provider>
  </StrictMode>
);
