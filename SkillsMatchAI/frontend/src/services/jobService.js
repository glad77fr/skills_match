import api from './axiosConfig';

/**
 * Service pour gérer les appels API liés aux emplois
 */
const jobService = {
  /**
   * Récupère tous les emplois
   * @param {Object} params - Paramètres de filtrage et de pagination
   * @returns {Promise<Object>} - Liste des emplois et métadonnées
   */
  getJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois:', error);
      throw error;
    }
  },

  /**
   * Récupère un emploi par son ID
   * @param {number} id - ID de l'emploi
   * @returns {Promise<Object>} - Détails de l'emploi
   */
  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'emploi ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouvel emploi
   * @param {Object} jobData - Données de l'emploi
   * @returns {Promise<Object>} - Emploi créé
   */
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs/', jobData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'emploi:', error);
      throw error;
    }
  },

  /**
   * Met à jour un emploi existant
   * @param {number} id - ID de l'emploi
   * @param {Object} jobData - Nouvelles données de l'emploi
   * @returns {Promise<Object>} - Emploi mis à jour
   */
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}/`, jobData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'emploi ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un emploi
   * @param {number} id - ID de l'emploi
   * @returns {Promise<void>}
   */
  deleteJob: async (id) => {
    try {
      await api.delete(`/jobs/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'emploi ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les positions associées à un emploi
   * @param {number} id - ID de l'emploi
   * @returns {Promise<Array>} - Liste des positions
   */
  getJobPositions: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}/positions/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des positions pour l'emploi ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les compétences requises pour un emploi
   * @param {number} id - ID de l'emploi
   * @returns {Promise<Array>} - Liste des compétences requises
   */
  getJobRequiredSkills: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}/required_skills/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des compétences requises pour l'emploi ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère toutes les familles d'emplois
   * @returns {Promise<Array>} - Liste des familles d'emplois
   */
  getJobFamilies: async () => {
    try {
      const response = await api.get('/job-families/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des familles d\'emplois:', error);
      throw error;
    }
  }
};

export default jobService; 