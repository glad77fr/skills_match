import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

/**
 * Page des paramètres utilisateur
 * @returns {JSX.Element} - Composant de la page des paramètres utilisateur
 */
const UserSettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    email: user?.email || '',
    darkMode: false,
    notificationsEnabled: true,
    language: 'fr'
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings({
      ...settings,
      [name]: event.target.type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Simuler la sauvegarde des paramètres
    setNotification({
      open: true,
      message: 'Paramètres enregistrés avec succès!',
      severity: 'success'
    });
  };
  
  const closeNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paramètres Utilisateur
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={user?.first_name || ''}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={user?.last_name || ''}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Préférences d'interface
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleChange}
                    name="darkMode"
                    color="primary"
                  />
                }
                label="Mode sombre"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationsEnabled}
                    onChange={handleChange}
                    name="notificationsEnabled"
                    color="primary"
                  />
                }
                label="Activer les notifications"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Enregistrer les modifications
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSettingsPage; 