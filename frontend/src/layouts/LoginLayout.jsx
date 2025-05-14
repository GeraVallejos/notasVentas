import { useState } from 'react';
import { 
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Fade, 
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Google,
  Facebook,
  GitHub
} from '@mui/icons-material';






const LoginLayout = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticación aquí
    console.log({ email, password, rememberMe });
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={500}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 4,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    Bienvenido de vuelta
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Inicia sesión para acceder a tu cuenta
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Correo electrónico"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    sx: { borderRadius: 3 },
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    sx: { borderRadius: 3 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Recuérdame"
                  />
                  <Link href="#" variant="body2" sx={{ fontWeight: 500 }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                    },
                  }}
                >
                  Iniciar sesión
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    O continúa con
                  </Typography>
                </Divider>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      sx={{
                        borderRadius: 3,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'text.primary',
                        },
                      }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Facebook />}
                      sx={{
                        borderRadius: 3,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'text.primary',
                        },
                      }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GitHub />}
                      sx={{
                        borderRadius: 3,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'text.primary',
                        },
                      }}
                    >
                      GitHub
                    </Button>
                  </Grid>
                </Grid>

                <Box textAlign="center" mt={2}>
                  <Typography variant="body2">
                    ¿No tienes una cuenta?{' '}
                    <Link
                      href="#"
                      sx={{ fontWeight: 600 }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      Regístrate
                      <Box
                        component="span"
                        sx={{
                          height: '2px',
                          backgroundColor: 'primary.main',
                          display: 'block',
                          width: isHovered ? '100%' : '0%',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
  );
};

export default LoginLayout