import { store } from '../store';
import { fetchUserThunk } from '../auth/authThunk';

// Para rutas protegidas (requiere sesión)
export const privateLoader = async () => {
  try {
    await store.dispatch(fetchUserThunk()).unwrap(); // Pre-carga el usuario en Redux
    return null; // Permitir el acceso
  } catch {
    throw new Response('Unauthorized', {
      status: 302,
      headers: { Location: '/login' },
    });
  }
};

// Para rutas públicas (no debe haber sesión)
export const publicLoader = async () => {
  try {
    await store.dispatch(fetchUserThunk()).unwrap();
    // Ya autenticado → redirigir
    throw new Response('Already Authenticated', {
      status: 302,
      headers: { Location: '/productos' },
    });
  } catch {
    return null; // No autenticado → permitir acceso
  }
};
