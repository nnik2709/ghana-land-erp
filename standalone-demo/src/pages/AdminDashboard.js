import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import api from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  // Mock system data
  const systemHealth = [
    { service: 'Land Registry API', status: 'operational', uptime: 99.9 },
    { service: 'GIS Server', status: 'operational', uptime: 99.8 },
    { service: 'Payment Gateway', status: 'operational', uptime: 99.5 },
    { service: 'Blockchain Node', status: 'degraded', uptime: 98.2 },
    { service: 'SMS Gateway', status: 'operational', uptime: 99.7 },
  ];

  const regionalPerformance = [
    { region: 'Greater Accra', applications: 456, processed: 423, revenue: 15.2 },
    { region: 'Ashanti', applications: 312, processed: 289, revenue: 9.8 },
    { region: 'Western', applications: 187, processed: 176, revenue: 6.2 },
    { region: 'Eastern', applications: 156, processed: 148, revenue: 4.8 },
    { region: 'Central', applications: 134, processed: 128, revenue: 3.9 },
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'Emmanuel Addo', time: '5 min ago' },
    { action: 'Bulk title issuance', user: 'System', time: '15 min ago' },
    { action: 'Payment reconciliation', user: 'Finance Dept', time: '1 hour ago' },
    { action: 'GIS data sync completed', user: 'System', time: '2 hours ago' },
    { action: 'New surveyor certified', user: 'HR Dept', time: '3 hours ago' },
  ];

  const getStatusChip = (status) => {
    const config = {
      operational: { label: 'Operational', color: 'success' },
      degraded: { label: 'Degraded', color: 'warning' },
      down: { label: 'Down', color: 'error' },
    };
    return <Chip label={config[status]?.label || status} color={config[status]?.color || 'default'} size="small" />;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          System Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome, {user?.full_name}! System-wide overview and administration.
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Parcels
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>1.25M</Typography>
              <Typography variant="caption" color="success.main">+3.2% this month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Revenue (YTD)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>GHS 45.6M</Typography>
              <Typography variant="caption" color="success.main">87.7% of target</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>12,456</Typography>
              <Typography variant="caption" color="success.main">+234 this week</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                System Uptime
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>99.8%</Typography>
              <Typography variant="caption" color="text.secondary">Last 30 days</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Button variant="contained" fullWidth onClick={() => navigate('/analytics')} sx={{ py: 1.5 }}>
                    Analytics
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/audit')} sx={{ py: 1.5 }}>
                    Audit Log
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/integrations')} sx={{ py: 1.5 }}>
                    Integrations
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/notifications')} sx={{ py: 1.5 }}>
                    Notifications
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>KPI Summary</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Registration Rate</Typography>
                  <Typography variant="body2" fontWeight="bold">68.6%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={68.6} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Women on Titles</Typography>
                  <Typography variant="body2" fontWeight="bold">42%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={42} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Digital Adoption</Typography>
                  <Typography variant="body2" fontWeight="bold">62%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={62} color="info" sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health & Regional Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>System Health</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Uptime</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {systemHealth.map((service) => (
                      <TableRow key={service.service} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{service.service}</Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(service.status)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color={service.uptime >= 99.5 ? 'success.main' : 'warning.main'}>
                            {service.uptime}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Regional Performance</Typography>
                <Button size="small" onClick={() => navigate('/analytics')}>Details</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Region</TableCell>
                      <TableCell align="right">Apps</TableCell>
                      <TableCell align="right">Done</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regionalPerformance.map((region) => (
                      <TableRow key={region.region} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{region.region}</Typography>
                        </TableCell>
                        <TableCell align="right">{region.applications}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main">{region.processed}</Typography>
                        </TableCell>
                        <TableCell align="right">GHS {region.revenue}M</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent System Activity</Typography>
          {recentActivity.map((activity, index) => (
            <Box key={index}>
              <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{activity.action}</Typography>
                  <Typography variant="caption" color="text.secondary">{activity.user}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
              </Box>
              {index < recentActivity.length - 1 && <Divider />}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* System Alert */}
      <Alert severity="warning">
        <strong>System Notice:</strong> Blockchain node experiencing higher than normal latency. Engineering team is investigating. ETA: 2 hours.
      </Alert>
    </Box>
  );
}
