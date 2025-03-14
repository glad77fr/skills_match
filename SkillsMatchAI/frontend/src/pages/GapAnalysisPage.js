import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

/**
 * Page d'analyse des écarts de compétences
 * @returns {JSX.Element} - Composant d'analyse des écarts
 */
const GapAnalysisPage = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Analyse des écarts
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Cette page est en cours de développement. Elle permettra d'identifier les écarts entre les compétences requises et les compétences disponibles dans l'organisation.
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default GapAnalysisPage; 