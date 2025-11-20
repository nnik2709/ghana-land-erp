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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Alert,
  Avatar,
} from '@mui/material';
import api from '../services/api';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data));
  }, []);

  // Mock data for officer
  const pendingApplications = [
    { id: 'APP-2024-1256', applicant: 'Kofi Mensah', type: 'First Registration', region: 'Greater Accra', submitted: '2024-11-18', priority: 'high' },
    { id: 'APP-2024-1255', applicant: 'Ama Adjei', type: 'Title Transfer', region: 'Ashanti', submitted: '2024-11-17', priority: 'medium' },
    { id: 'APP-2024-1254', applicant: 'Kwame Asante', type: 'Subdivision', region: 'Eastern', submitted: '2024-11-16', priority: 'low' },
    { id: 'APP-2024-1253', applicant: 'Efua Owusu', type: 'Lease Registration', region: 'Central', submitted: '2024-11-15', priority: 'medium' },
    { id: 'APP-2024-1252', applicant: 'Yaw Boateng', type: 'Encumbrance', region: 'Western', submitted: '2024-11-14', priority: 'high' },
  ];

  const recentDecisions = [
    { id: 'APP-2024-1251', applicant: 'Grace Tetteh', type: 'First Registration', decision: 'approved', date: '2024-11-18' },
    { id: 'APP-2024-1250', applicant: 'Daniel Ofori', type: 'Title Transfer', decision: 'approved', date: '2024-11-17' },
    { id: 'APP-2024-1249', applicant: 'Sarah Mensah', type: 'Subdivision', decision: 'rejected', date: '2024-11-16' },
    { id: 'APP-2024-1248', applicant: 'James Asare', type: 'Mortgage', decision: 'approved', date: '2024-11-15' },
  ];

  const getPriorityChip = (priority) => {
    const config = {
      high: { label: 'High', color: 'error' },
      medium: { label: 'Medium', color: 'warning' },
      low: { label: 'Low', color: 'default' },
    };
    return <Chip label={config[priority]?.label || priority} color={config[priority]?.color || 'default'} size="small" />;
  };

  const getDecisionChip = (decision) => {
    const config = {
      approved: { label: 'Approved', color: 'success' },
      rejected: { label: 'Rejected', color: 'error' },
      pending: { label: 'Pending', color: 'warning' },
    };
    return <Chip label={config[decision]?.label || decision} color={config[decision]?.color || 'default'} size="small" />;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Officer Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome, {user?.full_name}! Review and process land applications.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Pending Applications
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {stats?.overview?.pending_applications || 23}
              </Typography>
              <Typography variant="caption" color="error.main">5 high priority</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Processed Today
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>8</Typography>
              <Typography variant="caption" color="text.secondary">Target: 10/day</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Avg Processing Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>4.2 days</Typography>
              <Typography variant="caption" color="success.main">-1.5 days vs target</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                This Month
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>156</Typography>
              <Typography variant="caption" color="success.main">+12% vs last month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Button variant="contained" fullWidth onClick={() => navigate('/applications')} sx={{ py: 1.5 }}>
                    Review Apps
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/titles')} sx={{ py: 1.5 }}>
                    Issue Titles
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/disputes')} sx={{ py: 1.5 }}>
                    Disputes
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/tiered-registration')} sx={{ py: 1.5 }}>
                    FFP Registry
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Today's Progress</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Applications</Typography>
                  <Typography variant="body2" fontWeight="bold">8/10</Typography>
                </Box>
                <LinearProgress variant="determinate" value={80} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Titles Issued</Typography>
                  <Typography variant="body2" fontWeight="bold">3/5</Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Applications */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Pending Applications</Typography>
                <Button size="small" onClick={() => navigate('/applications')}>View All</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Application ID</TableCell>
                      <TableCell>Applicant</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingApplications.map((app) => (
                      <TableRow key={app.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{app.id}</Typography>
                        </TableCell>
                        <TableCell>{app.applicant}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{app.region}</TableCell>
                        <TableCell>{getPriorityChip(app.priority)}</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Decisions</Typography>
              {recentDecisions.map((decision, index) => (
                <Box key={decision.id}>
                  <Box sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{decision.id}</Typography>
                      {getDecisionChip(decision.decision)}
                    </Box>
                    <Typography variant="body2" color="text.secondary">{decision.applicant}</Typography>
                    <Typography variant="caption" color="text.secondary">{decision.type} - {decision.date}</Typography>
                  </Box>
                  {index < recentDecisions.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Reminder:</strong> 5 applications are approaching the 7-day processing deadline. Please prioritize high-priority items.
      </Alert>
    </Box>
  );
}
