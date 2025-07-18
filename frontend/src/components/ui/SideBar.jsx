import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getYear } from 'date-fns';
import archivo_carpeta from '../../assets/iconos/archivo_carpeta.png';
import lista_notas from '../../assets/iconos/lista_notas.png';
import bloc from '../../assets/iconos/bloc.png';

const drawerWidth = 180;

const SidebarContent = ({ onClick }) => (
  <List sx={{ mt: 10 }}>
    <ListItemButton component={NavLink} to="/lista-notas" onClick={onClick}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        <img src={lista_notas} alt="Lista de Notas" style={{ width: 24, height: 24 }} />
      </ListItemIcon>
      <ListItemText primary="Lista de Notas" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/notas" onClick={onClick}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        <img src={bloc} alt="Nueva Nota" style={{ width: 24, height: 24 }} />
      </ListItemIcon>
      <ListItemText primary="Nueva Nota" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/lista-historico" onClick={onClick}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        <img src={archivo_carpeta} alt="Histórico" style={{ width: 24, height: 24 }} />
      </ListItemIcon>
      <ListItemText primary="Histórico" />
    </ListItemButton>
  </List>
);

const Sidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {/* Drawer temporal para móviles */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
            },
          }}
        >
          <SidebarContent onClick={onClose} />
        </Drawer>
      )}

      {/* Drawer permanente con footer solo en pantallas grandes */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          }}
        >
          {/* Contenido arriba */}
          <Box>
            <SidebarContent />
          </Box>

          {/* Footer abajo */}
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" align='center' >
              © {getYear(new Date())} Gerardo Vallejos <br /> <span style={{fontSize: 10}}>Todos los derechos reservados</span>
            </Typography>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
