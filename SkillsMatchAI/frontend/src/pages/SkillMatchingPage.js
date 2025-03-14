import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

/**
 * Page de matching de compétences
 * @returns {JSX.Element} - Composant de matching de compétences
 */
const SkillMatchingPage = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Matching de compétences
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Cette page est en cours de développement. Elle permettra de faire correspondre les compétences des employés avec les besoins des postes.
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default SkillMatchingPage; 