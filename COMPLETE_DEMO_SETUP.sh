#!/bin/bash

# Complete Demo Application Setup
# This script creates ALL remaining React pages and makes the demo ready to run

set -e

BASE_DIR="/Users/nikolay/Library/CloudStorage/OneDrive-EywaSystems/ghana/land-erp-demo"

echo "🎯 Creating Complete Ghana Land ERP Demo..."
echo ""

# Function to create React page
create_page() {
    local filename=$1
    local content=$2
    cat > "$BASE_DIR/frontend/src/pages/$filename" << EOF
$content
EOF
    echo "✅ Created $filename"
}

# Login Page
create_page "LoginPage.js" "import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, Card, CardContent, Grid
} from '@mui/material';
import api from '../services/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [demoUsers, setDemoUsers] = useState([]);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = { citizen: '/citizen', surveyor: '/surveyor', admin: '/admin', lands_officer: '/admin' };
      navigate(routes[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    api.get('/auth/demo-users').then(res => setDemoUsers(res.data.data));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (!result.success) setError(result.message);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #006B3F 0%, #FCD116 100%)' }}>
      <Container maxWidth=\"md\">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign=\"center\" mb={3}>
            <Typography variant=\"h3\" fontWeight=\"bold\" color=\"primary\">🇬🇭 Ghana Land ERP</Typography>
            <Typography variant=\"h6\" color=\"text.secondary\">National Land Survey & Title Platform</Typography>
            <Typography variant=\"body2\" color=\"error\" sx={{ mt: 1 }}>⚠️ DEMO APPLICATION - Not for Production Use</Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField fullWidth label=\"Username\" margin=\"normal\" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <TextField fullWidth label=\"Password\" type=\"password\" margin=\"normal\" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <Alert severity=\"error\" sx={{ mt: 2 }}>{error}</Alert>}
            <Button fullWidth variant=\"contained\" size=\"large\" type=\"submit\" sx={{ mt: 3, py: 1.5 }}>Login</Button>
          </form>

          <Box mt={4}>
            <Typography variant=\"h6\" gutterBottom>📋 Demo Credentials</Typography>
            <Grid container spacing={2}>
              {demoUsers.map((u, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Card variant=\"outlined\" sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => { setUsername(u.username); setPassword('demo123'); }}>
                    <CardContent>
                      <Typography variant=\"subtitle1\" fontWeight=\"bold\">{u.role}</Typography>
                      <Typography variant=\"body2\" color=\"text.secondary\">Username: {u.username}</Typography>
                      <Typography variant=\"body2\" color=\"text.secondary\">Password: {u.password}</Typography>
                      <Typography variant=\"caption\" color=\"primary\">{u.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}"

# Citizen Dashboard
create_page "CitizenDashboard.js" "import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Paper, Typography, Box, Button, Card, CardContent, AppBar, Toolbar } from '@mui/material';
import api from '../services/api';

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  return (
    <Box>
      <AppBar position=\"static\">
        <Toolbar>
          <Typography variant=\"h6\" sx={{ flexGrow: 1 }}>🇬🇭 Ghana Land ERP - Citizen Portal</Typography>
          <Typography variant=\"body1\" sx={{ mr: 2 }}>Welcome, {user?.full_name}</Typography>
          <Button color=\"inherit\" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth=\"lg\" sx={{ mt: 4, mb: 4 }}>
        <Typography variant=\"h4\" gutterBottom>My Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">My Parcels</Typography><Typography variant=\"h4\">2</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Active Applications</Typography><Typography variant=\"h4\">1</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Issued Titles</Typography><Typography variant=\"h4\">1</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Pending Payments</Typography><Typography variant=\"h4\">GHS 500</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant=\"h6\" gutterBottom>Quick Actions</Typography>
              <Box display=\"flex\" gap={2} flexWrap=\"wrap\">
                <Button variant=\"contained\" onClick={() => navigate('/parcels')}>View My Parcels</Button>
                <Button variant=\"contained\" onClick={() => navigate('/titles')}>My Titles</Button>
                <Button variant=\"contained\" onClick={() => navigate('/payments')}>Payment History</Button>
                <Button variant=\"outlined\" onClick={() => navigate('/blockchain')}>Blockchain Verification</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}"

# Surveyor Dashboard
create_page "SurveyorDashboard.js" "import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, Button, AppBar, Toolbar, Paper, Grid, Card, CardContent } from '@mui/material';

export default function SurveyorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar position=\"static\" sx={{ bgcolor: 'secondary.main' }}>
        <Toolbar>
          <Typography variant=\"h6\" sx={{ flexGrow: 1 }}>🗺️ Ghana Land ERP - Surveyor Portal</Typography>
          <Typography variant=\"body1\" sx={{ mr: 2 }}>Welcome, {user?.full_name}</Typography>
          <Button color=\"inherit\" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth=\"lg\" sx={{ mt: 4 }}>
        <Typography variant=\"h4\" gutterBottom>Surveyor Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography color=\"text.secondary\">Submitted Surveys</Typography><Typography variant=\"h4\">12</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography color=\"text.secondary\">Approved Surveys</Typography><Typography variant=\"h4\">10</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography color=\"text.secondary\">Pending Review</Typography><Typography variant=\"h4\">2</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant=\"h6\" gutterBottom>Survey Actions</Typography>
              <Box display=\"flex\" gap={2}>
                <Button variant=\"contained\">Submit New Survey</Button>
                <Button variant=\"outlined\">View My Surveys</Button>
                <Button variant=\"outlined\">Offline Sync Status</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}"

# Admin Dashboard
create_page "AdminDashboard.js" "import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, Button, AppBar, Toolbar, Paper, Grid, Card, CardContent } from '@mui/material';
import api from '../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  return (
    <Box>
      <AppBar position=\"static\" sx={{ bgcolor: 'error.main' }}>
        <Toolbar>
          <Typography variant=\"h6\" sx={{ flexGrow: 1 }}>⚙️ Ghana Land ERP - Admin Console</Typography>
          <Typography variant=\"body1\" sx={{ mr: 2 }}>Admin: {user?.full_name}</Typography>
          <Button color=\"inherit\" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth=\"lg\" sx={{ mt: 4 }}>
        <Typography variant=\"h4\" gutterBottom>System Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Total Parcels</Typography><Typography variant=\"h4\">{stats?.overview.total_parcels || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Pending Applications</Typography><Typography variant=\"h4\">{stats?.overview.pending_applications || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Total Revenue</Typography><Typography variant=\"h4\">GHS {stats?.overview.total_payments || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color=\"text.secondary\">Blockchain TXs</Typography><Typography variant=\"h4\">{stats?.overview.blockchain_transactions || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant=\"h6\" gutterBottom>System Management</Typography>
              <Box display=\"flex\" gap={2} flexWrap=\"wrap\">
                <Button variant=\"contained\" onClick={() => navigate('/parcels')}>Manage Parcels</Button>
                <Button variant=\"contained\" onClick={() => navigate('/titles')}>Manage Titles</Button>
                <Button variant=\"contained\" onClick={() => navigate('/blockchain')}>Blockchain Explorer</Button>
                <Button variant=\"contained\" onClick={() => navigate('/integrations')}>External Integrations</Button>
                <Button variant=\"outlined\">User Management</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}"

# Parcels Page
create_page "ParcelsPage.js" "import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import api from '../services/api';

export default function ParcelsPage() {
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    api.get('/parcels').then(res => setParcels(res.data.data));
  }, []);

  return (
    <Container maxWidth=\"lg\" sx={{ mt: 4 }}>
      <Typography variant=\"h4\" gutterBottom>Land Parcels</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcel ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Area (m²)</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parcels.map(parcel => (
              <TableRow key={parcel.id}>
                <TableCell>{parcel.parcel_id}</TableCell>
                <TableCell>{parcel.location}, {parcel.district}</TableCell>
                <TableCell>{parcel.area}</TableCell>
                <TableCell>{parcel.land_type}</TableCell>
                <TableCell><Chip label={parcel.status} color={parcel.status === 'registered' ? 'success' : 'warning'} size=\"small\" /></TableCell>
                <TableCell><Button size=\"small\">View Details</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}"

# Simple placeholder pages
for page in "TitlesPage" "PaymentsPage" "BlockchainPage" "IntegrationsPage"; do
    create_page "${page}.js" "import React from 'react';
import { Container, Typography } from '@mui/material';

export default function ${page}() {
  return (
    <Container maxWidth=\"lg\" sx={{ mt: 4 }}>
      <Typography variant=\"h4\">${page}</Typography>
      <Typography>This page will display ${page} data. Coming soon...</Typography>
    </Container>
  );
}"
done

echo ""
echo "✅ All React pages created successfully!"
echo ""
echo "📦 Next steps:"
echo "1. cd $BASE_DIR/backend && npm install"
echo "2. cd $BASE_DIR/frontend && npm install"
echo "3. Start backend: cd backend && npm start"
echo "4. Start frontend: cd frontend && npm start"
echo "5. Open http://localhost:3000"
echo ""
echo "🎉 Demo is ready!"
