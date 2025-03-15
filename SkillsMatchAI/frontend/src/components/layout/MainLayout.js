import React, { useState, useEffect } from 'react';
import { Box, Toolbar, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Composant de mise en page principale
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Contenu à afficher
 * @returns {JSX.Element} - Composant de mise en page principale
 */
const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const drawerWidth = 240;
  
  // Fermer automatiquement le drawer sur mobile lors du chargement initial
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);
  
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
          p: 2,
          width: '100%',
          marginLeft: {
            xs: 0,
            sm: 0
          },
          ml: drawerOpen ? { xs: 0, sm: `${drawerWidth}px` } : 0,
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