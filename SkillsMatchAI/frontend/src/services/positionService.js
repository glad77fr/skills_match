import api from './axiosConfig';

/**
 * Service pour gérer les appels API liés aux positions
 */
const positionService = {
  /**
   * Récupère toutes les positions
   * @param {Object} params - Paramètres de filtrage et de pagination
   * @returns {Promise<Object>} - Liste des positions et métadonnées
   */
  getPositions: async (params = {}) => {
    try {
      const response = await api.get('/positions/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des positions:', error);
      throw error;
    }
  },

  /**
   * Récupère une position par son ID
   * @param {number} id - ID de la position
   * @returns {Promise<Object>} - Détails de la position
   */
  getPositionById: async (id) => {
    try {
      const response = await api.get(`/positions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la position ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle position
   * @param {Object} positionData - Données de la position
   * @returns {Promise<Object>} - Position créée
   */
  createPosition: async (positionData) => {
    try {
      const response = await api.post('/positions/', positionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la position:', error);
      throw error;
    }
  },

  /**
   * Met à jour une position existante
   * @param {number} id - ID de la position
   * @param {Object} positionData - Nouvelles données de la position
   * @returns {Promise<Object>} - Position mise à jour
   */
  updatePosition: async (id, positionData) => {
    try {
      const response = await api.put(`/positions/${id}/`, positionData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la position ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une position
   * @param {number} id - ID de la position
   * @returns {Promise<void>}
   */
  deletePosition: async (id) => {
    try {
      await api.delete(`/positions/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la position ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les compétences requises pour une position
   * @param {number} id - ID de la position
   * @returns {Promise<Array>} - Liste des compétences requises
   */
  getPositionRequiredSkills: async (id) => {
    try {
      const response = await api.get(`/positions/${id}/required_skills/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des compétences requises pour la position ${id}:`, error);
      throw error;
    }
  },

  /**
   * Assigne un employé à une position
   * @param {number} positionId - ID de la position
   * @param {number} employeeId - ID de l'employé
   * @returns {Promise<Object>} - Position mise à jour
   */
  assignEmployee: async (positionId, employeeId) => {
    try {
      const response = await api.post(`/positions/${positionId}/assign_employee/`, {
        employee_id: employeeId
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'assignation de l'employé ${employeeId} à la position ${positionId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère toutes les compétences requises pour les positions
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Array>} - Liste des compétences requises pour les positions
   */
  getPositionSkills: async (params = {}) => {
    try {
      const response = await api.get('/position-skills/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences requises pour les positions:', error);
      throw error;
    }
  },

  /**
   * Ajoute une compétence requise à une position
   * @param {Object} positionSkillData - Données de la compétence requise
   * @returns {Promise<Object>} - Compétence requise créée
   */
  addPositionSkill: async (positionSkillData) => {
    try {
      const response = await api.post('/position-skills/', positionSkillData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la compétence requise à la position:', error);
      throw error;
    }
  },

  /**
   * Met à jour une compétence requise pour une position
   * @param {number} id - ID de la compétence requise
   * @param {Object} positionSkillData - Nouvelles données de la compétence requise
   * @returns {Promise<Object>} - Compétence requise mise à jour
   */
  updatePositionSkill: async (id, positionSkillData) => {
    try {
      const response = await api.put(`/position-skills/${id}/`, positionSkillData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la compétence requise ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une compétence requise pour une position
   * @param {number} id - ID de la compétence requise
   * @returns {Promise<void>}
   */
  deletePositionSkill: async (id) => {
    try {
      await api.delete(`/position-skills/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la compétence requise ${id}:`, error);
      throw error;
    }
  }
};

export default positionService; 