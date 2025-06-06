import { AppBar, Toolbar, Typography, IconButton, Box, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from "../../auth/authThunk";
import ActionButton from '../common/ActionButton';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = ({ mobileOpen, onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(to right, #00BFFF, #1E90FF)',
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onMenuClick}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}

        <Link href='/' underline='none' variant="h6" noWrap sx={{ color: 'white' }}>
          Sistema de Pedidos
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <ActionButton
          action={() => dispatch(logout()).unwrap()}
          label="Cerrar sesión"
          tooltip="Cerrar sesión" // texto del tooltip en mobile
          icon={<LogoutIcon />}
          variant="text"
          color="inherit"
          onSuccess={() => {
            window.location.href = '/login';
          }}
          sx={{
            marginLeft: 'auto',
            ml: isMobile ? 1 : 'auto',        // un poco de margen en móvil
            mr: isMobile ? 1 : 0,             // evitar que quede pegado al borde derecho
            minWidth: isMobile ? 'auto' : undefined, // botón más compacto en móvil
            padding: isMobile ? '4px' : undefined,   // padding reducido solo en móvil
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
