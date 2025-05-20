import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearStore } from '../auth/authSlice';
import { LoginForm } from '../components/forms/LoginForm';
import { Grid, Box, Typography } from '@mui/material';

const LoginPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearStore());
  }, [dispatch]);

  return (
    <Grid container sx={{ height: '100vh', width: '100vw', overflow: 'hidden', }}>
      {/* Columna del formulario */}
      <Grid
        size={{ xs: 12, md: 6 }}
        container
        direction="column"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: { xs: '100vh', md: '100vh' },
          width: { xs: '100vw', md: '50vw' },
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 1,
          }}
        >
          <img
            src="Logo_JJ.png"
            alt="Icono"
            style={{ width: '60px', height: '60px' }}
          />
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(to right, #00BFFF, #1E90FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            JJ DETERGENTES
          </Typography>
        </Box>
        <LoginForm />
      </Grid>

      {/* Columna de la imagen */}
      <Grid
        size={{ xs: false, md: 6 }}
        sx={{
          display: { xs: 'none', md: 'block' },
          height: '100vh',
        }}
      >
        <Box
          sx={{
            width: '50vw',
            height: '100vh',
            backgroundImage: 'url("/paintJJ.jpg")', // asegúrate que esté en public/
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
