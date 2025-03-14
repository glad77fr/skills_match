import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Création du contexte d'authentification
const AuthContext = createContext(null);

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * @returns {Object} - Contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

/**
 * Fournisseur du contexte d'authentification
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Composant fournisseur
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Vérifie l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Récupère les informations de l'utilisateur
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        // En cas d'erreur, déconnecte l'utilisateur
        authService.logout();
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Connecte un utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} - Données de l'utilisateur
   */
  const login = async (username, password) => {
    try {
      setLoading(true);
      const userData = await authService.login(username, password);
      setUser(userData);
      setAuthenticated(true);
      return userData;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthenticated(false);
  };

  // Valeur du contexte
  const value = {
    user,
    loading,
    authenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 