import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';

// Layout
import AppLayout from './components/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import SurveyorDashboard from './pages/SurveyorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ParcelsPage from './pages/ParcelsPage';
import TitlesPage from './pages/TitlesPage';
import PaymentsPage from './pages/PaymentsPage';
import BlockchainPage from './pages/BlockchainPage';
import IntegrationsPage from './pages/IntegrationsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SubmitSurveyPage from './pages/SubmitSurveyPage';
import MySurveysPage from './pages/MySurveysPage';
import MortgagesPage from './pages/MortgagesPage';
import DocumentsPage from './pages/DocumentsPage';
import EducationalPortalPage from './pages/EducationalPortalPage';
import AuditLogPage from './pages/AuditLogPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import SpatialDashboardPage from './pages/SpatialDashboardPage';
import GISDemoPage from './pages/GISDemoPage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppLayout>{children}</AppLayout> : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/citizen" element={<PrivateRoute><CitizenDashboard /></PrivateRoute>} />
            <Route path="/surveyor" element={<PrivateRoute><SurveyorDashboard /></PrivateRoute>} />
            <Route path="/officer" element={<PrivateRoute><OfficerDashboard /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/parcels" element={<PrivateRoute><ParcelsPage /></PrivateRoute>} />
            <Route path="/spatial" element={<PrivateRoute><SpatialDashboardPage /></PrivateRoute>} />
            <Route path="/gis-demo" element={<PrivateRoute><GISDemoPage /></PrivateRoute>} />
            <Route path="/titles" element={<PrivateRoute><TitlesPage /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
            <Route path="/applications" element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />
            <Route path="/blockchain" element={<PrivateRoute><BlockchainPage /></PrivateRoute>} />
            <Route path="/integrations" element={<PrivateRoute><IntegrationsPage /></PrivateRoute>} />
            <Route path="/submit-survey" element={<PrivateRoute><SubmitSurveyPage /></PrivateRoute>} />
            <Route path="/my-surveys" element={<PrivateRoute><MySurveysPage /></PrivateRoute>} />
            <Route path="/mortgages" element={<PrivateRoute><MortgagesPage /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
            <Route path="/help" element={<PrivateRoute><EducationalPortalPage /></PrivateRoute>} />
            <Route path="/audit" element={<PrivateRoute><AuditLogPage /></PrivateRoute>} />
            <Route path="/support" element={<PrivateRoute><SupportPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
