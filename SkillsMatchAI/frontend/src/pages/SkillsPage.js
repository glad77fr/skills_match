import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import skillService from '../services/skillService';

/**
 * Page de gestion des compétences
 * @returns {JSX.Element} - Composant de gestion des compétences
 */
const SkillsPage = () => {
  // États pour la liste des compétences
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // États pour le formulaire
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' ou 'edit'
  const [currentSkill, setCurrentSkill] = useState({
    id: null,
    name: '',
    description: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  // État pour les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Afficher une notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // Charger les catégories de compétences
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await skillService.getSkillCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        showNotification('Erreur lors du chargement des catégories', 'error');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Charger les compétences depuis l'API
  const fetchSkills = React.useCallback(async () => {
    setLoading(true);
    try {
      // Préparer les paramètres de requête
      const params = {};
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      
      // Appeler l'API
      const data = await skillService.getSkills(params);
      
      // Gérer la pagination côté client si l'API ne la supporte pas
      let paginatedData = Array.isArray(data) ? data : data.results || [];
      const total = Array.isArray(data) ? data.length : data.count || paginatedData.length;
      
      // Si l'API ne gère pas la pagination, on la fait côté client
      if (Array.isArray(data)) {
        const startIndex = page * rowsPerPage;
        paginatedData = paginatedData.slice(startIndex, startIndex + rowsPerPage);
      }
      
      setSkills(paginatedData);
      setTotalCount(total);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
      setLoading(false);
      showNotification('Erreur lors du chargement des compétences', 'error');
    }
  }, [page, rowsPerPage, searchTerm, categoryFilter]);
  
  // Charger les compétences
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);
  
  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Ouvrir le formulaire en mode ajout
  const handleAddSkill = () => {
    setCurrentSkill({
      id: null,
      name: '',
      description: '',
      category: ''
    });
    setFormErrors({});
    setFormMode('add');
    setOpenForm(true);
  };
  
  // Ouvrir le formulaire en mode édition
  const handleEditSkill = (skill) => {
    setCurrentSkill({ ...skill });
    setFormErrors({});
    setFormMode('edit');
    setOpenForm(true);
  };
  
  // Fermer le formulaire
  const handleCloseForm = () => {
    setOpenForm(false);
  };
  
  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill({
      ...currentSkill,
      [name]: value
    });
    
    // Effacer l'erreur pour ce champ
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!currentSkill.name.trim()) {
      errors.name = 'Le nom est requis';
    }
    
    if (!currentSkill.category) {
      errors.category = 'La catégorie est requise';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Soumettre le formulaire
  const handleSubmitForm = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (formMode === 'add') {
        // Créer une nouvelle compétence
        const newSkill = await skillService.createSkill(currentSkill);
        setSubmitting(false);
        setOpenForm(false);
        showNotification('Compétence ajoutée avec succès', 'success');
        // Rafraîchir la liste
        fetchSkills();
      } else {
        // Mettre à jour une compétence existante
        await skillService.updateSkill(currentSkill.id, currentSkill);
        setSubmitting(false);
        setOpenForm(false);
        showNotification('Compétence mise à jour avec succès', 'success');
        // Rafraîchir la liste
        fetchSkills();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setSubmitting(false);
      
      // Afficher un message d'erreur spécifique si disponible
      if (error.response && error.response.data) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : Object.values(error.response.data).flat().join(', ');
        showNotification(`Erreur: ${errorMessage}`, 'error');
      } else {
        showNotification('Erreur lors de la soumission du formulaire', 'error');
      }
    }
  };
  
  // Gérer la suppression d'une compétence
  const handleDeleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      showNotification('Compétence supprimée avec succès', 'success');
      // Rafraîchir la liste
      fetchSkills();
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétence:', error);
      showNotification('Erreur lors de la suppression de la compétence', 'error');
    }
  };
  
  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestion des compétences
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSkill}
        >
          Ajouter une compétence
        </Button>
      </Box>
      
      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="category-filter-label">Catégorie</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Catégorie"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">Toutes les catégories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Tableau des compétences */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : skills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    Aucune compétence trouvée
                  </TableCell>
                </TableRow>
              ) : (
                skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>{skill.description}</TableCell>
                    <TableCell>
                      <Chip label={skill.category} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifier">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </Paper>
      
      {/* Formulaire d'ajout/édition */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formMode === 'add' ? 'Ajouter une compétence' : 'Modifier la compétence'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Nom de la compétence"
              type="text"
              fullWidth
              variant="outlined"
              value={currentSkill.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={currentSkill.description}
              onChange={handleFormChange}
            />
            <FormControl fullWidth error={!!formErrors.category}>
              <InputLabel id="category-label">Catégorie</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={currentSkill.category}
                label="Catégorie"
                onChange={handleFormChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category && (
                <Typography variant="caption" color="error">
                  {formErrors.category}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} disabled={submitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmitForm}
            variant="contained"
            color="primary"
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={20} />}
          >
            {formMode === 'add' ? 'Ajouter' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SkillsPage; 