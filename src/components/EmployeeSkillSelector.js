import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import skillService from '../services/skillService';

/**
 * Composant pour sélectionner une compétence à évaluer
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.open - État d'ouverture de la boîte de dialogue
 * @param {Function} props.onClose - Fonction à appeler pour fermer la boîte de dialogue
 * @param {Function} props.onSelect - Fonction à appeler lorsqu'une compétence est sélectionnée
 * @param {Array} props.excludeSkills - IDs des compétences à exclure de la liste (optionnel)
 * @returns {JSX.Element} - Composant de sélection de compétence
 */
const EmployeeSkillSelector = ({ open, onClose, onSelect, excludeSkills = [] }) => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchSkills();
    }
  }, [open]);

  useEffect(() => {
    filterSkills();
  }, [skills, searchTerm, excludeSkills]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await skillService.getSkills();
      setSkills(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Une erreur est survenue lors du chargement des compétences.');
    } finally {
      setLoading(false);
    }
  };

  const filterSkills = () => {
    let filtered = skills;
    
    // Exclude skills
    if (excludeSkills.length > 0) {
      filtered = filtered.filter(skill => !excludeSkills.includes(skill.id));
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(term) || 
        (skill.description && skill.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredSkills(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectSkill = (skill) => {
    onSelect(skill);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sélectionner une compétence</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Rechercher..."
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : filteredSkills.length === 0 ? (
          <Typography variant="body2" sx={{ py: 2 }}>
            Aucune compétence trouvée.
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {filteredSkills.map((skill) => (
              <ListItem 
                button 
                key={skill.id} 
                onClick={() => handleSelectSkill(skill)}
                divider
              >
                <ListItemText 
                  primary={skill.name} 
                  secondary={skill.description} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeSkillSelector;
