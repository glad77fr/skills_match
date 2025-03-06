import api from './api';

// Récupérer la liste des employés avec pagination
export const getEmployees = (page = 1) => {
  return api.get(`employees/?page=${page}`);
};

// Récupérer un employé par son ID
export const getEmployee = (id) => {
  return api.get(`employees/${id}/`);
};

// Créer un nouvel employé
export const createEmployee = (employeeData) => {
  return api.post('employees/', employeeData);
};

// Mettre à jour un employé
export const updateEmployee = (id, employeeData) => {
  return api.put(`employees/${id}/`, employeeData);
};

// Supprimer un employé
export const deleteEmployee = (id) => {
  return api.delete(`employees/${id}/`);
};

// Récupérer les compétences d'un employé
export const getEmployeeSkills = (id) => {
  return api.get(`employees/${id}/skills/`);
};

// Filtrer les employés par compétence
export const getEmployeesBySkill = (skillId) => {
  return api.get(`employees/by_skill/?skill_id=${skillId}`);
}; 