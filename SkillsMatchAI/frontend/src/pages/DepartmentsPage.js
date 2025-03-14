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
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import departmentService from '../services/departmentService';
import { useNavigate } from 'react-router-dom';

/**
 * Page de gestion des départements
 * @returns {JSX.Element} - Composant de gestion des départements
 */
const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [openForm, setOpenForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager_name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchQuery
      };
      
      const data = await departmentService.getDepartments(params);
      setDepartments(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      showNotification('Erreur lors de la récupération des départements', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      manager_name: ''
    });
    setFormErrors({});
    setCurrentDepartment(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormTitle('Ajouter un département');
    setOpenForm(true);
  };

  const openEditForm = (department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name || '',
      description: department.description || '',
      manager_name: department.manager_name || ''
    });
    setFormTitle('Modifier le département');
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Le nom du département est requis';
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
      if (currentDepartment) {
        // Update existing department
        await departmentService.updateDepartment(currentDepartment.id, formData);
        showNotification('Département mis à jour avec succès');
      } else {
        // Create new department
        await departmentService.createDepartment(formData);
        showNotification('Département créé avec succès');
      }
      
      handleCloseForm();
      fetchDepartments();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du département:', error);
      showNotification('Erreur lors de l\'enregistrement du département', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (department) => {
    setDepartmentToDelete(department);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDepartmentToDelete(null);
  };

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;
    
    setLoading(true);
    try {
      await departmentService.deleteDepartment(departmentToDelete.id);
      showNotification('Département supprimé avec succès');
      fetchDepartments();
    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      showNotification('Erreur lors de la suppression du département', 'error');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const viewDepartmentEmployees = (departmentId) => {
    navigate(`/departments/${departmentId}/employees`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Départements
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Rechercher"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddForm}
        >
          Ajouter un département
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Aucun département trouvé
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>{department.manager_name}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => viewDepartmentEmployees(department.id)}
                      title="Voir les employés"
                    >
                      <PeopleIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      onClick={() => openEditForm(department)}
                      title="Modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteConfirmation(department)}
                      title="Supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
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
              name="name"
              label="Nom du département"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              sx={{ mb: 2 }}
            />
            
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
              name="manager_name"
              label="Nom du responsable"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.manager_name}
              onChange={handleFormChange}
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
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le département "{departmentToDelete?.name}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteDepartment} 
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

export default DepartmentsPage; 