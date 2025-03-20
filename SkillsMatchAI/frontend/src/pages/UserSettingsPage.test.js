import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import UserSettingsPage from './UserSettingsPage';

// Mock du context d'authentification
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }
  })
}));

describe('UserSettingsPage', () => {
  test('rend correctement les informations utilisateur', () => {
    render(
      <BrowserRouter>
        <UserSettingsPage />
      </BrowserRouter>
    );
    
    // Vérifier que le titre est présent
    expect(screen.getByText('Paramètres Utilisateur')).toBeInTheDocument();
    
    // Vérifier que les informations de l'utilisateur sont affichées
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    
    // Vérifier la présence des sections
    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
    expect(screen.getByText('Préférences d\'interface')).toBeInTheDocument();
    
    // Vérifier la présence du bouton de sauvegarde
    expect(screen.getByText('Enregistrer les modifications')).toBeInTheDocument();
  });
  
  test('permet de changer les préférences', () => {
    render(
      <BrowserRouter>
        <UserSettingsPage />
      </BrowserRouter>
    );
    
    // Activer le mode sombre
    const darkModeSwitch = screen.getByLabelText('Mode sombre').querySelector('input');
    fireEvent.click(darkModeSwitch);
    
    // Vérifier que l'état a changé
    expect(darkModeSwitch.checked).toBe(true);
    
    // Tester la soumission du formulaire
    fireEvent.click(screen.getByText('Enregistrer les modifications'));
    
    // Vérifier que la notification est affichée
    expect(screen.getByText('Paramètres enregistrés avec succès!')).toBeInTheDocument();
  });
}); 