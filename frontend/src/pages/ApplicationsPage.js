import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button, Alert, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Description, CheckCircle, PendingActions, Visibility, Edit } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdating(true);
    setAlert(null);
    try {
      await api.put(`/applications/${appId}`, { status: newStatus });
      setAlert({
        type: 'success',
        message: `Application ${newStatus} successfully`
      });
      fetchApplications();
      setDetailDialogOpen(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Status update failed. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const filteredApps = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const canManageApps = user && (user.role === 'admin' || user.role === 'lands_officer');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'approved': return 'success';
      case 'submitted': return 'info';
      case 'under_review': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Land Applications Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage land title applications
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingActions sx={{ fontSize: 40, color: '#FCD116', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {applications.filter(a => ['approved', 'completed'].includes(a.status)).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Description sx={{ fontSize: 40, color: '#006B3F', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {applications.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Applications Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Application Records</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Application ID</TableCell>
                    <TableCell>Applicant</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Parcel</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {app.application_id}
                          </Typography>
                        </TableCell>
                        <TableCell>{app.applicant_name}</TableCell>
                        <TableCell>{app.application_type}</TableCell>
                        <TableCell>{app.parcel_id}</TableCell>
                        <TableCell>
                          {new Date(app.submitted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={app.status}
                            size="small"
                            color={getStatusColor(app.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(app)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedApp && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Application Details</Typography>
                <Chip
                  label={selectedApp.status}
                  color={getStatusColor(selectedApp.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Application ID</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {selectedApp.application_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body1">{selectedApp.application_type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Applicant</Typography>
                  <Typography variant="body1">{selectedApp.applicant_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Parcel</Typography>
                  <Typography variant="body1">{selectedApp.parcel_id}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography variant="body2">{selectedApp.notes || 'No notes'}</Typography>
                </Grid>
                {selectedApp.reviewer_name && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Reviewed By</Typography>
                    <Typography variant="body2">{selectedApp.reviewer_name}</Typography>
                  </Grid>
                )}
              </Grid>

              {canManageApps && (selectedApp.status === 'submitted' || selectedApp.status === 'under_review') && (
                <Box mt={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Administrative Actions
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              {canManageApps && (selectedApp.status === 'submitted' || selectedApp.status === 'under_review') && (
                <>
                  <Button
                    color="error"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    disabled={updating}
                  >
                    Reject
                  </Button>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                    disabled={updating}
                    startIcon={updating ? <CircularProgress size={20} /> : <CheckCircle />}
                  >
                    {updating ? 'Processing...' : 'Approve'}
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
