import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import api from '../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          System Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome Admin {user?.full_name}! Manage the entire land registration system.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Total Parcels</Typography><Typography variant="h4">{stats?.overview.total_parcels || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Pending Applications</Typography><Typography variant="h4">{stats?.overview.pending_applications || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Total Revenue</Typography><Typography variant="h4">GHS {stats?.overview.total_payments || 0}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Blockchain TXs</Typography><Typography variant="h4">{stats?.overview.blockchain_transactions || 0}</Typography></CardContent></Card>
          </Grid>
        </Grid>
      </Container>
  );
}
