import React from 'react';
import { Box, Rating, Typography, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

/**
 * Composant pour afficher le niveau d'une compétence sous forme d'étoiles
 * @param {Object} props - Propriétés du composant
 * @param {number} props.level - Niveau numérique (1-5)
 * @param {string} props.qualitativeLevel - Description textuelle du niveau (optionnel)
 * @param {boolean} props.showText - Afficher ou non le texte à côté des étoiles
 * @returns {JSX.Element} - Composant d'affichage du niveau de compétence
 */
const SkillLevelIndicator = ({ level, qualitativeLevel, showText = true }) => {
  // Conversion du niveau numérique en libellé si non fourni
  const getLevelLabel = (numericLevel) => {
    const levels = {
      1: 'Débutant',
      2: 'Intermédiaire',
      3: 'Confirmé',
      4: 'Avancé',
      5: 'Expert'
    };
    return levels[numericLevel] || 'Non évalué';
  };

  const levelText = qualitativeLevel || getLevelLabel(level);

  return (
    <Tooltip title={levelText}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Rating
          value={level || 0}
          readOnly
          precision={1}
          max={5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {showText && (
          <Typography variant="body2" sx={{ ml: 1 }}>
            {levelText}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default SkillLevelIndicator; 