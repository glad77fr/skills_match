import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import SkillsPage from './pages/SkillsPage';
import JobsPage from './pages/JobsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import PositionsPage from './pages/PositionsPage';
import EmployeesPage from './pages/EmployeesPage';
import SkillMatchingPage from './pages/SkillMatchingPage';
import SkillAnalyticsPage from './pages/SkillAnalyticsPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

/**
 * Composant qui combine ProtectedRoute et MainLayout
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Contenu à afficher
 * @returns {JSX.Element} - Composant combiné
 */
const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
};

/**
 * Composant principal de l'application
 * @returns {JSX.Element} - Composant principal
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique pour la page de connexion */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Routes protégées qui nécessitent une authentification */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          
          {/* Routes pour les référentiels */}
          <Route
            path="/skills"
            element={
              <ProtectedLayout>
                <SkillsPage />
              </ProtectedLayout>
            }
          />
          
          <Route
            path="/jobs"
            element={
              <ProtectedLayout>
                <JobsPage />
              </ProtectedLayout>
            }
          />
          
          <Route
            path="/departments"
            element={
              <ProtectedLayout>
                <DepartmentsPage />
              </ProtectedLayout>
            }
          />
          
          <Route
            path="/positions"
            element={
              <ProtectedLayout>
                <PositionsPage />
              </ProtectedLayout>
            }
          />
          
          {/* Routes pour la gestion */}
          <Route
            path="/employees"
            element={
              <ProtectedLayout>
                <EmployeesPage />
              </ProtectedLayout>
            }
          />
          
          <Route
            path="/skill-matching"
            element={
              <ProtectedLayout>
                <SkillMatchingPage />
              </ProtectedLayout>
            }
          />
          
          {/* Routes pour l'analytique */}
          <Route
            path="/skill-analytics"
            element={
              <ProtectedLayout>
                <SkillAnalyticsPage />
              </ProtectedLayout>
            }
          />
          
          <Route
            path="/gap-analysis"
            element={
              <ProtectedLayout>
                <GapAnalysisPage />
              </ProtectedLayout>
            }
          />
          
          {/* Routes pour le profil et les paramètres */}
          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            }
          />
          
          {/* Redirection par défaut vers le tableau de bord */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Redirection pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
