import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';

/**
 * Page de liste des emplois (métiers)
 * @returns {JSX.Element} - Composant page des emplois
 */
const JobList = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Simulation de chargement des données
    const timer = setTimeout(() => {
      setLoading(false);
      // Simuler des données d'emplois
      setJobs([
        { id: 1, title: 'Développeur Frontend', level: 'Senior' },
        { id: 2, title: 'Développeur Backend', level: 'Senior' },
        { id: 3, title: 'Chef de Projet', level: 'Confirmé' },
        { id: 4, title: 'Designer UX/UI', level: 'Junior' }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
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
        Métiers
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {jobs.map(job => (
          <Box key={job.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2" color="text.secondary">Niveau: {job.level}</Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default JobList; 