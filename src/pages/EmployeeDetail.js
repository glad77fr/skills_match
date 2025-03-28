import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid
} from '@mui/material';
import { useParams } from 'react-router-dom';
import employeeService from '../services/employeeService';
import evaluationService from '../services/evaluationService';
import EmployeeSkillEvaluation from '../components/EmployeeSkillEvaluation';
import SkillLevelIndicator from '../components/SkillLevelIndicator';
import EmployeeSkillSelector from '../components/EmployeeSkillSelector';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  const [showSkillSelector, setShowSkillSelector] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError('Une erreur est survenue lors du chargement des données de l\'employé.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    if (employee?.id) {
      fetchEmployeeEvaluations();
    }
  }, [employee]);

  const fetchEmployeeEvaluations = async () => {
    if (!employee?.id) return;
    
    setLoadingEvaluations(true);
    try {
      const data = await evaluationService.getEvaluationsByEmployee(employee.id);
      setEvaluations(data);
    } catch (err) {
      console.error('Error fetching employee evaluations:', err);
    } finally {
      setLoadingEvaluations(false);
    }
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setShowEvaluationForm(true);
  };

  const handleSaveEvaluation = () => {
    setShowEvaluationForm(false);
    setSelectedSkill(null);
    fetchEmployeeEvaluations();
  };

  const handleCancelEvaluation = () => {
    setShowEvaluationForm(false);
    setSelectedSkill(null);
  };

  const getExistingEvaluation = (skillId) => {
    return evaluations.find(evaluation => evaluation.skill === skillId);
  };

  const getExistingEvaluationSkillIds = () => {
    return evaluations.map(evaluation => evaluation.skill);
  };
  
  const handleOpenSkillSelector = () => {
    setShowSkillSelector(true);
  };
  
  const handleCloseSkillSelector = () => {
    setShowSkillSelector(false);
  };
  
  const handleSkillSelected = (skill) => {
    setSelectedSkill(skill);
    setShowEvaluationForm(true);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      {/* Section d'informations sur l'employé */}
      <Paper sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          {employee?.first_name} {employee?.last_name}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Informations personnelles</Typography>
            <Typography variant="body2">Email: {employee?.email}</Typography>
            <Typography variant="body2">Téléphone: {employee?.phone || 'Non renseigné'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Informations professionnelles</Typography>
            <Typography variant="body2">Poste: {employee?.job_title || 'Non renseigné'}</Typography>
            <Typography variant="body2">Service: {employee?.department?.name || 'Non renseigné'}</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Section Compétences */}
      <Paper sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>Compétences</Typography>
        
        {loadingEvaluations ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {evaluations.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Compétence</TableCell>
                      <TableCell>Niveau</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{evaluation.skill_name}</TableCell>
                        <TableCell>
                          <SkillLevelIndicator level={evaluation.quantitative_level} showText />
                        </TableCell>
                        <TableCell>{evaluation.qualitative_description}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => {
                              const skill = { id: evaluation.skill, name: evaluation.skill_name };
                              setSelectedSkill(skill);
                              setShowEvaluationForm(true);
                            }}
                          >
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" sx={{ py: 2 }}>
                Aucune compétence évaluée pour cet employé.
              </Typography>
            )}
          </>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenSkillSelector}
          >
            Ajouter une compétence
          </Button>
        </Box>
        
        {/* Dialog for skill evaluation */}
        <Dialog open={showEvaluationForm} onClose={handleCancelEvaluation} maxWidth="md">
          <DialogTitle>
            {getExistingEvaluation(selectedSkill?.id) ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}
          </DialogTitle>
          <DialogContent>
            {selectedSkill && (
              <EmployeeSkillEvaluation 
                employee={employee}
                skill={selectedSkill}
                existingEvaluation={getExistingEvaluation(selectedSkill.id)}
                onSave={handleSaveEvaluation}
                onCancel={handleCancelEvaluation}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Skill selector dialog */}
        <EmployeeSkillSelector
          open={showSkillSelector}
          onClose={handleCloseSkillSelector}
          onSelect={handleSkillSelected}
          excludeSkills={getExistingEvaluationSkillIds()}
        />
      </Paper>
    </Container>
  );
};

export default EmployeeDetail; 