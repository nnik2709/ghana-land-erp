#!/bin/bash

# Complete Frontend Creation Script for Ghana Land ERP Demo

set -e

BASE_DIR="/Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo/frontend"

echo "🎨 Creating React Frontend Application..."
echo

# Create public/index.html
cat > "$BASE_DIR/public/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#006B3F" />
    <meta name="description" content="Ghana National Land ERP - Digital Land Title Management System" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <title>Ghana Land ERP - Demo</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
HTMLEOF

# Create src/index.js
cat > "$BASE_DIR/src/index.js" << 'JSEOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
JSEOF

# Create src/index.css
cat > "$BASE_DIR/src/index.css" << 'CSSEOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

.leaflet-container {
  height: 400px;
  width: 100%;
}
CSSEOF

# Create src/App.js
cat > "$BASE_DIR/src/App.js" << 'APPEOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import SurveyorDashboard from './pages/SurveyorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParcelsPage from './pages/ParcelsPage';
import TitlesPage from './pages/TitlesPage';
import PaymentsPage from './pages/PaymentsPage';
import BlockchainPage from './pages/BlockchainPage';
import IntegrationsPage from './pages/IntegrationsPage';

// Ghana-themed colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#006B3F', // Ghana Green
      light: '#2E8B57',
      dark: '#004D2C',
    },
    secondary: {
      main: '#FCD116', // Ghana Yellow
      light: '#FFD54F',
      dark: '#F9A825',
    },
    error: {
      main: '#CE1126', // Ghana Red
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
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
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/parcels" element={<PrivateRoute><ParcelsPage /></PrivateRoute>} />
            <Route path="/titles" element={<PrivateRoute><TitlesPage /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
            <Route path="/blockchain" element={<PrivateRoute><BlockchainPage /></PrivateRoute>} />
            <Route path="/integrations" element={<PrivateRoute><IntegrationsPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
APPEOF

echo "✅ Created main App files"

# Create Auth Context
cat > "$BASE_DIR/src/contexts/AuthContext.js" << 'AUTHEOF'
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  async function loadUser() {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
AUTHEOF

# Create API service
cat > "$BASE_DIR/src/services/api.js" << 'APIEOF'
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
APIEOF

echo "✅ Created context and services"
echo "Frontend application structure created successfully!"
HTMLEOF

chmod +x "$BASE_DIR/../CREATE_FRONTEND.sh"
