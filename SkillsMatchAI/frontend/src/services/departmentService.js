import api from './axiosConfig';

/**
 * Service pour gérer les appels API liés aux départements
 */
const departmentService = {
  /**
   * Récupère tous les départements
   * @param {Object} params - Paramètres de filtrage et de pagination
   * @returns {Promise<Object>} - Liste des départements et métadonnées
   */
  getDepartments: async (params = {}) => {
    try {
      const response = await api.get('/departments/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      throw error;
    }
  },

  /**
   * Récupère un département par son ID
   * @param {number} id - ID du département
   * @returns {Promise<Object>} - Détails du département
   */
  getDepartmentById: async (id) => {
    try {
      const response = await api.get(`/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du département ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau département
   * @param {Object} departmentData - Données du département
   * @returns {Promise<Object>} - Département créé
   */
  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments/', departmentData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du département:', error);
      throw error;
    }
  },

  /**
   * Met à jour un département existant
   * @param {number} id - ID du département
   * @param {Object} departmentData - Nouvelles données du département
   * @returns {Promise<Object>} - Département mis à jour
   */
  updateDepartment: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}/`, departmentData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du département ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un département
   * @param {number} id - ID du département
   * @returns {Promise<void>}
   */
  deleteDepartment: async (id) => {
    try {
      await api.delete(`/departments/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du département ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les employés d'un département
   * @param {number} id - ID du département
   * @returns {Promise<Array>} - Liste des employés du département
   */
  getDepartmentEmployees: async (id) => {
    try {
      const response = await api.get(`/departments/${id}/employees/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des employés du département ${id}:`, error);
      throw error;
    }
  }
};

export default departmentService; 