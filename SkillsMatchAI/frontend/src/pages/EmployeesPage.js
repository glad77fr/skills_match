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
  Tooltip,
  Avatar,
  Grid,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import employeeService from '../services/employeeService';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'ON_LEAVE', label: 'En congé' },
  { value: 'SUSPENDED', label: 'Suspendu' },
  { value: 'TERMINATED', label: 'Terminé' }
];

/**
 * Page de gestion des employés
 * @returns {JSX.Element} - Composant de gestion des employés
 */
const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la pagination et le tri
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // États pour le formulaire
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    hire_date: '',
    date_of_birth: '',
    employment_status: 'ACTIVE',
  });
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // États pour la confirmation de suppression
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // État pour les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fonction pour récupérer les employés avec filtres
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: searchTerm,
        status: statusFilter
      };
      
      const data = await employeeService.getEmployees(params);
      setEmployees(data.results || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des employés:', err);
      setError('Impossible de charger les employés. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Charger les employés au chargement de la page et lorsque les filtres changent
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const openAddForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      hire_date: '',
      date_of_birth: '',
      employment_status: 'ACTIVE',
    });
    setCurrentEmployee(null);
    setOpenForm(true);
  };

  const openEditForm = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      phone_number: employee.phone_number || '',
      hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : '',
      date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
      employment_status: employee.employment_status || 'ACTIVE',
    });
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (currentEmployee) {
        // Update existing employee
        await employeeService.updateEmployee(currentEmployee.id, formData);
        setNotification({
          open: true,
          message: 'Employé mis à jour avec succès',
          severity: 'success'
        });
      } else {
        // Create new employee
        await employeeService.createEmployee(formData);
        setNotification({
          open: true,
          message: 'Employé créé avec succès',
          severity: 'success'
        });
      }
      
      closeForm();
      fetchEmployees();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'employé:', err);
      setNotification({
        open: true,
        message: 'Erreur lors de la sauvegarde. Veuillez réessayer.',
        severity: 'error'
      });
    }
  };

  const openDeleteConfirmation = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      setNotification({
        open: true,
        message: 'Employé supprimé avec succès',
        severity: 'success'
      });
      closeDeleteDialog();
      fetchEmployees();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'employé:', err);
      setNotification({
        open: true,
        message: 'Erreur lors de la suppression. Veuillez réessayer.',
        severity: 'error'
      });
    }
  };

  const viewEmployeeDetails = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  const closeNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  const getStatusChip = (status) => {
    let color = 'default';
    switch (status) {
      case 'ACTIVE':
        color = 'success';
        break;
      case 'ON_LEAVE':
        color = 'warning';
        break;
      case 'SUSPENDED':
        color = 'error';
        break;
      case 'TERMINATED':
        color = 'default';
        break;
      default:
        color = 'default';
    }
    
    const statusLabel = statusOptions.find(opt => opt.value === status)?.label || status;
    
    return (
      <Chip label={statusLabel} color={color} size="small" />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Employés
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchTerm}
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
            <InputLabel id="status-filter-label">Filtrer par statut</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Filtrer par statut"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
          Ajouter un employé
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employé</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun employé trouvé
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                        {`${employee.first_name?.charAt(0) || ''} ${employee.last_name?.charAt(0) || ''}`.toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">
                        {`${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {employee.email || 'Non spécifié'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.phone_number || 'Non spécifié'}</TableCell>
                  <TableCell>
                    {getStatusChip(employee.employment_status)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Voir les détails">
                        <IconButton 
                          color="primary" 
                          onClick={() => viewEmployeeDetails(employee.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          color="primary" 
                          onClick={() => openEditForm(employee)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          color="error" 
                          onClick={() => openDeleteConfirmation(employee)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </TableContainer>
      
      {/* Form Dialog */}
      <Dialog open={openForm} onClose={closeForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentEmployee ? `Modifier l'employé: ${currentEmployee.first_name} ${currentEmployee.last_name}` : 'Ajouter un nouvel employé'}
        </DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Prénom"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nom"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Date d'embauche"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Date de naissance"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="status-label">Statut d'emploi</InputLabel>
                  <Select
                    labelId="status-label"
                    name="employment_status"
                    value={formData.employment_status}
                    label="Statut d'emploi"
                    onChange={handleFormChange}
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeForm}>Annuler</Button>
            <Button type="submit" variant="contained">Enregistrer</Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'employé "{employeeToDelete?.first_name} {employeeToDelete?.last_name}" ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Annuler</Button>
          <Button 
            onClick={handleDeleteEmployee} 
            color="error" 
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
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

export default EmployeesPage; 