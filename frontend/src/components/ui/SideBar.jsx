import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
  Drawer,
  Box,
  Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getYear } from 'date-fns';

import lista_notas from '../../assets/iconos/lista_notas.png';
import sabado from '../../assets/iconos/sabado.png';
import factura from '../../assets/iconos/factura.png';
import materia_prima from '../../assets/iconos/materia-prima.png';


const drawerWidth = 180;

const SidebarContent = ({ onClick }) => {
  const [openNotas, setOpenNotas] = useState(false);
  const [openFacturas, setOpenFacturas] = useState(false);
  const [openMaterias, setOpenMaterias] = useState(false);

  const grupo = useSelector((state) => state.auth.user?.groups || []);
  const adminGroup = grupo.some((g) => g.includes('Admin'));

  return (
    <List sx={{ mt: 10 }}>
      {/* Menú Notas */}
      <ListItemButton onClick={() => setOpenNotas(!openNotas)}>
        <ListItemIcon sx={{ minWidth: 32 }}>
          <img src={lista_notas} alt="Notas" style={{ width: 24, height: 24 }} />
        </ListItemIcon>
        <ListItemText primary="Notas" />
      </ListItemButton>
      <Collapse in={openNotas} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={NavLink}
            to="/notas"
            onClick={onClick}
            sx={{ pl: 4 }}
          >
            <ListItemText 
              primary="Nueva Nota" 
              primaryTypographyProps={{ fontSize: 13 }}
            />
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/lista-notas"
            onClick={onClick}
            sx={{ pl: 4 }}
          >
            <ListItemText 
              primary="Lista de Notas" 
              primaryTypographyProps={{ fontSize: 13 }}
            />
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/lista-historico"
            onClick={onClick}
            sx={{ pl: 4 }}
          >
            <ListItemText 
              primary="Histórico Notas" 
              primaryTypographyProps={{ fontSize: 13 }}
            />
          </ListItemButton>
        </List>
      </Collapse>

      {adminGroup && (
        <>
          {/* Menú Facturas */}
          <ListItemButton onClick={() => setOpenFacturas(!openFacturas)}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <img src={factura} alt="Facturas" style={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Facturas" />
          </ListItemButton>
          <Collapse in={openFacturas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={NavLink}
                to="/pdf-facturas"
                onClick={onClick}
                sx={{ pl: 4 }}
              >
                <ListItemText 
                  primary="Lista Facturas" 
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItemButton>
              <ListItemButton
                component={NavLink}
                to="/pdf-facturas-historico"
                onClick={onClick}
                sx={{ pl: 4 }}
              >
                <ListItemText 
                  primary="Facturas Pagadas" 
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Menú Materias Primas */}
          <ListItemButton onClick={() => setOpenMaterias(!openMaterias)}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <img src={materia_prima} alt="Materias" style={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Insumos" />
          </ListItemButton>
          <Collapse in={openMaterias} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
             
              <ListItemButton
                component={NavLink}
                to="/materias-primas"
                onClick={onClick}
                sx={{ pl: 4 }}
              >
                <ListItemText 
                  primary="Pedir Insumos" 
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItemButton>
              <ListItemButton
                component={NavLink}
                to="/lista-materias-primas"
                onClick={onClick}
                sx={{ pl: 4 }}
              >
                <ListItemText 
                  primary="Lista Insumos" 
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItemButton>
              <ListItemButton
                component={NavLink}
                to="/historico-materias-primas"
                onClick={onClick}
                sx={{ pl: 4 }}
              >
                <ListItemText 
                  primary="Histórico Insumos" 
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItemButton>
            </List>
          </Collapse>
           <ListItemButton
                component={NavLink}
                to="/sabados"
                onClick={onClick}
                sx={{ pl: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <img src={sabado} alt="Sábados" style={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Sábados" 
                />
              </ListItemButton>
        </>
      )}
    </List>
  );
};

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


