import api from './axiosConfig';

/**
 * Service pour gérer les appels API liés aux compétences
 */
const skillService = {
  /**
   * Récupère toutes les compétences
   * @param {Object} params - Paramètres de filtrage et de pagination
   * @returns {Promise<Object>} - Liste des compétences et métadonnées
   */
  getSkills: async (params = {}) => {
    try {
      const response = await api.get('/skills/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
      throw error;
    }
  },

  /**
   * Récupère une compétence par son ID
   * @param {number} id - ID de la compétence
   * @returns {Promise<Object>} - Détails de la compétence
   */
  getSkillById: async (id) => {
    try {
      const response = await api.get(`/skills/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la compétence ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle compétence
   * @param {Object} skillData - Données de la compétence
   * @returns {Promise<Object>} - Compétence créée
   */
  createSkill: async (skillData) => {
    try {
      const response = await api.post('/skills/', skillData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la compétence:', error);
      throw error;
    }
  },

  /**
   * Met à jour une compétence existante
   * @param {number} id - ID de la compétence
   * @param {Object} skillData - Nouvelles données de la compétence
   * @returns {Promise<Object>} - Compétence mise à jour
   */
  updateSkill: async (id, skillData) => {
    try {
      const response = await api.put(`/skills/${id}/`, skillData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la compétence ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une compétence
   * @param {number} id - ID de la compétence
   * @returns {Promise<void>}
   */
  deleteSkill: async (id) => {
    try {
      await api.delete(`/skills/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la compétence ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les catégories de compétences distinctes
   * @returns {Promise<Array>} - Liste des catégories
   */
  getSkillCategories: async () => {
    try {
      // Cette API n'existe pas par défaut, nous utilisons donc un workaround
      // en récupérant toutes les compétences et en extrayant les catégories uniques
      const response = await api.get('/skills/');
      
      // Vérifier si la réponse est un objet paginé ou un tableau direct
      const skills = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      
      // Filtrer les catégories null ou undefined et extraire les catégories uniques
      const categories = [...new Set(skills
        .filter(skill => skill && skill.category)
        .map(skill => skill.category))];
      
      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories de compétences:', error);
      throw error;
    }
  }
};

export default skillService; 