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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  WorkOutline as WorkOutlineIcon
} from '@mui/icons-material';
import jobService from '../services/jobService';
import { useNavigate } from 'react-router-dom';

/**
 * Page de gestion des métiers
 * @returns {JSX.Element} - Composant de gestion des métiers
 */
const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobFamilies, setJobFamilies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFamilyFilter, setJobFamilyFilter] = useState('');
  
  // Form states
  const [openForm, setOpenForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [currentJob, setCurrentJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_family: '',
    required_experience: '',
    required_education: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchJobFamilies = useCallback(async () => {
    try {
      const data = await jobService.getJobFamilies();
      setJobFamilies(data.results || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des familles de métiers:', error);
      showNotification('Erreur lors de la récupération des familles de métiers', 'error');
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchQuery,
        job_family: jobFamilyFilter
      };
      
      const data = await jobService.getJobs(params);
      setJobs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des métiers:', error);
      showNotification('Erreur lors de la récupération des métiers', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, jobFamilyFilter]);

  useEffect(() => {
    fetchJobFamilies();
  }, [fetchJobFamilies]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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

  const handleJobFamilyFilterChange = (event) => {
    setJobFamilyFilter(event.target.value);
    setPage(0);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      job_family: '',
      required_experience: '',
      required_education: ''
    });
    setFormErrors({});
    setCurrentJob(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormTitle('Ajouter un métier');
    setOpenForm(true);
  };

  const openEditForm = (job) => {
    setCurrentJob(job);
    setFormData({
      title: job.title || '',
      description: job.description || '',
      job_family: job.job_family?.id || '',
      required_experience: job.required_experience || '',
      required_education: job.required_education || ''
    });
    setFormTitle('Modifier le métier');
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Le titre du métier est requis';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      if (currentJob) {
        // Update existing job
        await jobService.updateJob(currentJob.id, formData);
        showNotification('Métier mis à jour avec succès');
      } else {
        // Create new job
        await jobService.createJob(formData);
        showNotification('Métier créé avec succès');
      }
      
      handleCloseForm();
      fetchJobs();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du métier:', error);
      showNotification('Erreur lors de l\'enregistrement du métier', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (job) => {
    setJobToDelete(job);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setJobToDelete(null);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    setLoading(true);
    try {
      await jobService.deleteJob(jobToDelete.id);
      showNotification('Métier supprimé avec succès');
      fetchJobs();
    } catch (error) {
      console.error('Erreur lors de la suppression du métier:', error);
      showNotification('Erreur lors de la suppression du métier', 'error');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const viewJobSkills = (jobId) => {
    navigate(`/jobs/${jobId}/skills`);
  };

  const viewJobPositions = (jobId) => {
    navigate(`/jobs/${jobId}/positions`);
  };

  const getJobFamilyName = (jobFamilyId) => {
    const jobFamily = jobFamilies.find(jf => jf.id === jobFamilyId);
    return jobFamily ? jobFamily.name : 'Non spécifié';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Métiers
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
            <InputLabel id="job-family-filter-label">Filtrer par famille</InputLabel>
            <Select
              labelId="job-family-filter-label"
              id="job-family-filter"
              value={jobFamilyFilter}
              label="Filtrer par famille"
              onChange={handleJobFamilyFilterChange}
            >
              <MenuItem value="">Toutes les familles</MenuItem>
              {jobFamilies.map((jobFamily) => (
                <MenuItem key={jobFamily.id} value={jobFamily.id}>
                  {jobFamily.name}
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
          Ajouter un métier
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Famille</TableCell>
              <TableCell>Expérience requise</TableCell>
              <TableCell>Formation requise</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun métier trouvé
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.job_family ? job.job_family.name : 'Non spécifié'}</TableCell>
                  <TableCell>{job.required_experience || 'Non spécifié'}</TableCell>
                  <TableCell>{job.required_education || 'Non spécifié'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir les compétences requises">
                      <IconButton 
                        color="primary" 
                        onClick={() => viewJobSkills(job.id)}
                      >
                        <PsychologyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Voir les postes">
                      <IconButton 
                        color="primary" 
                        onClick={() => viewJobPositions(job.id)}
                      >
                        <WorkOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton 
                        color="primary" 
                        onClick={() => openEditForm(job)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        color="error" 
                        onClick={() => openDeleteConfirmation(job)}
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
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Titre du métier"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleFormChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="job-family-label">Famille de métiers</InputLabel>
              <Select
                labelId="job-family-label"
                name="job_family"
                value={formData.job_family}
                label="Famille de métiers"
                onChange={handleFormChange}
              >
                <MenuItem value="">Non spécifié</MenuItem>
                {jobFamilies.map((jobFamily) => (
                  <MenuItem key={jobFamily.id} value={jobFamily.id}>
                    {jobFamily.name}
                  </MenuItem>
                ))}
              </Select>
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
              name="required_experience"
              label="Expérience requise"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.required_experience}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
              placeholder="Ex: 2-3 ans d'expérience"
            />
            
            <TextField
              margin="dense"
              name="required_education"
              label="Formation requise"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.required_education}
              onChange={handleFormChange}
              placeholder="Ex: Bac+5 en informatique"
            />
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
            Êtes-vous sûr de vouloir supprimer le métier "{jobToDelete?.title}" ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteJob} 
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

export default JobsPage; 