import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  TextField, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { ArrowBack, Add, Edit, Visibility, Delete } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function MySurveysPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await api.get('/surveys');
      setSurveys(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setLoading(false);
    }
  };

  const handleView = (survey) => {
    setSelectedSurvey(survey);
    setDetailDialogOpen(true);
  };

  const handleEdit = (survey) => {
    setSelectedSurvey(survey);
    setEditData({
      survey_date: survey.survey_date,
      instrument_type: survey.instrument_type,
      accuracy_score: survey.accuracy_score,
      notes: survey.notes || ''
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/surveys/${selectedSurvey.id}`, editData);
      setAlert({ type: 'success', message: 'Survey updated successfully' });
      setEditDialogOpen(false);
      fetchSurveys();
    } catch (error) {
      setAlert({ type: 'error', message: 'Update failed. Please try again.' });
    }
  };

  const handleDelete = async (surveyId) => {
    if (window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      try {
        await api.delete(`/surveys/${surveyId}`);
        setAlert({ type: 'success', message: 'Survey deleted successfully' });
        fetchSurveys();
      } catch (error) {
        setAlert({ type: 'error', message: 'Delete failed. Please try again.' });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'submitted': return 'info';
      case 'draft': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const canEdit = (survey) => {
    return survey.status === 'draft' || survey.status === 'rejected';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/surveyor')} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            My Surveys
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/submit-survey')}
        >
          New Survey
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">{surveys.length}</Typography>
            <Typography variant="caption" color="text.secondary">Total Surveys</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" color="success.main">
              {surveys.filter(s => s.status === 'approved').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Approved</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h4" color="info.main">
              {surveys.filter(s => s.status === 'submitted').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Under Review</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" color="warning.main">
              {surveys.filter(s => s.status === 'draft').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Drafts</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Surveys Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Survey ID</TableCell>
                <TableCell>Parcel</TableCell>
                <TableCell>Survey Date</TableCell>
                <TableCell>Instrument</TableCell>
                <TableCell>Accuracy</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No surveys yet. Click "New Survey" to submit your first survey.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {survey.survey_id}
                      </Typography>
                    </TableCell>
                    <TableCell>{survey.parcel_id || 'N/A'}</TableCell>
                    <TableCell>{new Date(survey.survey_date).toLocaleDateString()}</TableCell>
                    <TableCell>{survey.instrument_type}</TableCell>
                    <TableCell>
                      {survey.accuracy_score ? `${(survey.accuracy_score * 100).toFixed(1)}%` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={survey.status}
                        size="small"
                        color={getStatusColor(survey.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleView(survey)}
                        >
                          View
                        </Button>
                        {canEdit(survey) && (
                          <>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => handleEdit(survey)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleDelete(survey.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedSurvey && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Survey Details</Typography>
                <Chip label={selectedSurvey.status} color={getStatusColor(selectedSurvey.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Survey ID</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {selectedSurvey.survey_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Parcel</Typography>
                  <Typography variant="body1">{selectedSurvey.parcel_id || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Survey Date</Typography>
                  <Typography variant="body1">
                    {new Date(selectedSurvey.survey_date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Instrument</Typography>
                  <Typography variant="body1">{selectedSurvey.instrument_type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Accuracy Score</Typography>
                  <Typography variant="body1">
                    {selectedSurvey.accuracy_score
                      ? `${(selectedSurvey.accuracy_score * 100).toFixed(1)}%`
                      : 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Submitted</Typography>
                  <Typography variant="body1">
                    {new Date(selectedSurvey.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">GPS Coordinates</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                    {selectedSurvey.coordinates || 'No coordinates recorded'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography variant="body2">{selectedSurvey.notes || 'No notes'}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              {canEdit(selectedSurvey) && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => {
                    setDetailDialogOpen(false);
                    handleEdit(selectedSurvey);
                  }}
                >
                  Edit Survey
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Survey</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Survey Date"
                type="date"
                value={editData.survey_date || ''}
                onChange={(e) => setEditData({ ...editData, survey_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Instrument Type</InputLabel>
                <Select
                  value={editData.instrument_type || ''}
                  onChange={(e) => setEditData({ ...editData, instrument_type: e.target.value })}
                  label="Instrument Type"
                >
                  <MenuItem value="GPS RTK">GPS RTK (High Accuracy)</MenuItem>
                  <MenuItem value="Total Station">Total Station</MenuItem>
                  <MenuItem value="Drone Mapping">Drone Photogrammetry</MenuItem>
                  <MenuItem value="GPS Standard">GPS Standard</MenuItem>
                  <MenuItem value="Theodolite">Theodolite</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Accuracy Score (0-1)"
                type="number"
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                value={editData.accuracy_score || ''}
                onChange={(e) => setEditData({ ...editData, accuracy_score: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={editData.notes || ''}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
