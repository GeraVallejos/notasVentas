import { createTheme } from '@mui/material/styles';


const themeJJ = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00BFFF', // Deep Sky Blue
      light: '#66D9FF',
      dark: '#009ACD',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1E90FF', // Dodger Blue
      light: '#63B3FF',
      dark: '#005cb2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0faff', // Fondo general suave azul
      paper: '#ffffff',   // Fondo de tarjetas y componentes
    },
    text: {
      primary: '#0A0A0A',
      secondary: '#555',
    },
    error: {
      main: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#0288D1',
    },
  },
  typography: {
    fontFamily: ' "Saira", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
          borderRadius: 999,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00BFFF',
          color: '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default themeJJ;
