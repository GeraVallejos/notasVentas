import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

const SidebarContent = ({ onClick }) => (
  <List sx={{mt:10}}>
    <ListItemButton component={NavLink} to="/lista-notas" onClick={onClick}>
      <ListItemIcon><ListAltIcon /></ListItemIcon>
      <ListItemText primary="Lista de Notas" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/notas" onClick={onClick}>
      <ListItemIcon><NoteIcon /></ListItemIcon>
      <ListItemText primary="Nueva Nota" />
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
              backgroundColor: '#f0faff',
            },
          }}
        >
          <SidebarContent onClick={onClose} />
        </Drawer>
      )}

      {/* Drawer permanente para pantallas grandes */}
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
              backgroundColor: '#f0faff',
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
