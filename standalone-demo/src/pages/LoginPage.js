import React, { useState, useEffect } from 'react';
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
      const routes = { citizen: '/citizen', surveyor: '/surveyor', admin: '/admin', lands_officer: '/officer' };
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
      <Container maxWidth="md">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h3" fontWeight="bold" color="primary">🇬🇭 Ghana Land ERP</Typography>
            <Typography variant="h6" color="text.secondary">National Land Survey & Title Platform</Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>⚠️ DEMO APPLICATION - Not for Production Use</Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 3, py: 1.5 }}>Login</Button>
          </form>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>📋 Demo Credentials</Typography>
            <Grid container spacing={2}>
              {demoUsers.map((u, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => { setUsername(u.username); setPassword('demo123'); }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">{u.role}</Typography>
                      <Typography variant="body2" color="text.secondary">Username: {u.username}</Typography>
                      <Typography variant="body2" color="text.secondary">Password: {u.password}</Typography>
                      <Typography variant="caption" color="primary">{u.description}</Typography>
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
}
