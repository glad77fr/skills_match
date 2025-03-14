import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Composant de mise en page principale
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Contenu à afficher
 * @returns {JSX.Element} - Composant de mise en page principale
 */
const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Barre de navigation */}
      <Navbar toggleDrawer={toggleDrawer} />
      
      {/* Menu latéral */}
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? 240 : 0}px)` },
          ml: { sm: drawerOpen ? 0 : -240 },
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 