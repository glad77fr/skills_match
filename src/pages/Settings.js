import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
  Grid,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs
} from '@mui/material';

/**
 * Page des paramètres
 * @returns {JSX.Element} - Composant de la page des paramètres
 */
const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });
  
  const [customFields, setCustomFields] = useState({
    job: {
      field1: { label: 'Niveau de responsabilité', visible: true },
      field2: { label: 'Service', visible: false },
      field3: { label: 'Champ personnalisé 3', visible: false },
      field4: { label: 'Champ personnalisé 4', visible: false }
    },
    position: {
      field1: { label: 'Localisation détaillée', visible: true },
      field2: { label: 'Référence interne', visible: true },
      field3: { label: 'Champ personnalisé 3', visible: false },
      field4: { label: 'Champ personnalisé 4', visible: false }
    },
    skill: {
      field1: { label: 'Niveau requis', visible: true },
      field2: { label: 'Domaine d\'application', visible: false },
      field3: { label: 'Champ personnalisé 3', visible: false },
      field4: { label: 'Champ personnalisé 4', visible: false }
    },
    employee: {
      field1: { label: 'Formation', visible: true },
      field2: { label: 'Années d\'expérience', visible: true },
      field3: { label: 'Langues parlées', visible: false },
      field4: { label: 'Champ personnalisé 4', visible: false }
    },
    evaluation: {
      field1: { label: 'Contexte d\'évaluation', visible: true },
      field2: { label: 'Objectifs de développement', visible: true },
      field3: { label: 'Date de réévaluation', visible: false },
      field4: { label: 'Commentaires supplémentaires', visible: false }
    }
  });
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [tabValue, setTabValue] = useState(0);
  const [entityType, setEntityType] = useState('job');

  // Gérer les changements de paramètres toggle
  const handleToggle = (setting) => () => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  // Changer l'onglet actif
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Changer le type d'entité pour les champs personnalisés
  const handleEntityTypeChange = (event) => {
    setEntityType(event.target.value);
  };

  // Sauvegarder les changements
  const handleSave = () => {
    // Simuler une sauvegarde
    setNotification({
      open: true,
      message: 'Paramètres enregistrés avec succès!',
      severity: 'success'
    });
  };

  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Mettre à jour un champ personnalisé
  const handleCustomFieldChange = (fieldKey, property, value) => {
    const newCustomFields = {...customFields};
    newCustomFields[entityType][fieldKey][property] = value;
    setCustomFields(newCustomFields);
  };

  // Traduire le type d'entité en français
  const getEntityTypeLabel = (type) => {
    const labels = {
      job: 'Métiers',
      position: 'Postes',
      skill: 'Compétences',
      employee: 'Employés',
      evaluation: 'Évaluations'
    };
    return labels[type] || type;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Préférences générales" />
        <Tab label="Champs personnalisés" />
      </Tabs>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Préférences générales
              </Typography>
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
                <Divider component="li" />
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
                <Divider component="li" />
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
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Champs personnalisés
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="entity-type-label">Type d'élément</InputLabel>
                  <Select
                    labelId="entity-type-label"
                    value={entityType}
                    label="Type d'élément"
                    onChange={handleEntityTypeChange}
                  >
                    <MenuItem value="job">Métiers</MenuItem>
                    <MenuItem value="position">Postes</MenuItem>
                    <MenuItem value="skill">Compétences</MenuItem>
                    <MenuItem value="employee">Employés</MenuItem>
                    <MenuItem value="evaluation">Évaluations</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Configuration des champs personnalisés pour les {getEntityTypeLabel(entityType)}
              </Typography>
              
              {Object.keys(customFields[entityType]).map((field, index) => (
                <Box key={field} sx={{ mb: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <TextField 
                        label={`Champ ${index + 1}`}
                        fullWidth
                        value={customFields[entityType][field].label}
                        onChange={(e) => handleCustomFieldChange(field, 'label', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ListItem>
                        <ListItemText primary="Visible" />
                        <Switch
                          edge="end"
                          checked={customFields[entityType][field].visible}
                          onChange={() => handleCustomFieldChange(field, 'visible', !customFields[entityType][field].visible)}
                        />
                      </ListItem>
                    </Grid>
                  </Grid>
                  {index < 3 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSave}
                >
                  Enregistrer les modifications
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 