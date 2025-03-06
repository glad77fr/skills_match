import api from './api';

// Récupérer la liste des compétences avec pagination
export const getSkills = (page = 1) => {
  return api.get(`skills/?page=${page}`);
};

// Récupérer une compétence par son ID
export const getSkill = (id) => {
  return api.get(`skills/${id}/`);
};

// Créer une nouvelle compétence
export const createSkill = (skillData) => {
  return api.post('skills/', skillData);
};

// Mettre à jour une compétence
export const updateSkill = (id, skillData) => {
  return api.put(`skills/${id}/`, skillData);
};

// Supprimer une compétence
export const deleteSkill = (id) => {
  return api.delete(`skills/${id}/`);
};

// Filtrer les compétences par catégorie
export const getSkillsByCategory = (category) => {
  return api.get(`skills/?category=${category}`);
}; 