import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeSkillEvaluation from '../../components/EmployeeSkillEvaluation';
import evaluationService from '../../services/evaluationService';

// Mock du service d'évaluation
jest.mock('../../services/evaluationService', () => ({
  createEvaluation: jest.fn(),
  updateEvaluation: jest.fn()
}));

describe('EmployeeSkillEvaluation Component', () => {
  const mockEmployee = { id: 1, first_name: 'John', last_name: 'Doe' };
  const mockSkill = { id: 2, name: 'React' };
  const mockExistingEvaluation = {
    id: 3,
    employee: 1,
    skill: 2,
    quantitative_level: 3,
    qualitative_description: 'Good knowledge of React',
  };
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with provided props', () => {
    render(
      <EmployeeSkillEvaluation
        employee={mockEmployee}
        skill={mockSkill}
        existingEvaluation={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Vérifie que le titre est affiché correctement
    expect(screen.getByText(`Évaluation de ${mockSkill.name} pour ${mockEmployee.first_name} ${mockEmployee.last_name}`)).toBeInTheDocument();
    
    // Vérifie que le niveau par défaut est 1
    expect(screen.getByText('Débutant - Connaissances de base')).toBeInTheDocument();
    
    // Vérifie que les boutons sont présents
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    expect(screen.getByText('Enregistrer')).toBeInTheDocument();
  });

  test('renders correctly with existing evaluation', () => {
    render(
      <EmployeeSkillEvaluation
        employee={mockEmployee}
        skill={mockSkill}
        existingEvaluation={mockExistingEvaluation}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Vérifie que les valeurs de l'évaluation existante sont utilisées
    expect(screen.getByText('Confirmé - Autonome sur la plupart des tâches')).toBeInTheDocument();
    expect(screen.getByText('Mettre à jour')).toBeInTheDocument();
    
    // Vérifie que la description qualitative est remplie
    const descriptionInput = screen.getByLabelText('Description qualitative');
    expect(descriptionInput.value).toBe(mockExistingEvaluation.qualitative_description);
  });

  test('calls onCancel when Cancel button is clicked', () => {
    render(
      <EmployeeSkillEvaluation
        employee={mockEmployee}
        skill={mockSkill}
        existingEvaluation={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Annuler'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('calls createEvaluation when Save button is clicked (new evaluation)', async () => {
    evaluationService.createEvaluation.mockResolvedValue({});
    
    render(
      <EmployeeSkillEvaluation
        employee={mockEmployee}
        skill={mockSkill}
        existingEvaluation={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Modify qualitative description
    const descriptionInput = screen.getByLabelText('Description qualitative');
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    // Click save button
    fireEvent.click(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(evaluationService.createEvaluation).toHaveBeenCalledWith(expect.objectContaining({
        employee: mockEmployee.id,
        skill: mockSkill.id,
        quantitative_level: 1,
        qualitative_description: 'Test description'
      }));
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });

  test('calls updateEvaluation when Save button is clicked (existing evaluation)', async () => {
    evaluationService.updateEvaluation.mockResolvedValue({});
    
    render(
      <EmployeeSkillEvaluation
        employee={mockEmployee}
        skill={mockSkill}
        existingEvaluation={mockExistingEvaluation}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Modify qualitative description
    const descriptionInput = screen.getByLabelText('Description qualitative');
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    // Click update button
    fireEvent.click(screen.getByText('Mettre à jour'));

    await waitFor(() => {
      expect(evaluationService.updateEvaluation).toHaveBeenCalledWith(
        mockExistingEvaluation.id,
        expect.objectContaining({
          employee: mockEmployee.id,
          skill: mockSkill.id,
          quantitative_level: mockExistingEvaluation.quantitative_level,
          qualitative_description: 'Updated description'
        })
      );
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });

  test('displays error message when saving fails', async () => {
    evaluationService.createEvaluation.mockRejectedValue(new Error('API error'));
    
    render(
      <EmployeeSkillEvaluation
        employee={mockEmployee}
        skill={mockSkill}
        existingEvaluation={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Click save button
    fireEvent.click(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(screen.getByText('Une erreur est survenue lors de l\'enregistrement de l\'évaluation.')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });
}); 