import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Toolbar,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Apartment as DepartmentIcon,
  Badge as PositionIcon
} from '@mui/icons-material';

// Largeur du menu latéral
const drawerWidth = 240;

/**
 * Composant de menu latéral
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.open - État d'ouverture du menu
 * @param {Function} props.onClose - Fonction pour fermer le menu
 * @returns {JSX.Element} - Composant de menu latéral
 */
const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({
    referentials: true,
    management: false,
    analytics: false
  });
  
  const handleMenuToggle = (menu) => {
    setOpenMenus({
      ...openMenus,
      [menu]: !openMenus[menu]
    });
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 900) {
      onClose();
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: 'fixed',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'fixed',
          transition: theme => theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: theme => theme.zIndex.drawer,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 1, pr: 1 }}>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/dashboard')}
              onClick={() => handleNavigation('/dashboard')}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Tableau de bord" />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Divider sx={{ my: 0.5 }} />
        
        {/* Référentiels */}
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuToggle('referentials')}>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Référentiels" />
              {openMenus.referentials ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={openMenus.referentials} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/skills')}
                onClick={() => handleNavigation('/skills')}
              >
                <ListItemIcon>
                  <PsychologyIcon />
                </ListItemIcon>
                <ListItemText primary="Compétences" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/jobs')}
                onClick={() => handleNavigation('/jobs')}
              >
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Emplois" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/departments')}
                onClick={() => handleNavigation('/departments')}
              >
                <ListItemIcon>
                  <DepartmentIcon />
                </ListItemIcon>
                <ListItemText primary="Départements" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/positions')}
                onClick={() => handleNavigation('/positions')}
              >
                <ListItemIcon>
                  <PositionIcon />
                </ListItemIcon>
                <ListItemText primary="Postes" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        
        <Divider sx={{ my: 0.5 }} />
        
        {/* Gestion */}
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuToggle('management')}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Gestion" />
              {openMenus.management ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={openMenus.management} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/employees')}
                onClick={() => handleNavigation('/employees')}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Employés" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/skill-matching')}
                onClick={() => handleNavigation('/skill-matching')}
              >
                <ListItemIcon>
                  <PsychologyIcon />
                </ListItemIcon>
                <ListItemText primary="Matching de compétences" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        
        <Divider sx={{ my: 0.5 }} />
        
        {/* Analytique */}
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuToggle('analytics')}>
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Analytique" />
              {openMenus.analytics ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={openMenus.analytics} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/skill-analytics')}
                onClick={() => handleNavigation('/skill-analytics')}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Analyse des compétences" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pl: 3 }}
                selected={isActive('/gap-analysis')}
                onClick={() => handleNavigation('/gap-analysis')}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Analyse des écarts" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        
        <Divider sx={{ my: 0.5 }} />
        
        <List dense>
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/settings')}
              onClick={() => handleNavigation('/settings')}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Paramètres" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 