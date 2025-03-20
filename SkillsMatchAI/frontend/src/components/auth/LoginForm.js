import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * Formulaire de connexion
 * @returns {JSX.Element} - Composant de formulaire de connexion
 */
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, authenticated } = useAuth();
  
  // Redirige vers le tableau de bord si déjà authentifié
  React.useEffect(() => {
    if (authenticated) {
      console.log('Utilisateur déjà authentifié, redirection vers /dashboard');
      navigate('/dashboard');
    }
  }, [authenticated, navigate]);
  
  /**
   * Gère la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation des champs
    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      console.log('Tentative de connexion avec:', username);
      setLoading(true);
      const result = await login(username, password);
      console.log('Connexion réussie, résultat:', result);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion détaillée:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          SkillsMatchAI
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center">
          Connexion
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nom d'utilisateur"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Se connecter'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm; 