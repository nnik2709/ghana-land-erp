import React from 'react';
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
} from '@mui/material';

export default function SurveyorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for surveyor
  const recentSurveys = [
    { id: 'SRV-2024-089', parcel: 'PCL-ACC-4521', client: 'Kofi Mensah', status: 'approved', date: '2024-11-18', type: 'Boundary' },
    { id: 'SRV-2024-088', parcel: 'PCL-ASH-3312', client: 'Ama Adjei', status: 'pending', date: '2024-11-17', type: 'Subdivision' },
    { id: 'SRV-2024-087', parcel: 'PCL-EAS-2201', client: 'Kwame Asante', status: 'approved', date: '2024-11-15', type: 'Topographic' },
    { id: 'SRV-2024-086', parcel: 'PCL-ACC-4520', client: 'Efua Owusu', status: 'revision', date: '2024-11-14', type: 'Boundary' },
    { id: 'SRV-2024-085', parcel: 'PCL-CEN-1105', client: 'Yaw Boateng', status: 'approved', date: '2024-11-12', type: 'Cadastral' },
  ];

  const upcomingJobs = [
    { id: 'JOB-001', location: 'Tema Community 25', client: 'Mohammed Ibrahim', date: '2024-11-21', type: 'Boundary Survey' },
    { id: 'JOB-002', location: 'Ashaiman', client: 'Grace Tetteh', date: '2024-11-22', type: 'Site Plan' },
    { id: 'JOB-003', location: 'Madina', client: 'Daniel Ofori', date: '2024-11-25', type: 'Subdivision' },
  ];

  // Monthly performance data
  const monthlyPerformance = [
    { month: 'Aug', surveys: 8, revenue: 6200 },
    { month: 'Sep', surveys: 10, revenue: 7500 },
    { month: 'Oct', surveys: 9, revenue: 7200 },
    { month: 'Nov', surveys: 12, revenue: 8500 },
  ];

  // Equipment and certification status
  const certifications = [
    { name: 'Licensed Land Surveyor', expiry: '2025-06-30', status: 'active' },
    { name: 'GIS Certification', expiry: '2024-12-15', status: 'expiring' },
    { name: 'Drone Operator License', expiry: '2025-03-20', status: 'active' },
  ];

  // Client feedback
  const clientFeedback = [
    { client: 'Kofi Mensah', rating: 5, comment: 'Excellent work on boundary survey', date: '2024-11-18' },
    { client: 'Kwame Asante', rating: 4, comment: 'Professional and timely', date: '2024-11-15' },
    { client: 'Yaw Boateng', rating: 5, comment: 'Very thorough cadastral work', date: '2024-11-12' },
  ];

  const getStatusChip = (status) => {
    const config = {
      approved: { label: 'Approved', color: 'success' },
      pending: { label: 'Pending Review', color: 'warning' },
      revision: { label: 'Needs Revision', color: 'error' },
      draft: { label: 'Draft', color: 'default' },
    };
    return <Chip label={config[status]?.label || status} color={config[status]?.color || 'default'} size="small" />;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Surveyor Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome, {user?.full_name}! Manage your survey submissions and field work.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Submitted Surveys
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>12</Typography>
              <Typography variant="caption" color="success.main">+3 this month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Approved
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>10</Typography>
              <Typography variant="caption" color="text.secondary">83% approval rate</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Pending Review
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>2</Typography>
              <Typography variant="caption" color="text.secondary">Avg. 3 day review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                This Month Earnings
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>GHS 8,500</Typography>
              <Typography variant="caption" color="success.main">+12% vs last month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Notifications */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Button variant="contained" fullWidth onClick={() => navigate('/submit-survey')} sx={{ py: 1.5 }}>
                    Submit Survey
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/my-surveys')} sx={{ py: 1.5 }}>
                    My Surveys
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/parcels')} sx={{ py: 1.5 }}>
                    View Parcels
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/gis-demo')} sx={{ py: 1.5 }}>
                    GIS Platform
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Approval Rate</Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 600 }}>83%</Typography>
                <LinearProgress variant="determinate" value={83} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  10 of 12 surveys approved
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Surveys & Upcoming Jobs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Surveys</Typography>
                <Button size="small" onClick={() => navigate('/my-surveys')}>View All</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Survey ID</TableCell>
                      <TableCell>Parcel</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSurveys.map((survey) => (
                      <TableRow key={survey.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{survey.id}</Typography>
                        </TableCell>
                        <TableCell>{survey.parcel}</TableCell>
                        <TableCell>{survey.type}</TableCell>
                        <TableCell>{survey.date}</TableCell>
                        <TableCell>{getStatusChip(survey.status)}</TableCell>
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
              <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Field Work</Typography>
              {upcomingJobs.map((job, index) => (
                <Box key={job.id}>
                  <Box sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{job.type}</Typography>
                    <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption">{job.client}</Typography>
                      <Chip label={job.date} size="small" variant="outlined" />
                    </Box>
                  </Box>
                  {index < upcomingJobs.length - 1 && <Divider />}
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/submit-survey')}>
                Add New Job
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance & Certifications */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Monthly Performance</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {monthlyPerformance.map((month) => (
                  <Box key={month.month}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{month.month}</Typography>
                      <Typography variant="body2" fontWeight="bold">{month.surveys} surveys</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(month.surveys / 15) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      GHS {month.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Certifications</Typography>
              {certifications.map((cert, index) => (
                <Box key={cert.name}>
                  <Box sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{cert.name}</Typography>
                      <Chip
                        label={cert.status === 'active' ? 'Active' : 'Expiring Soon'}
                        color={cert.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Expires: {cert.expiry}
                    </Typography>
                  </Box>
                  {index < certifications.length - 1 && <Divider />}
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }} size="small">
                Renew Certifications
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Client Feedback</Typography>
              {clientFeedback.map((feedback, index) => (
                <Box key={index}>
                  <Box sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{feedback.client}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.25 }}>
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: i < feedback.rating ? 'warning.main' : 'grey.300',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      "{feedback.comment}"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{feedback.date}</Typography>
                  </Box>
                  {index < clientFeedback.length - 1 && <Divider />}
                </Box>
              ))}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>4.7</Typography>
                <Typography variant="caption" color="text.secondary">Average Rating</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alert for revision needed */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <strong>Action Required:</strong> Survey SRV-2024-086 needs revision. Please update the boundary coordinates and resubmit.
      </Alert>

      {/* Additional Info Alert */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <strong>Reminder:</strong> Your GIS Certification expires on December 15, 2024. Please renew to maintain your licensed surveyor status.
      </Alert>
    </Box>
  );
}
