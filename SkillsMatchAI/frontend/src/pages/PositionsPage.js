import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import positionService from '../services/positionService';
import jobService from '../services/jobService';
import { useNavigate } from 'react-router-dom';

/**
 * Page de gestion des postes
 * @returns {JSX.Element} - Composant de gestion des postes
 */
const PositionsPage = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  
  // Form states
  const [openForm, setOpenForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [formData, setFormData] = useState({
    job: '',
    is_active: true,
    location: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchJobs = useCallback(async () => {
    try {
      const data = await jobService.getJobs();
      setJobs(data.results || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des métiers:', error);
      showNotification('Erreur lors de la récupération des métiers', 'error');
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchQuery,
        job: jobFilter
      };
      
      const data = await positionService.getPositions(params);
      setPositions(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des postes:', error);
      showNotification('Erreur lors de la récupération des postes', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, jobFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleJobFilterChange = (event) => {
    setJobFilter(event.target.value);
    setPage(0);
  };

  const resetForm = () => {
    setFormData({
      job: '',
      is_active: true,
      location: '',
      description: ''
    });
    setFormErrors({});
    setCurrentPosition(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormTitle('Ajouter un poste');
    setOpenForm(true);
  };

  const openEditForm = (position) => {
    setCurrentPosition(position);
    setFormData({
      job: position.job?.id || '',
      is_active: position.is_active !== undefined ? position.is_active : true,
      location: position.location || '',
      description: position.description || ''
    });
    setFormTitle('Modifier le poste');
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.job) {
      errors.job = 'Le métier est requis';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (currentPosition) {
        // Update existing position
        await positionService.updatePosition(currentPosition.id, formData);
        showNotification('Poste mis à jour avec succès');
      } else {
        // Create new position
        await positionService.createPosition(formData);
        showNotification('Poste créé avec succès');
      }
      
      handleCloseForm();
      fetchPositions();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du poste:', error);
      showNotification('Erreur lors de l\'enregistrement du poste', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (position) => {
    setPositionToDelete(position);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPositionToDelete(null);
  };

  const handleDeletePosition = async () => {
    if (!positionToDelete) return;
    
    setLoading(true);
    try {
      await positionService.deletePosition(positionToDelete.id);
      showNotification('Poste supprimé avec succès');
      fetchPositions();
    } catch (error) {
      console.error('Erreur lors de la suppression du poste:', error);
      showNotification('Erreur lors de la suppression du poste', 'error');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const viewPositionSkills = (positionId) => {
    navigate(`/positions/${positionId}/skills`);
  };

  const assignEmployee = (positionId) => {
    navigate(`/positions/${positionId}/assign`);
  };

  const getJobName = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Non spécifié';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Postes
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="job-filter-label">Filtrer par métier</InputLabel>
            <Select
              labelId="job-filter-label"
              id="job-filter"
              value={jobFilter}
              label="Filtrer par métier"
              onChange={handleJobFilterChange}
            >
              <MenuItem value="">Tous les métiers</MenuItem>
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title} - Niveau {job.level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddForm}
        >
          Ajouter un poste
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Poste</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun poste trouvé
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.job_title || 'Non spécifié'}</TableCell>
                  <TableCell>{position.job_level || 'Non spécifié'}</TableCell>
                  <TableCell>{position.location || 'Non spécifié'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={position.is_active ? 'Actif' : 'Inactif'} 
                      color={position.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir les compétences requises">
                      <IconButton 
                        color="primary" 
                        onClick={() => viewPositionSkills(position.id)}
                      >
                        <PsychologyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Assigner un employé">
                      <IconButton 
                        color="primary" 
                        onClick={() => assignEmployee(position.id)}
                      >
                        <PersonIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton 
                        color="primary" 
                        onClick={() => openEditForm(position)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        color="error" 
                        onClick={() => openDeleteConfirmation(position)}
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
      </TableContainer>
      
      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{formTitle}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }} error={!!formErrors.job}>
              <InputLabel id="job-label">Métier</InputLabel>
              <Select
                labelId="job-label"
                name="job"
                value={formData.job}
                label="Métier"
                onChange={handleFormChange}
                required
              >
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title} - Niveau {job.level}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.job && (
                <Typography variant="caption" color="error">
                  {formErrors.job}
                </Typography>
              )}
            </FormControl>
            
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="location"
              label="Localisation"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Statut</InputLabel>
              <Select
                labelId="status-label"
                name="is_active"
                value={formData.is_active}
                label="Statut"
                onChange={handleFormChange}
              >
                <MenuItem value={true}>Actif</MenuItem>
                <MenuItem value={false}>Inactif</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} disabled={loading}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le poste "{positionToDelete?.title}" ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeletePosition} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Supprimer'}
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
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PositionsPage; 