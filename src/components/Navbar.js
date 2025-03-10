import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

const pages = [
  { name: 'Tableau de bord', path: '/', icon: <DashboardIcon /> },
  { name: 'Employés', path: '/employees', icon: <PersonIcon /> },
  { name: 'Positions', path: '/positions', icon: <WorkIcon /> },
  { name: 'Départements', path: '/departments', icon: <BusinessIcon /> },
  { name: 'Compétences', path: '/skills', icon: <PsychologyIcon /> }
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo et titre pour les écrans larges */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SkillsMatchAI
          </Typography>

          {/* Menu hamburger pour les écrans mobiles */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {pages.map((page) => (
                    <ListItem key={page.name} disablePadding>
                      <ListItemButton component={RouterLink} to={page.path}>
                        <ListItemIcon>
                          {page.icon}
                        </ListItemIcon>
                        <ListItemText primary={page.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Déconnexion" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo et titre pour les écrans mobiles */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SkillsMatchAI
          </Typography>

          {/* Menu de navigation pour les écrans larges */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Menu utilisateur */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Ouvrir les paramètres">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.username || 'User'} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profil</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Déconnexion</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 