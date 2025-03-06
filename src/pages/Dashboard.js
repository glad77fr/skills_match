import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { getEmployees } from '../services/employeeService';
import { getPositions } from '../services/positionService';
import { getSkills } from '../services/skillService';
import api from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    employees: 0,
    positions: 0,
    departments: 0,
    skills: 0
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [vacantPositions, setVacantPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données de base
        const [employeesRes, positionsRes, skillsRes, departmentsRes] = await Promise.all([
          getEmployees(),
          getPositions(),
          getSkills(),
          api.get('departments/')
        ]);
        
        // Mettre à jour les statistiques
        setStats({
          employees: employeesRes.data.count || 0,
          positions: positionsRes.data.count || 0,
          departments: departmentsRes.data.count || 0,
          skills: skillsRes.data.count || 0
        });
        
        // Récupérer les employés récents
        setRecentEmployees(employeesRes.data.results.slice(0, 5));
        
        // Récupérer les positions vacantes
        const vacant = positionsRes.data.results.filter(pos => pos.status === 'VACANT');
        setVacantPositions(vacant.slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  {stats.employees}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Employés
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/employees">Voir tous</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  {stats.positions}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Positions
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/positions">Voir toutes</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  {stats.departments}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Départements
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/departments">Voir tous</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PsychologyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  {stats.skills}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Compétences
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/skills">Voir toutes</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {/* Listes d'informations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Employés récents
            </Typography>
            <List>
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee, index) => (
                  <React.Fragment key={employee.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${employee.first_name} ${employee.last_name}`}
                        secondary={employee.department_name || 'Aucun département'}
                      />
                      <Button 
                        size="small" 
                        variant="outlined" 
                        component={RouterLink} 
                        to={`/employees/${employee.id}`}
                      >
                        Détails
                      </Button>
                    </ListItem>
                    {index < recentEmployees.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Aucun employé trouvé" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Positions vacantes
            </Typography>
            <List>
              {vacantPositions.length > 0 ? (
                vacantPositions.map((position, index) => (
                  <React.Fragment key={position.id}>
                    <ListItem>
                      <ListItemText
                        primary={position.job_title}
                        secondary={`${position.location} - Niveau ${position.job_level}`}
                      />
                      <Button 
                        size="small" 
                        variant="outlined" 
                        component={RouterLink} 
                        to={`/positions/${position.id}`}
                      >
                        Détails
                      </Button>
                    </ListItem>
                    {index < vacantPositions.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Aucune position vacante trouvée" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 