import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

/**
 * Page du tableau de bord
 * @returns {JSX.Element} - Composant de tableau de bord
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    employees: { count: 0, loading: true },
    skills: { count: 0, loading: true },
    jobs: { count: 0, loading: true },
    departments: { count: 0, loading: true }
  });
  const [recentItems, setRecentItems] = useState({
    skills: [],
    loading: true
  });
  
  // Simuler le chargement des statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Dans une application réelle, ces données viendraient de l'API
        setTimeout(() => {
          setStats({
            employees: { count: 125, loading: false },
            skills: { count: 87, loading: false },
            jobs: { count: 42, loading: false },
            departments: { count: 8, loading: false }
          });
        }, 1000);
        
        // Simuler le chargement des éléments récents
        setTimeout(() => {
          setRecentItems({
            skills: [
              { id: 1, name: 'React', category: 'Frontend' },
              { id: 2, name: 'Python', category: 'Backend' },
              { id: 3, name: 'Machine Learning', category: 'Data Science' },
              { id: 4, name: 'UX Design', category: 'Design' },
              { id: 5, name: 'Project Management', category: 'Management' }
            ],
            loading: false
          });
        }, 1500);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };
    
    fetchStats();
  }, []);
  
  // Carte de statistiques
  const StatCard = ({ title, count, icon, loading, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h4" component="div" color={color}>
              {count}
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          borderRadius: '50%',
          p: 1,
          width: 56,
          height: 56
        }}>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Bienvenue, {user?.username || 'Utilisateur'} ! Voici un aperçu de votre système de gestion des compétences.
      </Typography>
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Employés" 
            count={stats.employees.count} 
            icon={<PersonIcon fontSize="large" />} 
            loading={stats.employees.loading}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Compétences" 
            count={stats.skills.count} 
            icon={<PsychologyIcon fontSize="large" />} 
            loading={stats.skills.loading}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Emplois" 
            count={stats.jobs.count} 
            icon={<WorkIcon fontSize="large" />} 
            loading={stats.jobs.loading}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Départements" 
            count={stats.departments.count} 
            icon={<BusinessIcon fontSize="large" />} 
            loading={stats.departments.loading}
            color="warning"
          />
        </Grid>
      </Grid>
      
      {/* Contenu principal */}
      <Grid container spacing={3}>
        {/* Compétences récentes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Compétences récentes" 
              action={
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => window.location.href = '/skills'}
                >
                  Voir tout
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {recentItems.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {recentItems.skills.map((skill) => (
                    <React.Fragment key={skill.id}>
                      <ListItem>
                        <ListItemIcon>
                          <PsychologyIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={skill.name} 
                          secondary={`Catégorie: ${skill.category}`} 
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Actions rapides */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Actions rapides" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<PersonIcon />}
                    onClick={() => window.location.href = '/employees/new'}
                    sx={{ justifyContent: 'flex-start', py: 1 }}
                  >
                    Ajouter un employé
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<PsychologyIcon />}
                    onClick={() => window.location.href = '/skills/new'}
                    sx={{ justifyContent: 'flex-start', py: 1 }}
                  >
                    Ajouter une compétence
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<WorkIcon />}
                    onClick={() => window.location.href = '/jobs/new'}
                    sx={{ justifyContent: 'flex-start', py: 1 }}
                  >
                    Ajouter un emploi
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 