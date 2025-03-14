import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Composant de route protégée qui vérifie si l'utilisateur est authentifié
 * @param {Object} props - Propriétés du composant
 * @param {JSX.Element} props.children - Composant enfant à rendre si l'utilisateur est authentifié
 * @returns {JSX.Element} - Composant enfant ou redirection vers la page de connexion
 */
const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Rendre le composant enfant si l'utilisateur est authentifié
  return children;
};

export default ProtectedRoute; 