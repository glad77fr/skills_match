import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './MainLayout';
import { AuthProvider } from '../../context/AuthContext';

// Mock des composants enfants pour simplifier les tests
jest.mock('./Navbar', () => {
  return function MockNavbar({ toggleDrawer }) {
    return (
      <div data-testid="navbar">
        <button data-testid="toggle-drawer" onClick={toggleDrawer}>
          Toggle Drawer
        </button>
      </div>
    );
  };
});

jest.mock('./Sidebar', () => {
  return function MockSidebar({ open, onClose }) {
    return (
      <div data-testid="sidebar" className={open ? 'open' : 'closed'}>
        <button data-testid="close-drawer" onClick={onClose}>
          Close Drawer
        </button>
      </div>
    );
  };
});

// Wrapper pour fournir le contexte nécessaire
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('MainLayout Component', () => {
  test('renders navbar, sidebar and main content', () => {
    render(
      <TestWrapper>
        <MainLayout>
          <div data-testid="content">Test Content</div>
        </MainLayout>
      </TestWrapper>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
  
  test('toggles sidebar when toggle button is clicked', () => {
    render(
      <TestWrapper>
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      </TestWrapper>
    );
    
    const toggleButton = screen.getByTestId('toggle-drawer');
    const sidebar = screen.getByTestId('sidebar');
    
    // La sidebar devrait être ouverte par défaut (sur desktop)
    expect(sidebar).toHaveClass('open');
    
    // Cliquer pour fermer la sidebar
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('closed');
    
    // Cliquer à nouveau pour ouvrir la sidebar
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('open');
  });
  
  test('closes sidebar when close button is clicked', () => {
    render(
      <TestWrapper>
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      </TestWrapper>
    );
    
    const closeButton = screen.getByTestId('close-drawer');
    const sidebar = screen.getByTestId('sidebar');
    
    // La sidebar devrait être ouverte par défaut (sur desktop)
    expect(sidebar).toHaveClass('open');
    
    // Cliquer pour fermer la sidebar
    fireEvent.click(closeButton);
    expect(sidebar).toHaveClass('closed');
  });
  
  test('main content has correct styles when sidebar is open/closed', () => {
    render(
      <TestWrapper>
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      </TestWrapper>
    );
    
    const toggleButton = screen.getByTestId('toggle-drawer');
    const mainContent = document.querySelector('main');
    
    // Vérifier que le contenu principal a les styles corrects lorsque la sidebar est ouverte
    expect(mainContent).toHaveStyle('flex-grow: 1');
    
    // Cliquer pour fermer la sidebar
    fireEvent.click(toggleButton);
    
    // Vérifier que le contenu principal a les styles corrects lorsque la sidebar est fermée
    expect(mainContent).toHaveStyle('flex-grow: 1');
  });
}); 