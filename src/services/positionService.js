import api from './api';

// Récupérer la liste des positions avec pagination
export const getPositions = (page = 1) => {
  return api.get(`positions/?page=${page}`);
};

// Récupérer une position par son ID
export const getPosition = (id) => {
  return api.get(`positions/${id}/`);
};

// Créer une nouvelle position
export const createPosition = (positionData) => {
  return api.post('positions/', positionData);
};

// Mettre à jour une position
export const updatePosition = (id, positionData) => {
  return api.put(`positions/${id}/`, positionData);
};

// Supprimer une position
export const deletePosition = (id) => {
  return api.delete(`positions/${id}/`);
};

// Récupérer les compétences requises pour une position
export const getPositionSkills = (id) => {
  return api.get(`positions/${id}/required_skills/`);
};

// Assigner un employé à une position
export const assignEmployee = (positionId, employeeId) => {
  return api.post(`positions/${positionId}/assign_employee/`, { employee_id: employeeId });
}; 