import { createTheme } from "@mui/material";

const themeJJ = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // Indigo más vibrante
    },
    secondary: {
      main: '#ec4899', // Rosa moderno
    },
    background: {
      default: '#f8fafc', // Gris muy claro
    },
  },
  shape: {
    borderRadius: 14, // Bordes más redondeados
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

export default themeJJ