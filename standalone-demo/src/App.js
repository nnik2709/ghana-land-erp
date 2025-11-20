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
import TitleTransferPage from './pages/TitleTransferPage';
import DisputeResolutionPage from './pages/DisputeResolutionPage';
import CustomaryLandPage from './pages/CustomaryLandPage';
import EncumbrancePage from './pages/EncumbrancePage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import ValuationPage from './pages/ValuationPage';
import SubdivisionPage from './pages/SubdivisionPage';
import SuccessionPage from './pages/SuccessionPage';
import LeaseManagementPage from './pages/LeaseManagementPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import PublicPortalPage from './pages/PublicPortalPage';
import OnlinePaymentPortalPage from './pages/OnlinePaymentPortalPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import BillingHistoryPage from './pages/BillingHistoryPage';
import PaymentAssistancePage from './pages/PaymentAssistancePage';
import MyAccountPage from './pages/MyAccountPage';
import TieredRegistrationPage from './pages/TieredRegistrationPage';
import CommunityMappingPage from './pages/CommunityMappingPage';
import ParaSurveyorPage from './pages/ParaSurveyorPage';
import WomenInclusionPage from './pages/WomenInclusionPage';
import LandSearchPage from './pages/LandSearchPage';
import StampDutyCalculatorPage from './pages/StampDutyCalculatorPage';
import SurveyorAccreditationPage from './pages/SurveyorAccreditationPage';
import RevenueReportingPage from './pages/RevenueReportingPage';

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
            <Route path="/title-transfer" element={<PrivateRoute><TitleTransferPage /></PrivateRoute>} />
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
            <Route path="/disputes" element={<PrivateRoute><DisputeResolutionPage /></PrivateRoute>} />
            <Route path="/customary-land" element={<PrivateRoute><CustomaryLandPage /></PrivateRoute>} />
            <Route path="/encumbrance" element={<PrivateRoute><EncumbrancePage /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><AnalyticsDashboardPage /></PrivateRoute>} />
            <Route path="/valuation" element={<PrivateRoute><ValuationPage /></PrivateRoute>} />
            <Route path="/subdivision" element={<PrivateRoute><SubdivisionPage /></PrivateRoute>} />
            <Route path="/succession" element={<PrivateRoute><SuccessionPage /></PrivateRoute>} />
            <Route path="/leases" element={<PrivateRoute><LeaseManagementPage /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationCenterPage /></PrivateRoute>} />
            <Route path="/public-portal" element={<PublicPortalPage />} />
            <Route path="/pay-online" element={<PrivateRoute><OnlinePaymentPortalPage /></PrivateRoute>} />
            <Route path="/my-properties" element={<PrivateRoute><MyPropertiesPage /></PrivateRoute>} />
            <Route path="/billing-history" element={<PrivateRoute><BillingHistoryPage /></PrivateRoute>} />
            <Route path="/payment-assistance" element={<PrivateRoute><PaymentAssistancePage /></PrivateRoute>} />
            <Route path="/my-account" element={<PrivateRoute><MyAccountPage /></PrivateRoute>} />
            <Route path="/tiered-registration" element={<PrivateRoute><TieredRegistrationPage /></PrivateRoute>} />
            <Route path="/community-mapping" element={<PrivateRoute><CommunityMappingPage /></PrivateRoute>} />
            <Route path="/para-surveyors" element={<PrivateRoute><ParaSurveyorPage /></PrivateRoute>} />
            <Route path="/women-inclusion" element={<PrivateRoute><WomenInclusionPage /></PrivateRoute>} />
            <Route path="/land-search" element={<PrivateRoute><LandSearchPage /></PrivateRoute>} />
            <Route path="/stamp-duty-calculator" element={<PrivateRoute><StampDutyCalculatorPage /></PrivateRoute>} />
            <Route path="/surveyor-accreditation" element={<PrivateRoute><SurveyorAccreditationPage /></PrivateRoute>} />
            <Route path="/revenue-reporting" element={<PrivateRoute><RevenueReportingPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
