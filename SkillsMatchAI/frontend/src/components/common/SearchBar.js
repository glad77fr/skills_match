import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Popper,
  Grow,
  ClickAwayListener
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

/**
 * Composant de barre de recherche globale
 * @returns {JSX.Element} - Composant de barre de recherche
 */
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      setIsSearching(true);
      // Simuler une recherche (à remplacer par un appel API réel)
      setTimeout(() => {
        const mockResults = [
          { id: 1, type: 'employee', name: 'Jean Dupont', description: 'Développeur Frontend' },
          { id: 2, type: 'skill', name: 'React', description: 'Bibliothèque JavaScript' },
          { id: 3, type: 'job', name: 'Développeur Full Stack', description: 'Niveau Senior' },
          { id: 4, type: 'department', name: 'Informatique', description: '25 employés' },
        ].filter(item => 
          item.name.toLowerCase().includes(value.toLowerCase()) || 
          item.description.toLowerCase().includes(value.toLowerCase())
        );
        
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
  };
  
  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClickAway = () => {
    setAnchorEl(null);
  };
  
  const getIconForType = (type) => {
    switch (type) {
      case 'employee':
        return <PersonIcon />;
      case 'job':
        return <WorkIcon />;
      case 'department':
        return <BusinessIcon />;
      case 'skill':
        return <PsychologyIcon />;
      default:
        return <SearchIcon />;
    }
  };
  
  const open = Boolean(anchorEl) && searchTerm.length > 2;
  
  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 500 }}>
      <TextField
        fullWidth
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearch}
        onFocus={handleFocus}
        variant="outlined"
        size="small"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box>
                  {isSearching ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2">Recherche en cours...</Typography>
                    </Box>
                  ) : searchResults.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {searchResults.map((result, index) => (
                        <React.Fragment key={result.id}>
                          {index > 0 && <Divider />}
                          <ListItem button>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {getIconForType(result.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={result.name}
                              secondary={result.description}
                              primaryTypographyProps={{ variant: 'subtitle2' }}
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  ) : searchTerm.length > 2 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2">Aucun résultat trouvé</Typography>
                    </Box>
                  )}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default SearchBar; 