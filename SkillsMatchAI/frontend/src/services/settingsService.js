import api from './api';

/**
 * Crée une structure par défaut pour les champs personnalisés
 * @returns {Object} Structure par défaut des champs personnalisés
 */
const createDefaultCustomFields = () => {
  const fields = {};
  for (let i = 1; i <= 4; i++) {
    fields[`field${i}`] = {
      label: `Champ personnalisé ${i}`,
      visible: false
    };
  }
  return fields;
};

/**
 * Service pour gérer les paramètres de l'application
 */
const settingsService = {
  /**
   * Récupère les informations sur les champs personnalisés pour un type de modèle
   * @param {string} modelType - Type de modèle ('job', 'skill', 'position', 'employee')
   * @returns {Promise<Object>} - Informations sur les champs personnalisés
   */
  getCustomFieldsForModel: async (modelType) => {
    try {
      // Essayer d'abord d'obtenir le premier élément du type demandé
      const response = await api.get(`/${modelType}s/`);
      if (response.data.results && response.data.results.length > 0) {
        const id = response.data.results[0].id;
        const detailResponse = await api.get(`/${modelType}s/${id}/`);
        return detailResponse.data;
      }
      throw new Error(`Aucun ${modelType} trouvé`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des champs personnalisés pour ${modelType}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour les champs personnalisés pour tous les éléments d'un type de modèle
   * @param {string} modelType - Type de modèle ('job', 'skill', 'position', 'employee')
   * @param {Object} customFieldsData - Données des champs personnalisés à mettre à jour
   * @returns {Promise<Array>} - Résultats des mises à jour
   */
  updateCustomFields: async (modelType, customFieldsData) => {
    try {
      const response = await api.get(`/${modelType}s/`);
      const items = response.data.results || [];
      
      if (items.length === 0) {
        throw new Error(`Aucun ${modelType} trouvé à mettre à jour`);
      }
      
      // Mettre à jour chaque élément
      const updatePromises = items.map(item => {
        return api.patch(`/${modelType}s/${item.id}/`, customFieldsData);
      });
      
      return Promise.all(updatePromises);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des champs personnalisés pour ${modelType}:`, error);
      throw error;
    }
  },
  
  /**
   * Extrait les données de configuration des champs personnalisés d'un objet
   * @param {Object} data - Objet contenant les données des champs personnalisés
   * @returns {Object} - Structure formatée des champs personnalisés
   */
  extractCustomFieldsConfig: (data) => {
    const fields = {};
    
    if (!data) {
      console.error("Aucune donnée disponible pour extraire la configuration des champs personnalisés");
      return createDefaultCustomFields();
    }
    
    for (let i = 1; i <= 4; i++) {
      const labelKey = `custom_field${i}_label`;
      const visibleKey = `custom_field${i}_visible`;
      
      if (data.hasOwnProperty(labelKey) && data.hasOwnProperty(visibleKey)) {
        fields[`field${i}`] = {
          label: data[labelKey] || `Champ personnalisé ${i}`,
          visible: Boolean(data[visibleKey]) || false
        };
      } else {
        // Valeur par défaut si le champ n'existe pas
        fields[`field${i}`] = {
          label: `Champ personnalisé ${i}`,
          visible: false
        };
        console.warn(`Champ personnalisé ${i} non trouvé dans les données`);
      }
    }
    
    return fields;
  },
  
  /**
   * Prépare les données de mise à jour pour les champs personnalisés
   * @param {Object} customFields - Configuration des champs personnalisés
   * @returns {Object} - Données formatées pour l'API
   */
  prepareCustomFieldsUpdateData: (customFields) => {
    const updateData = {};
    
    for (let i = 1; i <= 4; i++) {
      const fieldKey = `field${i}`;
      if (customFields[fieldKey]) {
        updateData[`custom_field${i}_label`] = customFields[fieldKey].label;
        updateData[`custom_field${i}_visible`] = customFields[fieldKey].visible;
      }
    }
    
    return updateData;
  }
};

export default settingsService; 