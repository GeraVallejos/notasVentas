import store from '../store';
import { fetchUserThunk } from '../auth/authThunk';

export const privateLoader = async () => {
  const { user } = store.getState().auth;
  if (user) return null;

  try {
    await store.dispatch(fetchUserThunk()).unwrap();
    return null;
  } catch {
    throw new Response('Unauthorized', {
      status: 302,
      headers: { Location: '/login' },
    });
  }
};

export const publicLoader = async () => {
  const { user } = store.getState().auth;
  if (user) {
    throw new Response('Already Authenticated', {
      status: 302,
      headers: { Location: '/notas' },
    });
  }

  try {
    await store.dispatch(fetchUserThunk()).unwrap();
    throw new Response('Already Authenticated', {
      status: 302,
      headers: { Location: '/notas' },
    });
  } catch {
    return null;
  }
};
