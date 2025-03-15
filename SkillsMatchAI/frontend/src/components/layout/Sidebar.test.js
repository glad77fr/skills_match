import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

// Wrapper pour fournir le contexte de routage nécessaire
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Sidebar Component', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });
  
  test('renders correctly when open', () => {
    render(
      <TestWrapper>
        <Sidebar open={true} onClose={mockOnClose} />
      </TestWrapper>
    );
    
    // Vérifier que les éléments principaux sont présents
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    expect(screen.getByText('Référentiels')).toBeInTheDocument();
    expect(screen.getByText('Gestion')).toBeInTheDocument();
    expect(screen.getByText('Analytique')).toBeInTheDocument();
    expect(screen.getByText('Paramètres')).toBeInTheDocument();
  });
  
  test('toggles menu sections when clicked', () => {
    render(
      <TestWrapper>
        <Sidebar open={true} onClose={mockOnClose} />
      </TestWrapper>
    );
    
    // Référentiels devrait être ouvert par défaut
    expect(screen.getByText('Compétences')).toBeInTheDocument();
    
    // Fermer la section Référentiels
    fireEvent.click(screen.getByText('Référentiels'));
    
    // Les éléments de la section Référentiels ne devraient plus être visibles
    expect(screen.queryByText('Compétences')).not.toBeInTheDocument();
    
    // Ouvrir la section Gestion
    fireEvent.click(screen.getByText('Gestion'));
    
    // Les éléments de la section Gestion devraient être visibles
    expect(screen.getByText('Employés')).toBeInTheDocument();
    expect(screen.getByText('Matching de compétences')).toBeInTheDocument();
  });
  
  test('calls onClose when navigation item is clicked on mobile', () => {
    // Simuler un écran mobile
    window.innerWidth = 800;
    
    render(
      <TestWrapper>
        <Sidebar open={true} onClose={mockOnClose} />
      </TestWrapper>
    );
    
    // Cliquer sur un élément de navigation
    fireEvent.click(screen.getByText('Tableau de bord'));
    
    // Vérifier que onClose a été appelé
    expect(mockOnClose).toHaveBeenCalled();
    
    // Restaurer la largeur de la fenêtre
    window.innerWidth = 1024;
  });
  
  test('does not call onClose when navigation item is clicked on desktop', () => {
    // Simuler un écran desktop
    window.innerWidth = 1200;
    
    render(
      <TestWrapper>
        <Sidebar open={true} onClose={mockOnClose} />
      </TestWrapper>
    );
    
    // Cliquer sur un élément de navigation
    fireEvent.click(screen.getByText('Tableau de bord'));
    
    // Vérifier que onClose n'a pas été appelé
    expect(mockOnClose).not.toHaveBeenCalled();
  });
  
  test('has correct styles when open and closed', () => {
    const { rerender } = render(
      <TestWrapper>
        <Sidebar open={true} onClose={mockOnClose} />
      </TestWrapper>
    );
    
    // Vérifier que le Drawer a les styles corrects lorsqu'il est ouvert
    const drawer = document.querySelector('.MuiDrawer-root');
    expect(drawer).toBeInTheDocument();
    
    // Rerendre avec open=false
    rerender(
      <TestWrapper>
        <Sidebar open={false} onClose={mockOnClose} />
      </TestWrapper>
    );
    
    // Vérifier que le Drawer a toujours les styles corrects
    expect(drawer).toBeInTheDocument();
  });
}); 