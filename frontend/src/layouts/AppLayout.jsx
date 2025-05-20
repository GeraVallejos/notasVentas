import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/ui/SideBar';
import Navbar from '../components/ui/NavBar';



const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuToggle = () => setMobileOpen((prev) => !prev);
  const handleMenuClose = () => setMobileOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar mobileOpen={mobileOpen} onMenuClick={handleMenuToggle} />
      <Sidebar mobileOpen={mobileOpen} onClose={handleMenuClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 1, }}>
        <Toolbar /> {/* para que no se tape el contenido con el AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
