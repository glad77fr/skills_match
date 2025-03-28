import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeSkillSelector from '../../components/EmployeeSkillSelector';
import skillService from '../../services/skillService';

// Mock du service de compétences
jest.mock('../../services/skillService', () => ({
  getSkills: jest.fn()
}));

describe('EmployeeSkillSelector Component', () => {
  const mockSkills = [
    { id: 1, name: 'React', description: 'Frontend library' },
    { id: 2, name: 'Node.js', description: 'Backend runtime' },
    { id: 3, name: 'Python', description: 'Programming language' },
    { id: 4, name: 'Django', description: 'Web framework' }
  ];
  
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    skillService.getSkills.mockResolvedValue(mockSkills);
  });

  test('renders correctly when open', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // Vérifie que le titre est affiché
    expect(screen.getByText('Sélectionner une compétence')).toBeInTheDocument();
    
    // Vérifie que le champ de recherche est présent
    expect(screen.getByLabelText('Rechercher...')).toBeInTheDocument();
    
    // Vérifie que le bouton d'annulation est présent
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    
    // Vérifie que le CircularProgress est affiché lors du chargement
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Attendez que les compétences soient chargées
    await waitFor(() => {
      expect(skillService.getSkills).toHaveBeenCalledTimes(1);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Django')).toBeInTheDocument();
    });
  });

  test('excludes specified skills from the list', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        excludeSkills={[1, 3]} // Exclure React et Python
      />
    );

    await waitFor(() => {
      // Vérifie que React et Python ne sont pas dans la liste
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
      
      // Vérifie que Node.js et Django sont toujours dans la liste
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Django')).toBeInTheDocument();
    });
  });

  test('filters skills based on search term', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // Entrer un terme de recherche
    const searchInput = screen.getByLabelText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'node' } });

    // Vérifie que seul Node.js est affiché
    await waitFor(() => {
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
      expect(screen.queryByText('Django')).not.toBeInTheDocument();
    });
  });

  test('filters skills based on description', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Django')).toBeInTheDocument();
    });

    // Entrer un terme qui correspond à une description
    const searchInput = screen.getByLabelText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'framework' } });

    // Vérifie que seul Django est affiché
    await waitFor(() => {
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
      expect(screen.getByText('Django')).toBeInTheDocument();
    });
  });

  test('shows message when no skills match search criteria', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // Entrer un terme qui ne correspond à aucune compétence
    const searchInput = screen.getByLabelText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'angular' } });

    // Vérifie que le message "Aucune compétence trouvée" est affiché
    await waitFor(() => {
      expect(screen.getByText('Aucune compétence trouvée.')).toBeInTheDocument();
    });
  });

  test('calls onSelect and onClose when a skill is clicked', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // Cliquer sur une compétence
    fireEvent.click(screen.getByText('React'));

    // Vérifie que onSelect est appelé avec la bonne compétence
    expect(mockOnSelect).toHaveBeenCalledWith(mockSkills[0]);
    
    // Vérifie que onClose est appelé
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Cancel button is clicked', async () => {
    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // Cliquer sur le bouton Annuler
    fireEvent.click(screen.getByText('Annuler'));

    // Vérifie que onClose est appelé
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays error message when skill loading fails', async () => {
    // Simuler une erreur lors du chargement des compétences
    skillService.getSkills.mockRejectedValue(new Error('API error'));

    render(
      <EmployeeSkillSelector
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // Vérifie que le message d'erreur est affiché
    await waitFor(() => {
      expect(screen.getByText('Une erreur est survenue lors du chargement des compétences.')).toBeInTheDocument();
    });
  });
}); 