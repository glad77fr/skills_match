import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8001/api';

/**
 * Instance Axios configurée pour l'API
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ajouter des options pour CORS
  withCredentials: false,
  timeout: 10000, // Timeout de 10 secondes
});

/**
 * Intercepteur de requêtes pour ajouter le token JWT aux en-têtes
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur lors de la préparation de la requête:', error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses pour gérer les erreurs d'authentification
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (Non autorisé) et que la requête n'a pas déjà été retentée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tente de rafraîchir le token
        const newToken = await authService.refreshToken();
        
        // Met à jour l'en-tête d'autorisation avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retente la requête originale avec le nouveau token
        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecte l'utilisateur
        console.error('Échec du rafraîchissement du token:', refreshError);
        authService.logout();
        
        // Redirige vers la page de connexion
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    // Améliorer les messages d'erreur
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      console.error('Erreur de réponse du serveur:', error.response.status, error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue du serveur:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration de la requête:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 