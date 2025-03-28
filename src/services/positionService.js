import api from './api';

const positionService = {
  // Récupérer la liste des positions avec pagination
  getPositions: async (params = {}) => {
    try {
      const response = await api.get('/positions/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des positions:', error);
      throw error;
    }
  },

  // Récupérer une position par son ID
  getPositionById: async (id) => {
    try {
      const response = await api.get(`/positions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la position ${id}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle position
  createPosition: async (positionData) => {
    try {
      const response = await api.post('/positions/', positionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la position:', error);
      throw error;
    }
  },

  // Mettre à jour une position
  updatePosition: async (id, positionData) => {
    try {
      const response = await api.put(`/positions/${id}/`, positionData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la position ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une position
  deletePosition: async (id) => {
    try {
      await api.delete(`/positions/${id}/`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la position ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les compétences requises pour une position
  getPositionSkills: async (id) => {
    try {
      const response = await api.get(`/positions/${id}/required_skills/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des compétences requises pour la position ${id}:`, error);
      throw error;
    }
  },

  // Assigner un employé à une position
  assignEmployee: async (positionId, employeeId) => {
    try {
      const response = await api.post(`/positions/${positionId}/assign_employee/`, { employee_id: employeeId });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'assignation de l'employé ${employeeId} à la position ${positionId}:`, error);
      throw error;
    }
  }
};

export default positionService; 