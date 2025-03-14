import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
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
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Routes pour les référentiels */}
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/positions"
            element={
              <ProtectedRoute>
                <PositionsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Routes pour la gestion */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/skill-matching"
            element={
              <ProtectedRoute>
                <SkillMatchingPage />
              </ProtectedRoute>
            }
          />
          
          {/* Routes pour l'analytique */}
          <Route
            path="/skill-analytics"
            element={
              <ProtectedRoute>
                <SkillAnalyticsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gap-analysis"
            element={
              <ProtectedRoute>
                <GapAnalysisPage />
              </ProtectedRoute>
            }
          />
          
          {/* Routes pour le profil et les paramètres */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
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
