import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearStore } from '../auth/authSlice';
import { LoginForm } from '../components/forms/LoginForm';
import { Grid, Box} from '@mui/material';
import jj_baner from '../assets/imagenes/jj_baner.jpg'

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
            backgroundImage: `url(${jj_baner})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8,
            
          }}
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
