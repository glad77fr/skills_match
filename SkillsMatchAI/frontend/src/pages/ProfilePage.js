import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';

/**
 * Page de profil utilisateur
 * @returns {JSX.Element} - Composant de profil utilisateur
 */
const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Profil utilisateur
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="h5">{user?.username || 'Utilisateur'}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Informations personnelles</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                Cette page est en cours de développement. Elle permettra de consulter et modifier les informations du profil utilisateur.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage; 