import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './Login';

// Mock du composant LoginForm
jest.mock('../components/auth/LoginForm', () => {
  return function DummyLoginForm() {
    return <div data-testid="login-form">Formulaire de connexion</div>;
  };
});

describe('LoginPage', () => {
  test('rend le titre et le formulaire de connexion', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Vérifier que le titre est présent
    expect(screen.getByText('SkillsMatchAI')).toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    
    // Vérifier que le formulaire est présent
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
}); 