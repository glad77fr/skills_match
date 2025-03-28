import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Switch, Divider, Tabs, Tab, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import settingsService from '../services/settingsService';

/**
 * Page de paramètres
 * @returns {JSX.Element} - Composant de paramètres
 */
const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });
  
  const [tabValue, setTabValue] = useState(0);
  const [modelType, setModelType] = useState('job');
  const [customFields, setCustomFields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleToggle = (setting) => () => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleModelTypeChange = (event) => {
    setModelType(event.target.value);
    fetchCustomFields(event.target.value);
  };
  
  // Récupérer les champs personnalisés pour un type de modèle
  const fetchCustomFields = async (model) => {
    setLoading(true);
    try {
      const data = await settingsService.getCustomFieldsForModel(model);
      setCustomFields(settingsService.extractCustomFieldsConfig(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des champs personnalisés:', error);
      showNotification('Erreur lors de la récupération des champs personnalisés', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Enregistrer les modifications des champs personnalisés
  const saveCustomFields = async () => {
    if (!customFields) return;
    
    setSaving(true);
    try {
      const updateData = settingsService.prepareCustomFieldsUpdateData(customFields);
      await settingsService.updateCustomFields(modelType, updateData);
      showNotification('Champs personnalisés mis à jour avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des champs personnalisés:', error);
      showNotification('Erreur lors de la mise à jour des champs personnalisés', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Mettre à jour un champ personnalisé
  const handleCustomFieldChange = (fieldKey, property, value) => {
    setCustomFields({
      ...customFields,
      [fieldKey]: {
        ...customFields[fieldKey],
        [property]: value
      }
    });
  };
  
  // Afficher une notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Charger les champs personnalisés au chargement initial
  useEffect(() => {
    fetchCustomFields(modelType);
  }, []);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Préférences générales" />
        <Tab label="Champs personnalisés" />
      </Tabs>
      
      {tabValue === 0 && (
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
        </Paper>
      )}
      
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Configuration des champs personnalisés</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="model-type-label">Type d'entité</InputLabel>
              <Select
                labelId="model-type-label"
                value={modelType}
                onChange={handleModelTypeChange}
                label="Type d'entité"
              >
                <MenuItem value="job">Métiers</MenuItem>
                <MenuItem value="position">Positions</MenuItem>
                <MenuItem value="employee">Employés</MenuItem>
                <MenuItem value="skill">Compétences</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : customFields ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Configurez les champs personnalisés pour les {modelType === 'job' ? 'métiers' : 
                                                             modelType === 'position' ? 'positions' : 
                                                             modelType === 'employee' ? 'employés' : 
                                                             'compétences'}
              </Typography>
              
              <List>
                {Object.keys(customFields).map((fieldKey, index) => (
                  <React.Fragment key={fieldKey}>
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ flex: 1 }}>
                          Champ personnalisé {index + 1}
                        </Typography>
                        <Switch
                          checked={customFields[fieldKey].visible}
                          onChange={(e) => handleCustomFieldChange(fieldKey, 'visible', e.target.checked)}
                          inputProps={{ 'aria-label': 'Visibilité du champ' }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Libellé du champ"
                        value={customFields[fieldKey].label}
                        onChange={(e) => handleCustomFieldChange(fieldKey, 'label', e.target.value)}
                        disabled={!customFields[fieldKey].visible}
                        helperText={customFields[fieldKey].visible ? "Ce texte sera affiché comme libellé du champ" : "Activez le champ pour modifier son libellé"}
                      />
                    </ListItem>
                    {index < 3 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={saveCustomFields}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : "Enregistrer les modifications"}
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Aucun champ personnalisé trouvé</Typography>
          )}
        </Paper>
      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage; 