import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Login (con cookies)
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/token/', credentials);
      await dispatch(fetchUserThunk()).unwrap();
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        'Error al iniciar sesión';
      return rejectWithValue(msg);
    }
  }
);

// Obtener usuario actual
export const fetchUserThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/usuario/actual/');
      return res.data;
    } catch (error) {
        const msg = error.response?.data?.detail || 'No autenticado';
      return rejectWithValue(msg);
    }
  }
);

// Logout
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/usuario/logout/');
    } catch (error) {
        const msg = error.response?.data?.detail || 'Error al cerrar sesión';
      return rejectWithValue(msg);
    }
  }
);
