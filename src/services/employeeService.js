import api from './api';

const employeeService = {
  // Récupérer la liste des employés avec pagination
  getEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      throw error;
    }
  },

  // Récupérer un employé par son ID
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouvel employé
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees/', employeeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      throw error;
    }
  },

  // Mettre à jour un employé
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}/`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'employé ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un employé
  deleteEmployee: async (id) => {
    try {
      await api.delete(`/employees/${id}/`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'employé ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les compétences d'un employé
  getEmployeeSkills: async (id) => {
    try {
      const response = await api.get(`/employees/${id}/skills/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des compétences de l'employé ${id}:`, error);
      throw error;
    }
  },

  // Filtrer les employés par compétence
  getEmployeesBySkill: async (skillId) => {
    try {
      const response = await api.get('/employees/by_skill/', { params: { skill_id: skillId } });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des employés pour la compétence ${skillId}:`, error);
      throw error;
    }
  }
};

export default employeeService; 