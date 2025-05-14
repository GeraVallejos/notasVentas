// components/forms/LoginForm.js
import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { useLoginForm } from '../../hooks/useLoginForm';
import api from '../../utils/api';
import { useSnackbar } from 'notistack';
import { TextInputsForm } from './TextInputForm';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const form = useLoginForm(async (data) => {
    try {
      await api.post('/token/', data); // Login con cookies
      enqueueSnackbar('Inicio de sesión exitoso', { variant: 'success' });
      window.location.replace('/'); // Redirige al home
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error al iniciar sesión';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <FormProvider {...form}>
      <Card
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 8,
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar sesión
          </Typography>

          <form onSubmit={form.onSubmit} noValidate>
            <Stack spacing={3}>
              <TextInputsForm name="username" label="Nombre de Usuario" type="text" />
              <TextInputsForm
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                toggleVisibility={togglePasswordVisibility}
                isPasswordVisible={showPassword}
              />
              <Button type="submit" variant="contained" size="large" fullWidth>
                Ingresar
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
