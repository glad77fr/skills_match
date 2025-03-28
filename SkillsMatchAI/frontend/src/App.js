import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import SkillsPage from './pages/SkillsPage';
import JobsPage from './pages/JobsPage';
import PositionsPage from './pages/PositionsPage';
import EmployeesPage from './pages/EmployeesPage';
import SkillMatchingPage from './pages/SkillMatchingPage';
import SkillAnalyticsPage from './pages/SkillAnalyticsPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import LoginPage from './pages/Login';
import UserSettingsPage from './pages/UserSettingsPage';
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
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          
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
            path="/positions"
            element={
              <ProtectedLayout>
                <PositionsPage />
              </ProtectedLayout>
            }
          />
          
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
          
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            }
          />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
