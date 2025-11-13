import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Alert, Stepper, Step, StepLabel, Card, CardContent, Divider
} from '@mui/material';
import { Save, Send, ArrowBack, Map as MapIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import api from '../services/api';

function LocationPicker({ position, setPosition }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <MapContainer
      center={[7.9465, -1.0232]}
      zoom={7}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
}

export default function SubmitSurveyPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [alert, setAlert] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([7.9465, -1.0232]);

  const [surveyData, setSurveyData] = useState({
    parcel_id: '',
    survey_date: new Date().toISOString().split('T')[0],
    instrument_type: 'GPS RTK',
    accuracy_score: '',
    notes: '',
    boundary_points: []
  });

  useEffect(() => {
    api.get('/parcels').then(res => setParcels(res.data.data));
  }, []);

  const steps = ['Select Parcel', 'Record Location', 'Survey Details', 'Review & Submit'];

  const handleNext = () => {
    if (activeStep === 0 && !surveyData.parcel_id) {
      setAlert({ type: 'error', message: 'Please select a parcel' });
      return;
    }
    setAlert(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);
    setAlert(null);
    try {
      const coordinates = JSON.stringify({
        center: { lat: position[0], lng: position[1] },
        boundary_points: surveyData.boundary_points
      });

      await api.post('/surveys', {
        ...surveyData,
        coordinates,
        status: isDraft ? 'draft' : 'submitted'
      });

      setAlert({
        type: 'success',
        message: isDraft ? 'Survey saved as draft' : 'Survey submitted successfully!'
      });

      setTimeout(() => navigate('/my-surveys'), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Survey submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const addBoundaryPoint = () => {
    setSurveyData({
      ...surveyData,
      boundary_points: [
        ...surveyData.boundary_points,
        { lat: position[0], lng: position[1], timestamp: new Date().toISOString() }
      ]
    });
    setAlert({ type: 'success', message: `Boundary point ${surveyData.boundary_points.length + 1} added` });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/surveyor')} sx={{ mr: 2 }}>
          Back to Dashboard
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Submit New Survey
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4 }}>
        {/* Step 1: Select Parcel */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Select Parcel to Survey</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Parcel</InputLabel>
              <Select
                value={surveyData.parcel_id}
                onChange={(e) => setSurveyData({ ...surveyData, parcel_id: e.target.value })}
                label="Parcel"
              >
                {parcels.map((parcel) => (
                  <MenuItem key={parcel.id} value={parcel.id}>
                    {parcel.parcel_id} - {parcel.location} ({parcel.area} hectares)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {surveyData.parcel_id && (
              <Card sx={{ mt: 3, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Selected Parcel Details</Typography>
                  {parcels.find(p => p.id === surveyData.parcel_id) && (
                    <Box mt={1}>
                      <Typography><strong>ID:</strong> {parcels.find(p => p.id === surveyData.parcel_id).parcel_id}</Typography>
                      <Typography><strong>Location:</strong> {parcels.find(p => p.id === surveyData.parcel_id).location}</Typography>
                      <Typography><strong>Area:</strong> {parcels.find(p => p.id === surveyData.parcel_id).area} hectares</Typography>
                      <Typography><strong>Type:</strong> {parcels.find(p => p.id === surveyData.parcel_id).land_type}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Step 2: Record Location */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Record GPS Location</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click on the map to set the center point, then add boundary points by clicking around the perimeter.
            </Typography>

            <Box sx={{ mb: 2 }}>
              <LocationPicker position={position} setPosition={setPosition} />
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  value={position[0].toFixed(6)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  value={position[1].toFixed(6)}
                  disabled
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<MapIcon />}
                onClick={addBoundaryPoint}
                disabled={!position}
              >
                Add Boundary Point ({surveyData.boundary_points.length})
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                {surveyData.boundary_points.length} boundary points recorded
              </Typography>
            </Box>

            {surveyData.boundary_points.length > 0 && (
              <Card sx={{ mt: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle2">Boundary Points</Typography>
                  {surveyData.boundary_points.map((point, index) => (
                    <Typography key={index} variant="caption" display="block">
                      Point {index + 1}: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Step 3: Survey Details */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Survey Details</Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Survey Date"
                  type="date"
                  value={surveyData.survey_date}
                  onChange={(e) => setSurveyData({ ...surveyData, survey_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Instrument Type</InputLabel>
                  <Select
                    value={surveyData.instrument_type}
                    onChange={(e) => setSurveyData({ ...surveyData, instrument_type: e.target.value })}
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
                  label="Estimated Accuracy Score (0-1)"
                  type="number"
                  inputProps={{ min: 0, max: 1, step: 0.01 }}
                  value={surveyData.accuracy_score}
                  onChange={(e) => setSurveyData({ ...surveyData, accuracy_score: e.target.value })}
                  helperText="Estimated accuracy based on instrument and conditions (e.g., 0.95 for 95%)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Survey Notes"
                  multiline
                  rows={4}
                  value={surveyData.notes}
                  onChange={(e) => setSurveyData({ ...surveyData, notes: e.target.value })}
                  placeholder="Add any observations, challenges, or special conditions..."
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 4: Review */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Review Survey Data</Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Parcel</Typography>
                <Typography variant="body1">
                  {parcels.find(p => p.id === surveyData.parcel_id)?.parcel_id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Survey Date</Typography>
                <Typography variant="body1">{surveyData.survey_date}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Instrument</Typography>
                <Typography variant="body1">{surveyData.instrument_type}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Accuracy Score</Typography>
                <Typography variant="body1">
                  {surveyData.accuracy_score ? `${(surveyData.accuracy_score * 100).toFixed(1)}%` : 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Center Point</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Boundary Points</Typography>
                <Typography variant="body1">{surveyData.boundary_points.length} points</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Notes</Typography>
                <Typography variant="body1">{surveyData.notes || 'No notes added'}</Typography>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              Once submitted, this survey will be sent for review by a Lands Officer.
            </Alert>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  Submit Survey
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
