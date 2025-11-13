import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { Description, CheckCircle, PendingActions, Cancel, Visibility, Download } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function TitlesPage() {
  const { user } = useAuth();
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      const response = await api.get('/titles');
      setTitles(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching titles:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (title) => {
    setSelectedTitle(title);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (titleId, newStatus) => {
    setUpdating(true);
    setAlert(null);
    try {
      await api.put(`/titles/${titleId}`, { status: newStatus });
      setAlert({
        type: 'success',
        message: `Title ${newStatus === 'issued' ? 'approved' : 'rejected'} successfully`
      });
      fetchTitles();
      setDetailDialogOpen(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Status update failed. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadPDF = async (titleId, certificateNumber) => {
    try {
      const response = await api.get(`/titles/${titleId}/download-pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certificateNumber.replace(/\//g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setAlert({
        type: 'success',
        message: 'PDF certificate downloaded successfully'
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      setAlert({
        type: 'error',
        message: 'Failed to download PDF certificate. Please try again.'
      });
    }
  };

  const filteredTitles = filterStatus === 'all'
    ? titles
    : titles.filter(t => t.status === filterStatus);

  const canManageTitles = user && (user.role === 'admin' || user.role === 'lands_officer');

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Land Titles Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage land ownership titles
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
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {titles.filter(t => t.status === 'issued').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issued Titles
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
                <PendingActions sx={{ fontSize: 40, color: '#FCD116', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {titles.filter(t => t.status === 'pending').length}
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
                <Description sx={{ fontSize: 40, color: '#006B3F', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {titles.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Titles
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Titles Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Title Records</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter Status"
              >
                <MenuItem value="all">All Titles</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="issued">Issued</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
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
                    <TableCell>Title Number</TableCell>
                    <TableCell>Parcel ID</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTitles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {filterStatus === 'all'
                          ? 'No titles recorded yet.'
                          : `No ${filterStatus} titles found.`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTitles.map((title) => (
                      <TableRow key={title.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {title.title_number}
                          </Typography>
                        </TableCell>
                        <TableCell>Parcel #{title.parcel_id}</TableCell>
                        <TableCell>User #{title.owner_id}</TableCell>
                        <TableCell>
                          {title.issue_date
                            ? new Date(title.issue_date).toLocaleDateString()
                            : 'Not issued'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={title.status}
                            size="small"
                            color={getStatusColor(title.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(title)}
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

      {/* Title Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTitle && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Title Details</Typography>
                <Chip
                  label={selectedTitle.status}
                  color={getStatusColor(selectedTitle.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Title Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {selectedTitle.title_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Parcel ID
                  </Typography>
                  <Typography variant="body1">
                    Parcel #{selectedTitle.parcel_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Owner ID
                  </Typography>
                  <Typography variant="body1">
                    User #{selectedTitle.owner_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Issue Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedTitle.issue_date
                      ? new Date(selectedTitle.issue_date).toLocaleDateString()
                      : 'Not issued yet'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedTitle.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              {canManageTitles && selectedTitle.status === 'pending' && (
                <Box mt={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Administrative Actions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Approve or reject this title application
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              {selectedTitle.status === 'issued' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download />}
                  onClick={() => handleDownloadPDF(selectedTitle.id, selectedTitle.title_number)}
                >
                  Download PDF Certificate
                </Button>
              )}
              {canManageTitles && selectedTitle.status === 'pending' && (
                <>
                  <Button
                    color="error"
                    onClick={() => handleUpdateStatus(selectedTitle.id, 'rejected')}
                    disabled={updating}
                    startIcon={<Cancel />}
                  >
                    Reject
                  </Button>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => handleUpdateStatus(selectedTitle.id, 'issued')}
                    disabled={updating}
                    startIcon={updating ? <CircularProgress size={20} /> : <CheckCircle />}
                  >
                    {updating ? 'Processing...' : 'Approve & Issue'}
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
