import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, login, logout, refreshToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        setUser(decoded);
      } else {
        // Essayer de rafraîchir le token
        const result = await refreshToken();
        if (result.success) {
          const token = localStorage.getItem('token');
          const decoded = jwtDecode(token);
          setUser(decoded);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const handleLogin = async (username, password) => {
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    setUser(null);
    return { success: true };
  };

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login: handleLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 