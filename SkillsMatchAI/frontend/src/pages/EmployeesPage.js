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
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  Work as WorkIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import { useNavigate } from 'react-router-dom';

/**
 * Page de gestion des employés
 * @returns {JSX.Element} - Composant de gestion des employés
 */
const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // Form states
  const [openForm, setOpenForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data.results || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      showNotification('Erreur lors de la récupération des départements', 'error');
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchQuery,
        department: departmentFilter
      };
      
      const data = await employeeService.getEmployees(params);
      setEmployees(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      showNotification('Erreur lors de la récupération des employés', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, departmentFilter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  const handleDepartmentFilterChange = (event) => {
    setDepartmentFilter(event.target.value);
    setPage(0);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hire_date: '',
      is_active: true
    });
    setFormErrors({});
    setCurrentEmployee(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormTitle('Ajouter un employé');
    setOpenForm(true);
  };

  const openEditForm = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department?.id || '',
      position: employee.position?.id || '',
      hire_date: employee.hire_date || '',
      is_active: employee.is_active !== undefined ? employee.is_active : true
    });
    setFormTitle('Modifier l\'employé');
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) {
      errors.first_name = 'Le prénom est requis';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide';
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
      if (currentEmployee) {
        // Update existing employee
        await employeeService.updateEmployee(currentEmployee.id, formData);
        showNotification('Employé mis à jour avec succès');
      } else {
        // Create new employee
        await employeeService.createEmployee(formData);
        showNotification('Employé créé avec succès');
      }
      
      handleCloseForm();
      fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'employé:', error);
      showNotification('Erreur lors de l\'enregistrement de l\'employé', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    setLoading(true);
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      showNotification('Employé supprimé avec succès');
      fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      showNotification('Erreur lors de la suppression de l\'employé', 'error');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const viewEmployeeSkills = (employeeId) => {
    navigate(`/employees/${employeeId}/skills`);
  };

  const viewEmployeePositions = (employeeId) => {
    navigate(`/employees/${employeeId}/positions`);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getFullName = (employee) => {
    return `${employee.first_name || ''} ${employee.last_name || ''}`.trim();
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Non assigné';
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
            <InputLabel id="department-filter-label">Filtrer par département</InputLabel>
            <Select
              labelId="department-filter-label"
              id="department-filter"
              value={departmentFilter}
              label="Filtrer par département"
              onChange={handleDepartmentFilterChange}
            >
              <MenuItem value="">Tous les départements</MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
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
              <TableCell>Département</TableCell>
              <TableCell>Poste</TableCell>
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
                        {getInitials(employee.first_name, employee.last_name)}
                      </Avatar>
                      <Typography variant="body2">
                        {getFullName(employee)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {employee.email || 'Non spécifié'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.phone || 'Non spécifié'}</TableCell>
                  <TableCell>{employee.department ? employee.department.name : 'Non assigné'}</TableCell>
                  <TableCell>{employee.position ? employee.position.title : 'Non assigné'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.is_active ? 'Actif' : 'Inactif'} 
                      color={employee.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir les compétences">
                      <IconButton 
                        color="primary" 
                        onClick={() => viewEmployeeSkills(employee.id)}
                      >
                        <PsychologyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Voir les postes">
                      <IconButton 
                        color="primary" 
                        onClick={() => viewEmployeePositions(employee.id)}
                      >
                        <WorkIcon />
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
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                name="first_name"
                label="Prénom"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.first_name}
                onChange={handleFormChange}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
                required
              />
              
              <TextField
                margin="dense"
                name="last_name"
                label="Nom"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.last_name}
                onChange={handleFormChange}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
                required
              />
            </Box>
            
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleFormChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="phone"
              label="Téléphone"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.phone}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="department-label">Département</InputLabel>
              <Select
                labelId="department-label"
                name="department"
                value={formData.department}
                label="Département"
                onChange={handleFormChange}
              >
                <MenuItem value="">Non assigné</MenuItem>
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="dense"
              name="hire_date"
              label="Date d'embauche"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.hire_date}
              onChange={handleFormChange}
              InputLabelProps={{
                shrink: true,
              }}
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
            Êtes-vous sûr de vouloir supprimer l'employé "{employeeToDelete ? getFullName(employeeToDelete) : ''}" ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteEmployee} 
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

export default EmployeesPage; 