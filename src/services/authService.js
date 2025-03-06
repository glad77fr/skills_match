import api from './api';
import { jwtDecode } from 'jwt-decode';

// Fonction pour se connecter
export const login = async (username, password) => {
  try {
    const response = await api.post('token/', { username, password });
    const { access, refresh } = response.data;
    
    // Stocker les tokens dans le localStorage
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    
    return {
      success: true,
      user: jwtDecode(access)
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Erreur de connexion'
    };
  }
};

// Fonction pour se déconnecter
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  return { success: true };
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Vérifier si le token n'est pas expiré
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Fonction pour rafraîchir le token
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) return { success: false };
  
  try {
    const response = await api.post('token/refresh/', { refresh });
    const { access } = response.data;
    
    localStorage.setItem('token', access);
    return { success: true };
  } catch (error) {
    logout();
    return { success: false };
  }
}; 