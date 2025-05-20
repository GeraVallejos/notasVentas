import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Login
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post('/token/', credentials);
    return res.data.message;
  } catch (error) {
    const message = error.response?.data?.detail || 'Error de login';
    return thunkAPI.rejectWithValue({detail: message});
  }
});

// Obtener usuario actual
export const fetchUserThunk = createAsyncThunk('auth/fetchUserThunk', async (_, thunkAPI) => {

  if (window.location.pathname === '/login') {
      return ;
    }
  try {
    const res = await api.get('/usuario/actual/');
    return res.data;
  } catch (error) {
    console.error(error)
    return thunkAPI.rejectWithValue({ detail: 'Usuario no autenticado' });
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/usuario/logout/');
    return true;
  } catch (error) {
    console.error(error)
    return thunkAPI.rejectWithValue({ detail: 'Error al cerrar sesión' });
  }
});
