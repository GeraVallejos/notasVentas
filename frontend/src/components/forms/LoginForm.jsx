import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { FormProvider } from 'react-hook-form';
import { useLoginForm } from '../../hooks/useLoginForm';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const form = useLoginForm(async (data) => {
    try {
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', data.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      await api.post('/token/', data);
      window.location.replace('/');
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error al iniciar sesión';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      form.setValue('username', savedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    <Box
      sx={{
        width: 360,
        mx: 'auto',
        mt: 0,
        px: 4,
        py: 5,
        bgcolor: '#FFFFFF',
        borderRadius: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          background: ' #00BFFF',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '500',
          my: 1,
        }}
      >
        PEDIDOS AIS
      </Typography>

      <Typography variant="subtitle2" color="#929191" mb={4}>
        Ingresa para gestionar los pedidos de Comercializadora AIS
      </Typography>

      <FormProvider {...form}>
        <form onSubmit={form.onSubmit} noValidate autoComplete="off">
          <Stack spacing={2}>
            <TextField
              placeholder="Username"
              type="text"
              spellCheck={false}
              autoCorrect="off"
              autoComplete="off"
              {...form.register('username')}
              error={!!form.formState.errors.username}
              helperText={form.formState.errors.username?.message}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name='login-password'
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
              fullWidth
              variant="outlined"
              autoComplete="new-password"
              autoCorrect="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRememberMe(checked);
                    if (!checked) {
                      localStorage.removeItem('rememberedUsername');
                    }
                  }}
                  sx={{
                    color: '#929191',
                    '&.Mui-checked': {
                      color: '#1E90FF',
                    },
                  }}
                />
              }
              label="Recordarme"
              sx={{ justifyContent: 'flex-start', ml: 1, color: '#929191' }}
            />

            <Button
              type="submit"
              size="large"
              fullWidth
              disabled={form.formState.isSubmitting}
              sx={{
                mt: 1,
                background: '#00BFFF',
                color: 'white',
                textTransform: 'uppercase',
                '&:hover': {
                  background: '#1C86EE',
                  color: 'white',
                },
                '&.Mui-disabled': {
                    background: '#00BFFF',
                    color: 'white',
                  },
              }}
            >
              {form.formState.isSubmitting ? 'Cargando...' : 'INGRESAR'}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
};
