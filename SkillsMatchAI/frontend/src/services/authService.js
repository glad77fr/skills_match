import api from './axiosConfig';

const API_URL = 'http://localhost:8001/api';

/**
 * Service d'authentification pour gérer les appels API liés à l'authentification
 */
const authService = {
  /**
   * Connecte un utilisateur avec ses identifiants
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} - Données de l'utilisateur et token JWT
   */
  login: async (username, password) => {
    try {
      // Utilise axios directement pour éviter d'ajouter le token d'autorisation
      const response = await api.post('/token/', {
        username,
        password,
      });
      
      if (response.data.access) {
        // Stocke le token JWT dans le localStorage
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        
        // Récupère les informations de l'utilisateur
        try {
          const userData = await authService.getCurrentUser();
          return userData;
        } catch (userError) {
          console.error('Erreur lors de la récupération des données utilisateur après connexion:', userError);
          // Même si on ne peut pas récupérer les données utilisateur, on considère que l'authentification a réussi
          // car nous avons un token valide
          return { username: username };
        }
      }
      
      throw new Error('Échec de la connexion: Aucun token reçu');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      if (error.response) {
        // Erreur avec réponse du serveur
        const errorMessage = error.response.data.detail || 
                            error.response.data.message || 
                            `Erreur ${error.response.status}: ${error.response.statusText}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Erreur sans réponse du serveur
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },
  
  /**
   * Déconnecte l'utilisateur en supprimant les tokens du localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  /**
   * Récupère les informations de l'utilisateur actuellement connecté
   * @returns {Promise<Object>} - Données de l'utilisateur
   */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Aucun token trouvé');
      }
      
      // Utilise l'instance API configurée avec l'intercepteur
      const response = await api.get('/users/me/');
      
      if (!response.data) {
        throw new Error('Réponse vide du serveur');
      }
      
      // Stocke les informations de l'utilisateur dans le localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      
      // Si l'erreur est liée à l'authentification, déconnecte l'utilisateur
      if (error.response && error.response.status === 401) {
        authService.logout();
      }
      
      throw error;
    }
  },
  
  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} - True si l'utilisateur est authentifié, false sinon
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  /**
   * Rafraîchit le token JWT
   * @returns {Promise<string>} - Nouveau token JWT
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('Aucun token de rafraîchissement trouvé');
      }
      
      // Utilise axios directement pour éviter d'ajouter le token d'autorisation
      const response = await api.post('/token/refresh/', {
        refresh: refreshToken,
      });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        return response.data.access;
      }
      
      throw new Error('Échec du rafraîchissement du token: Aucun token reçu');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      
      // Déconnecte l'utilisateur en cas d'erreur
      authService.logout();
      
      if (error.response) {
        throw new Error(`Échec du rafraîchissement du token: ${error.response.data.detail || error.response.statusText}`);
      }
      
      throw error;
    }
  },
};

export default authService; 