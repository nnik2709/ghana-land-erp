import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

export default function SurveyorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Surveyor Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome, {user?.full_name}! Manage your survey submissions.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography color="text.secondary">Submitted Surveys</Typography><Typography variant="h4">12</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography color="text.secondary">Approved Surveys</Typography><Typography variant="h4">10</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography color="text.secondary">Pending Review</Typography><Typography variant="h4">2</Typography></CardContent></Card>
          </Grid>
        </Grid>
      </Container>
  );
}
