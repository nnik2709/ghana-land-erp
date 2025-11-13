import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Typography, Card, CardContent } from '@mui/material';
import api from '../services/api';

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back, {user?.full_name}! Here's your land management overview.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">My Parcels</Typography><Typography variant="h4">2</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Active Applications</Typography><Typography variant="h4">1</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Issued Titles</Typography><Typography variant="h4">1</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card><CardContent><Typography color="text.secondary">Pending Payments</Typography><Typography variant="h4">GHS 500</Typography></CardContent></Card>
          </Grid>
        </Grid>
      </Container>
  );
}
