import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Page d'analyse des écarts de compétences
 * @returns {JSX.Element} - Composant d'analyse des écarts
 */
const GapAnalysisPage = () => {
  return (
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
  );
};

export default GapAnalysisPage; 