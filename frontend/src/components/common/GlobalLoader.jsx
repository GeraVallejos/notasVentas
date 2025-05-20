import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const GlobalLoader = () => {
  return (
    <Fade in={true}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        <CircularProgress size={48} thickness={4} color="primary" />
        <Typography variant="subtitle1" sx={{ mt: 2, color: 'text.secondary' }}>
          Cargando datos de usuario...
        </Typography>
      </Box>
    </Fade>
  );
};

export default GlobalLoader;
