import React, { useState, useEffect } from 'react';
import {
  Container, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import evaluationService from '../services/evaluationService';
import employeeService from '../services/employeeService';
import skillService from '../services/skillService';
import SkillLevelIndicator from '../components/SkillLevelIndicator';
import EmployeeSkillEvaluation from '../components/EmployeeSkillEvaluation';

/**
 * Page de liste des évaluations de compétences
 * @returns {JSX.Element} Composant EvaluationList
 */
const EvaluationList = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [dialogMode, setDialogMode] = useState('new'); // 'new' ou 'edit'
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);

  // Charger les évaluations
  useEffect(() => {
    fetchEvaluations();
    fetchEmployees();
    fetchSkills();
  }, [page, rowsPerPage, searchTerm, selectedEmployee, selectedSkill]);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchTerm
      };
      
      if (selectedEmployee) {
        params.employee = selectedEmployee;
      }
      
      if (selectedSkill) {
        params.skill = selectedSkill;
      }
      
      const data = await evaluationService.getEvaluations(params);
      
      setEvaluations(Array.isArray(data.results) ? data.results : []);
      setTotalItems(data.count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      setEmployees(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const data = await skillService.getSkills();
      setSkills(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    }
  };

  // Gestionnaires de pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gestionnaires de recherche et de filtres
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleEmployeeFilterChange = (event) => {
    setSelectedEmployee(event.target.value);
    setPage(0);
  };

  const handleSkillFilterChange = (event) => {
    setSelectedSkill(event.target.value);
    setPage(0);
  };

  // Gestionnaires de dialogue
  const handleOpenDialog = (mode, evaluation = null) => {
    setDialogMode(mode);
    setSelectedEvaluation(evaluation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvaluation(null);
  };

  const handleSaveEvaluation = () => {
    setDialogOpen(false);
    fetchEvaluations();
  };

  // Gestionnaires de suppression
  const handleDeleteClick = (evaluation) => {
    setEvaluationToDelete(evaluation);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (evaluationToDelete) {
      try {
        await evaluationService.deleteEvaluation(evaluationToDelete.id);
        fetchEvaluations();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setEvaluationToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEvaluationToDelete(null);
  };

  // Obtenir le nom de l'employé et de la compétence
  const getEmployeeName = (evaluation) => {
    return evaluation.employee_name || 'Employé inconnu';
  };

  const getSkillName = (evaluation) => {
    return evaluation.skill_name || 'Compétence inconnue';
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Trouver l'objet complet
  const findEmployee = (employeeId) => {
    return employees.find(e => e.id === employeeId) || null;
  };

  const findSkill = (skillId) => {
    return skills.find(s => s.id === skillId) || null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Évaluations de compétences
      </Typography>

      {/* Section de filtres et recherche */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rechercher"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <SearchIcon color="action" />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Employé"
              variant="outlined"
              size="small"
              value={selectedEmployee}
              onChange={handleEmployeeFilterChange}
            >
              <MenuItem value="">Tous les employés</MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Compétence"
              variant="outlined"
              size="small"
              value={selectedSkill}
              onChange={handleSkillFilterChange}
            >
              <MenuItem value="">Toutes les compétences</MenuItem>
              {skills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => handleOpenDialog('new')}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des évaluations */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="evaluations table">
                <TableHead>
                  <TableRow>
                    <TableCell>Employé</TableCell>
                    <TableCell>Compétence</TableCell>
                    <TableCell>Niveau</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date d'évaluation</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evaluations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Aucune évaluation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id} hover>
                        <TableCell>{getEmployeeName(evaluation)}</TableCell>
                        <TableCell>{getSkillName(evaluation)}</TableCell>
                        <TableCell>
                          <SkillLevelIndicator level={evaluation.quantitative_level} showText />
                        </TableCell>
                        <TableCell>
                          {evaluation.qualitative_description?.length > 50
                            ? `${evaluation.qualitative_description.substring(0, 50)}...`
                            : evaluation.qualitative_description || '-'}
                        </TableCell>
                        <TableCell>{formatDate(evaluation.evaluation_date)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog('edit', evaluation)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(evaluation)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
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
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </>
        )}
      </Paper>

      {/* Dialogue d'ajout/modification d'évaluation */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'new' ? 'Nouvelle évaluation' : 'Modifier l\'évaluation'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'new' ? (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Employé"
                    value={selectedEvaluation?.employee || ''}
                    onChange={(e) => setSelectedEvaluation({
                      ...selectedEvaluation,
                      employee: e.target.value
                    })}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Compétence"
                    value={selectedEvaluation?.skill || ''}
                    onChange={(e) => setSelectedEvaluation({
                      ...selectedEvaluation,
                      skill: e.target.value
                    })}
                  >
                    {skills.map((skill) => (
                      <MenuItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              
              {selectedEvaluation?.employee && selectedEvaluation?.skill && (
                <Box sx={{ mt: 3 }}>
                  <EmployeeSkillEvaluation
                    employee={findEmployee(selectedEvaluation.employee)}
                    skill={findSkill(selectedEvaluation.skill)}
                    existingEvaluation={null}
                    onSave={handleSaveEvaluation}
                    onCancel={handleCloseDialog}
                  />
                </Box>
              )}
            </Box>
          ) : (
            selectedEvaluation && (
              <EmployeeSkillEvaluation
                employee={findEmployee(selectedEvaluation.employee)}
                skill={findSkill(selectedEvaluation.skill)}
                existingEvaluation={selectedEvaluation}
                onSave={handleSaveEvaluation}
                onCancel={handleCloseDialog}
              />
            )
          )}
        </DialogContent>
        {!((selectedEvaluation?.employee && selectedEvaluation?.skill) || dialogMode === 'edit') && (
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EvaluationList; 