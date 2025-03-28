import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Grid,
  CircularProgress
} from '@mui/material';
import evaluationService from '../services/evaluationService';

/**
 * Composant pour évaluer ou modifier l'évaluation d'une compétence pour un employé
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.employee - Objet employé à évaluer
 * @param {Object} props.skill - Objet compétence à évaluer
 * @param {Object} props.existingEvaluation - Évaluation existante (optionnel)
 * @param {Function} props.onSave - Fonction appelée après la sauvegarde
 * @param {Function} props.onCancel - Fonction appelée pour annuler l'évaluation
 * @returns {JSX.Element} - Composant d'évaluation
 */
const EmployeeSkillEvaluation = ({ employee, skill, existingEvaluation = null, onSave, onCancel }) => {
  const [evaluation, setEvaluation] = useState({
    employee: employee?.id,
    skill: skill?.id,
    quantitative_level: existingEvaluation?.quantitative_level || 1,
    qualitative_description: existingEvaluation?.qualitative_description || '',
    evaluated_by: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const levelDescriptions = {
    1: 'Débutant - Connaissances de base',
    2: 'Intermédiaire - Peut réaliser des tâches avec assistance',
    3: 'Confirmé - Autonome sur la plupart des tâches',
    4: 'Avancé - Maîtrise parfaitement le sujet',
    5: 'Expert - Référent capable de former les autres'
  };
  
  const handleChange = (field, value) => {
    setEvaluation({
      ...evaluation,
      [field]: value
    });
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (existingEvaluation) {
        await evaluationService.updateEvaluation(existingEvaluation.id, evaluation);
      } else {
        await evaluationService.createEvaluation(evaluation);
      }
      
      setLoading(false);
      if (onSave) onSave();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement de l\'évaluation.');
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Évaluation de {skill?.name} pour {employee?.first_name} {employee?.last_name}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>Niveau de maîtrise :</Typography>
          <Rating
            name="quantitative_level"
            value={evaluation.quantitative_level}
            onChange={(event, newValue) => {
              handleChange('quantitative_level', newValue);
            }}
            max={5}
          />
          <Typography variant="caption">
            {levelDescriptions[evaluation.quantitative_level] || ''}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Description qualitative"
            value={evaluation.qualitative_description}
            onChange={(e) => handleChange('qualitative_description', e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Ajouter des informations complémentaires sur la maîtrise de cette compétence..."
          />
        </Grid>
      </Grid>
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Annuler
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (existingEvaluation ? 'Mettre à jour' : 'Enregistrer')}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeSkillEvaluation; 