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
import PsychologyIcon from '@mui/icons-material/Psychology';
import employeeService from '../services/employeeService';
import positionService from '../services/positionService';
import skillService from '../services/skillService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    employees: 0,
    positions: 0,
    skills: 0
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [vacantPositions, setVacantPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données de base
        const [employeesRes, positionsRes, skillsRes] = await Promise.all([
          employeeService.getEmployees(),
          positionService.getPositions(),
          skillService.getSkills()
        ]);
        
        // Mettre à jour les statistiques
        setStats({
          employees: employeesRes.count || 0,
          positions: positionsRes.count || 0,
          skills: skillsRes.count || 0
        });
        
        // Récupérer les employés récents
        setRecentEmployees(employeesRes.results.slice(0, 5));
        
        // Récupérer les positions vacantes
        const vacant = positionsRes.results.filter(pos => pos.status === 'VACANT');
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
        <Grid item xs={12} sm={6} md={4}>
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
        
        <Grid item xs={12} sm={6} md={4}>
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
        
        <Grid item xs={12} sm={6} md={4}>
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
                        secondary={employee.email || 'Aucun email'}
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