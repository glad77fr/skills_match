import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Switch, Divider } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

/**
 * Page de paramètres
 * @returns {JSX.Element} - Composant de paramètres
 */
const SettingsPage = () => {
  const [settings, setSettings] = React.useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });
  
  const handleToggle = (setting) => () => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Paramètres
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Préférences générales</Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemText 
                primary="Notifications" 
                secondary="Recevoir des notifications par email" 
              />
              <Switch
                edge="end"
                checked={settings.notifications}
                onChange={handleToggle('notifications')}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemText 
                primary="Mode sombre" 
                secondary="Activer le thème sombre" 
              />
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={handleToggle('darkMode')}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemText 
                primary="Sauvegarde automatique" 
                secondary="Sauvegarder automatiquement les modifications" 
              />
              <Switch
                edge="end"
                checked={settings.autoSave}
                onChange={handleToggle('autoSave')}
              />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Cette page est en cours de développement. D'autres paramètres seront ajoutés ultérieurement.
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default SettingsPage; 