import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

/**
 * Page de connexion de l'application
 * @returns {JSX.Element} - Composant de la page de connexion
 */
const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            SkillsMatchAI
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Connexion
          </Typography>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 