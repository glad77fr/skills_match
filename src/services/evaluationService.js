import api from './api';

const evaluationService = {
  getEvaluations: async (params = {}) => {
    try {
      const response = await api.get('/evaluations/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations:', error);
      throw error;
    }
  },
  
  getEvaluationById: async (id) => {
    try {
      const response = await api.get(`/evaluations/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'évaluation ${id}:`, error);
      throw error;
    }
  },
  
  getEvaluationsByEmployee: async (employeeId) => {
    try {
      const response = await api.get('/evaluations/by_employee/', { params: { employee_id: employeeId } });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des évaluations de l'employé ${employeeId}:`, error);
      throw error;
    }
  },
  
  getEvaluationsBySkill: async (skillId) => {
    try {
      const response = await api.get('/evaluations/by_skill/', { params: { skill_id: skillId } });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des évaluations pour la compétence ${skillId}:`, error);
      throw error;
    }
  },
  
  createEvaluation: async (evaluationData) => {
    try {
      const response = await api.post('/evaluations/', evaluationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      throw error;
    }
  },
  
  updateEvaluation: async (id, evaluationData) => {
    try {
      const response = await api.put(`/evaluations/${id}/`, evaluationData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'évaluation ${id}:`, error);
      throw error;
    }
  },
  
  deleteEvaluation: async (id) => {
    try {
      await api.delete(`/evaluations/${id}/`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'évaluation ${id}:`, error);
      throw error;
    }
  }
};

export default evaluationService; 