import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Page d'analyse des compétences
 * @returns {JSX.Element} - Composant d'analyse des compétences
 */
const SkillAnalyticsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analyse des compétences
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Cette page est en cours de développement. Elle permettra d'analyser les tendances et la distribution des compétences dans l'organisation.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SkillAnalyticsPage; 