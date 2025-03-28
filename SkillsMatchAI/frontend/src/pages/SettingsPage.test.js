import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from './SettingsPage';
import settingsService from '../services/settingsService';

// Mock du service
jest.mock('../services/settingsService');

describe('SettingsPage', () => {
  const mockCustomFieldsData = {
    id: 1,
    title: 'Job Title',
    custom_field1_label: 'Niveau de responsabilité',
    custom_field1_visible: true,
    custom_field2_label: 'Service',
    custom_field2_visible: true,
    custom_field3_label: 'Champ personnalisé 3',
    custom_field3_visible: false,
    custom_field4_label: 'Champ personnalisé 4',
    custom_field4_visible: false
  };

  const mockCustomFieldsConfig = {
    field1: { label: 'Niveau de responsabilité', visible: true },
    field2: { label: 'Service', visible: true },
    field3: { label: 'Champ personnalisé 3', visible: false },
    field4: { label: 'Champ personnalisé 4', visible: false }
  };

  beforeEach(() => {
    // Configuration des mocks
    settingsService.getCustomFieldsForModel.mockResolvedValue(mockCustomFieldsData);
    settingsService.extractCustomFieldsConfig.mockReturnValue(mockCustomFieldsConfig);
    settingsService.updateCustomFields.mockResolvedValue([]);
    settingsService.prepareCustomFieldsUpdateData.mockReturnValue({
      custom_field1_label: 'Niveau de responsabilité',
      custom_field1_visible: true,
      custom_field2_label: 'Service',
      custom_field2_visible: true,
      custom_field3_label: 'Champ personnalisé 3',
      custom_field3_visible: false,
      custom_field4_label: 'Champ personnalisé 4',
      custom_field4_visible: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les onglets de paramètres', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Préférences générales')).toBeInTheDocument();
    expect(screen.getByText('Champs personnalisés')).toBeInTheDocument();
  });

  it('charge les champs personnalisés au chargement initial', async () => {
    render(<SettingsPage />);
    
    // Cliquer sur l'onglet des champs personnalisés
    fireEvent.click(screen.getByText('Champs personnalisés'));
    
    await waitFor(() => {
      expect(settingsService.getCustomFieldsForModel).toHaveBeenCalledWith('job');
      expect(settingsService.extractCustomFieldsConfig).toHaveBeenCalledWith(mockCustomFieldsData);
    });
  });

  it('affiche les champs personnalisés correctement', async () => {
    render(<SettingsPage />);
    
    // Cliquer sur l'onglet des champs personnalisés
    fireEvent.click(screen.getByText('Champs personnalisés'));
    
    // Attendre que les champs personnalisés soient chargés
    await waitFor(() => {
      expect(screen.getByText('Configurez les champs personnalisés pour les métiers')).toBeInTheDocument();
    });
    
    // Vérifier que les champs sont affichés avec les bonnes valeurs
    expect(screen.getByDisplayValue('Niveau de responsabilité')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Service')).toBeInTheDocument();
  });

  it('permet de changer la visibilité d\'un champ', async () => {
    render(<SettingsPage />);
    
    // Cliquer sur l'onglet des champs personnalisés
    fireEvent.click(screen.getByText('Champs personnalisés'));
    
    // Attendre que les champs personnalisés soient chargés
    await waitFor(() => {
      expect(screen.getByText('Configurez les champs personnalisés pour les métiers')).toBeInTheDocument();
    });
    
    // Récupérer les switches
    const switches = screen.getAllByRole('checkbox');
    
    // Cliquer sur le troisième switch (index 2) pour le rendre visible
    fireEvent.click(switches[2]);
    
    // Vérifier que le champ est maintenant activé
    await waitFor(() => {
      const textFields = screen.getAllByRole('textbox');
      expect(textFields[2]).not.toBeDisabled();
    });
  });

  it('enregistre les modifications des champs personnalisés', async () => {
    render(<SettingsPage />);
    
    // Cliquer sur l'onglet des champs personnalisés
    fireEvent.click(screen.getByText('Champs personnalisés'));
    
    // Attendre que les champs personnalisés soient chargés
    await waitFor(() => {
      expect(screen.getByText('Configurez les champs personnalisés pour les métiers')).toBeInTheDocument();
    });
    
    // Modifier un champ
    const textFields = screen.getAllByRole('textbox');
    fireEvent.change(textFields[0], { target: { value: 'Niveau hiérarchique' } });
    
    // Cliquer sur le bouton d'enregistrement
    fireEvent.click(screen.getByText('Enregistrer les modifications'));
    
    // Vérifier que la mise à jour a été appelée
    await waitFor(() => {
      expect(settingsService.prepareCustomFieldsUpdateData).toHaveBeenCalled();
      expect(settingsService.updateCustomFields).toHaveBeenCalled();
    });
    
    // Vérifier que la notification de succès est affichée
    await waitFor(() => {
      expect(screen.getByText('Champs personnalisés mis à jour avec succès')).toBeInTheDocument();
    });
  });

  it('change le type de modèle lorsque l\'utilisateur sélectionne une autre option', async () => {
    render(<SettingsPage />);
    
    // Cliquer sur l'onglet des champs personnalisés
    fireEvent.click(screen.getByText('Champs personnalisés'));
    
    // Attendre que les champs personnalisés soient chargés
    await waitFor(() => {
      expect(screen.getByText('Configurez les champs personnalisés pour les métiers')).toBeInTheDocument();
    });
    
    // Ouvrir le sélecteur de type
    fireEvent.mouseDown(screen.getByLabelText('Type d\'entité'));
    
    // Sélectionner "Compétences"
    const skillsOption = screen.getByText('Compétences');
    fireEvent.click(skillsOption);
    
    // Vérifier que la fonction pour obtenir les champs a été appelée avec le bon type
    await waitFor(() => {
      expect(settingsService.getCustomFieldsForModel).toHaveBeenCalledWith('skill');
    });
  });
}); 