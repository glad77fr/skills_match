import api from './axiosConfig';

/**
 * Service pour gérer les appels API liés aux employés
 */
const employeeService = {
  /**
   * Récupère tous les employés
   * @param {Object} params - Paramètres de filtrage et de pagination
   * @returns {Promise<Object>} - Liste des employés et métadonnées
   */
  getEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      throw error;
    }
  },

  /**
   * Récupère un employé par son ID
   * @param {number} id - ID de l'employé
   * @returns {Promise<Object>} - Détails de l'employé
   */
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouvel employé
   * @param {Object} employeeData - Données de l'employé
   * @returns {Promise<Object>} - Employé créé
   */
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees/', employeeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      throw error;
    }
  },

  /**
   * Met à jour un employé existant
   * @param {number} id - ID de l'employé
   * @param {Object} employeeData - Nouvelles données de l'employé
   * @returns {Promise<Object>} - Employé mis à jour
   */
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}/`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'employé ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un employé
   * @param {number} id - ID de l'employé
   * @returns {Promise<void>}
   */
  deleteEmployee: async (id) => {
    try {
      await api.delete(`/employees/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'employé ${id}:`, error);
      throw error;
    }
  },

  /**
   * Filtre les employés par compétence
   * @param {number} skillId - ID de la compétence
   * @param {Object} params - Paramètres additionnels
   * @returns {Promise<Array>} - Liste des employés filtrés
   */
  filterEmployeesBySkill: async (skillId, params = {}) => {
    try {
      const queryParams = { ...params, skill_id: skillId };
      const response = await api.get('/employees/filter_by_skill/', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du filtrage des employés par compétence ${skillId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les compétences d'un employé
   * @param {number} id - ID de l'employé
   * @returns {Promise<Array>} - Liste des compétences de l'employé
   */
  getEmployeeSkills: async (id) => {
    try {
      const response = await api.get(`/employees/${id}/skills/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des compétences de l'employé ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère toutes les compétences des employés
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Array>} - Liste des compétences des employés
   */
  getAllEmployeeSkills: async (params = {}) => {
    try {
      const response = await api.get('/employee-skills/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences des employés:', error);
      throw error;
    }
  },

  /**
   * Ajoute une compétence à un employé
   * @param {Object} employeeSkillData - Données de la compétence de l'employé
   * @returns {Promise<Object>} - Compétence de l'employé créée
   */
  addEmployeeSkill: async (employeeSkillData) => {
    try {
      const response = await api.post('/employee-skills/', employeeSkillData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la compétence à l\'employé:', error);
      throw error;
    }
  },

  /**
   * Met à jour une compétence d'un employé
   * @param {number} id - ID de la compétence de l'employé
   * @param {Object} employeeSkillData - Nouvelles données de la compétence
   * @returns {Promise<Object>} - Compétence de l'employé mise à jour
   */
  updateEmployeeSkill: async (id, employeeSkillData) => {
    try {
      const response = await api.put(`/employee-skills/${id}/`, employeeSkillData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la compétence ${id} de l'employé:`, error);
      throw error;
    }
  },

  /**
   * Supprime une compétence d'un employé
   * @param {number} id - ID de la compétence de l'employé
   * @returns {Promise<void>}
   */
  deleteEmployeeSkill: async (id) => {
    try {
      await api.delete(`/employee-skills/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la compétence ${id} de l'employé:`, error);
      throw error;
    }
  },

  /**
   * Évalue l'adéquation d'un employé pour une position
   * @param {number} employeeId - ID de l'employé
   * @param {number} positionId - ID de la position
   * @returns {Promise<Object>} - Résultat de l'évaluation
   */
  evaluateEmployeeForPosition: async (employeeId, positionId) => {
    try {
      const response = await api.get(`/employees/${employeeId}/evaluate_for_position/${positionId}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'évaluation de l'employé ${employeeId} pour la position ${positionId}:`, error);
      throw error;
    }
  }
};

export default employeeService; 