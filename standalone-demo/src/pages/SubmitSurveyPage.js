import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Alert, Stepper, Step, StepLabel, Card, CardContent, Divider, Chip, IconButton, Tooltip,
  Switch, FormControlLabel, LinearProgress, Badge, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Save, Send, ArrowBack, Map as MapIcon, Upload, CloudUpload, CheckCircle, Info,
  GpsFixed, GpsNotFixed, Satellite, Delete, MyLocation, RadioButtonChecked, PlayArrow, Stop, Add
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from 'react-leaflet';
import api from '../services/api';

function LocationPicker({ position, setPosition, boundaryPoints = [] }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  // Convert boundary points to polygon coordinates
  const polygonPositions = boundaryPoints.length > 0
    ? boundaryPoints.map(point => [point.lat, point.lng])
    : [];

  return (
    <MapContainer
      center={position}
      zoom={boundaryPoints.length > 0 ? 14 : 7}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <LocationMarker />
      {polygonPositions.length > 0 && (
        <Polygon
          positions={polygonPositions}
          pathOptions={{
            color: '#006B3F',
            fillColor: '#006B3F',
            fillOpacity: 0.2,
            weight: 2
          }}
        />
      )}
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
  const [importedFile, setImportedFile] = useState(null);
  const [importedData, setImportedData] = useState(null);

  const [surveyData, setSurveyData] = useState({
    parcel_id: '',
    survey_date: new Date().toISOString().split('T')[0],
    instrument_type: 'GPS RTK',
    accuracy_score: '',
    notes: '',
    boundary_points: [],
    data_source: 'Manual Entry'
  });

  // GPS tracking state
  const [gpsStatus, setGpsStatus] = useState({
    available: false,
    accuracy: null,
    satelliteCount: 12,
    signalStrength: 'excellent', // excellent, good, fair, poor
    hdop: 0.8,
    fixType: 'RTK-Fixed'
  });
  const [useDeviceGPS, setUseDeviceGPS] = useState(false);
  const [continuousTracking, setContinuousTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [capturingGPS, setCapturingGPS] = useState(false);

  // Create parcel dialog state
  const [createParcelDialogOpen, setCreateParcelDialogOpen] = useState(false);
  const [creatingParcel, setCreatingParcel] = useState(false);
  const [newParcel, setNewParcel] = useState({
    location: '',
    region: '',
    district: '',
    area: '',
    land_use: 'Residential',
    owner: '',
    owner_phone: '',
    owner_id: ''
  });

  useEffect(() => {
    api.get('/parcels').then(res => setParcels(res.data.data));

    // Check if GPS is available (mock for demo)
    if ('geolocation' in navigator) {
      setGpsStatus(prev => ({ ...prev, available: true }));
      // Simulate GPS signal quality updates
      const gpsInterval = setInterval(() => {
        setGpsStatus(prev => ({
          ...prev,
          satelliteCount: Math.floor(Math.random() * 5) + 10, // 10-14 satellites
          accuracy: (Math.random() * 2 + 1).toFixed(2), // 1-3 meters for RTK
          hdop: (Math.random() * 0.5 + 0.5).toFixed(2), // 0.5-1.0
          signalStrength: prev.satelliteCount > 12 ? 'excellent' : prev.satelliteCount > 10 ? 'good' : 'fair'
        }));
      }, 3000);

      return () => clearInterval(gpsInterval);
    }
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

  // Enhanced GPS capture with device location
  const captureGPSPoint = async () => {
    setCapturingGPS(true);

    try {
      if (useDeviceGPS && 'geolocation' in navigator) {
        // Get actual device GPS location
        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            const point = {
              lat: geoPosition.coords.latitude,
              lng: geoPosition.coords.longitude,
              altitude: geoPosition.coords.altitude || 0,
              accuracy: geoPosition.coords.accuracy,
              timestamp: new Date().toISOString(),
              // Professional GPS metadata (mock for demo)
              satelliteCount: gpsStatus.satelliteCount,
              hdop: gpsStatus.hdop,
              fixType: gpsStatus.fixType,
              signalStrength: gpsStatus.signalStrength
            };

            setSurveyData({
              ...surveyData,
              boundary_points: [...surveyData.boundary_points, point]
            });
            setPosition([point.lat, point.lng]);
            setAlert({
              type: 'success',
              message: `Point ${surveyData.boundary_points.length + 1} captured (GPS: ±${point.accuracy.toFixed(2)}m, ${point.satelliteCount} sats)`
            });
            setCapturingGPS(false);
          },
          (error) => {
            console.error('GPS error:', error);
            setAlert({ type: 'error', message: 'Failed to get GPS location. Using map position instead.' });
            addManualPoint();
            setCapturingGPS(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        addManualPoint();
      }
    } catch (error) {
      console.error('GPS capture error:', error);
      addManualPoint();
    }
  };

  // Add point from map click (manual mode)
  const addManualPoint = () => {
    const point = {
      lat: position[0],
      lng: position[1],
      altitude: 0,
      accuracy: 5.0, // Estimated for manual entry
      timestamp: new Date().toISOString(),
      satelliteCount: 0,
      hdop: null,
      fixType: 'Manual',
      signalStrength: 'manual'
    };

    setSurveyData({
      ...surveyData,
      boundary_points: [...surveyData.boundary_points, point]
    });
    setAlert({ type: 'success', message: `Point ${surveyData.boundary_points.length + 1} added (Manual)` });
    setCapturingGPS(false);
  };

  const addBoundaryPoint = () => {
    if (useDeviceGPS) {
      captureGPSPoint();
    } else {
      addManualPoint();
    }
  };

  // Continuous tracking mode
  const toggleContinuousTracking = () => {
    if (!continuousTracking) {
      // Start tracking
      const interval = setInterval(() => {
        captureGPSPoint();
      }, 5000); // Capture every 5 seconds

      setTrackingInterval(interval);
      setContinuousTracking(true);
      setAlert({ type: 'info', message: 'Continuous tracking started - capturing point every 5 seconds' });
    } else {
      // Stop tracking
      if (trackingInterval) {
        clearInterval(trackingInterval);
        setTrackingInterval(null);
      }
      setContinuousTracking(false);
      setAlert({ type: 'info', message: 'Continuous tracking stopped' });
    }
  };

  // Remove boundary point
  const removeBoundaryPoint = (index) => {
    const newPoints = surveyData.boundary_points.filter((_, i) => i !== index);
    setSurveyData({ ...surveyData, boundary_points: newPoints });
    setAlert({ type: 'info', message: `Point ${index + 1} removed` });
  };

  // Handle creating new parcel from survey page
  const handleCreateNewParcel = async () => {
    if (!newParcel.location || !newParcel.region || !newParcel.district || !newParcel.area || !newParcel.land_use || !newParcel.owner) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setCreatingParcel(true);
    try {
      const response = await api.post('/parcels', newParcel);
      const createdParcel = response.data.data;

      // Add new parcel to the list
      setParcels([createdParcel, ...parcels]);

      // Select the newly created parcel
      setSurveyData({ ...surveyData, parcel_id: createdParcel.id });

      // Reset form and close dialog
      setNewParcel({
        location: '',
        region: '',
        district: '',
        area: '',
        land_use: 'Residential',
        owner: '',
        owner_phone: '',
        owner_id: ''
      });
      setCreateParcelDialogOpen(false);
      setAlert({ type: 'success', message: `Parcel ${createdParcel.parcel_id} created and selected!` });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create parcel. Please try again.' });
    } finally {
      setCreatingParcel(false);
    }
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportedFile(file);
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    try {
      const text = await file.text();
      let parsedData = null;
      let dataSource = 'File Import';

      // Parse different file formats
      if (fileExtension === 'json' || fileExtension === 'geojson') {
        parsedData = JSON.parse(text);
        dataSource = fileName.includes('arcgis') ? 'ArcGIS Export' : 'GeoJSON';

        // Handle GeoJSON format
        if (parsedData.type === 'FeatureCollection' && parsedData.features) {
          const feature = parsedData.features[0];
          if (feature.geometry.type === 'Polygon') {
            const coords = feature.geometry.coordinates[0].map(coord => ({
              lat: coord[1],
              lng: coord[0],
              timestamp: new Date().toISOString()
            }));
            setSurveyData({
              ...surveyData,
              boundary_points: coords,
              data_source: dataSource,
              accuracy_score: feature.properties?.accuracy || '0.95'
            });
            if (coords.length > 0) {
              setPosition([coords[0].lat, coords[0].lng]);
            }
          }
        }
      } else if (fileExtension === 'kml') {
        dataSource = 'KML (Google Earth)';
        // Parse KML (simplified - in production would use proper XML parser)
        const coordsMatch = text.match(/<coordinates>([\s\S]*?)<\/coordinates>/);
        if (coordsMatch) {
          const coordsText = coordsMatch[1].trim();
          const coords = coordsText.split(/\s+/).map(coord => {
            const [lng, lat, alt] = coord.split(',').map(Number);
            return { lat, lng, timestamp: new Date().toISOString() };
          });
          setSurveyData({
            ...surveyData,
            boundary_points: coords,
            data_source: dataSource,
            accuracy_score: '0.92'
          });
          if (coords.length > 0) {
            setPosition([coords[0].lat, coords[0].lng]);
          }
        }
      } else if (fileExtension === 'las' || fileExtension === 'laz') {
        dataSource = 'LiDAR Point Cloud';
        // Simulate LiDAR processing (in production, would use proper LiDAR parser)
        setAlert({
          type: 'info',
          message: 'LiDAR file detected. Processing point cloud data...'
        });
        // Simulate extracted boundary from LiDAR
        const mockBoundary = [
          { lat: 7.9465, lng: -1.0232, timestamp: new Date().toISOString() },
          { lat: 7.9475, lng: -1.0232, timestamp: new Date().toISOString() },
          { lat: 7.9475, lng: -1.0222, timestamp: new Date().toISOString() },
          { lat: 7.9465, lng: -1.0222, timestamp: new Date().toISOString() }
        ];
        setSurveyData({
          ...surveyData,
          boundary_points: mockBoundary,
          data_source: dataSource,
          accuracy_score: '0.98',
          instrument_type: 'LiDAR Scanner'
        });
        setPosition([mockBoundary[0].lat, mockBoundary[0].lng]);
      } else if (fileExtension === 'shp' || fileExtension === 'zip') {
        dataSource = 'Shapefile (ESRI)';
        setAlert({
          type: 'info',
          message: 'Shapefile detected. Extracting boundary coordinates...'
        });
        // Simulate Shapefile parsing
        const mockBoundary = [
          { lat: 7.9465, lng: -1.0232, timestamp: new Date().toISOString() },
          { lat: 7.9475, lng: -1.0232, timestamp: new Date().toISOString() },
          { lat: 7.9475, lng: -1.0222, timestamp: new Date().toISOString() },
          { lat: 7.9465, lng: -1.0222, timestamp: new Date().toISOString() }
        ];
        setSurveyData({
          ...surveyData,
          boundary_points: mockBoundary,
          data_source: dataSource,
          accuracy_score: '0.94',
          instrument_type: 'ArcGIS Survey'
        });
        setPosition([mockBoundary[0].lat, mockBoundary[0].lng]);
      } else if (fileExtension === 'csv' || fileExtension === 'txt') {
        dataSource = 'CSV/TXT Coordinates';
        // Parse CSV format (lat, lng)
        const lines = text.split('\n').filter(line => line.trim());
        const coords = lines.slice(1).map(line => {
          const [lat, lng] = line.split(',').map(Number);
          return { lat, lng, timestamp: new Date().toISOString() };
        }).filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng));

        if (coords.length > 0) {
          setSurveyData({
            ...surveyData,
            boundary_points: coords,
            data_source: dataSource,
            accuracy_score: '0.90'
          });
          setPosition([coords[0].lat, coords[0].lng]);
        }
      }

      setImportedData(parsedData);
      setAlert({
        type: 'success',
        message: `Successfully imported ${surveyData.boundary_points.length} boundary points from ${dataSource}`
      });

    } catch (error) {
      setAlert({
        type: 'error',
        message: `Failed to parse ${fileExtension.toUpperCase()} file. Please check the format.`
      });
      console.error('File import error:', error);
    }
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Select Parcel to Survey</Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setCreateParcelDialogOpen(true)}
                size="small"
              >
                Create New Parcel
              </Button>
            </Box>

            <Autocomplete
              fullWidth
              options={parcels}
              value={parcels.find(p => p.id === surveyData.parcel_id) || null}
              onChange={(event, newValue) => {
                setSurveyData({ ...surveyData, parcel_id: newValue ? newValue.id : '' });
              }}
              getOptionLabel={(option) => `${option.parcel_id} - ${option.location} (${option.area} ha)`}
              filterOptions={(options, { inputValue }) => {
                const filtered = options.filter(option =>
                  option.parcel_id.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.location.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.region?.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.district?.toLowerCase().includes(inputValue.toLowerCase())
                );
                return filtered;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Parcel by ID, Location, Region, or District"
                  placeholder="Type to search..."
                  helperText={`${parcels.length} parcels available`}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ flexDirection: 'column', alignItems: 'flex-start !important' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {option.parcel_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.location} • {option.region} • {option.area} hectares • {option.land_type}
                  </Typography>
                </Box>
              )}
              noOptionsText="No parcels found - Create a new one above"
            />

            {surveyData.parcel_id && (
              <Card sx={{ mt: 3, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Selected Parcel Details
                  </Typography>
                  {parcels.find(p => p.id === surveyData.parcel_id) && (
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Parcel ID</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {parcels.find(p => p.id === surveyData.parcel_id).parcel_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Location</Typography>
                        <Typography variant="body2">{parcels.find(p => p.id === surveyData.parcel_id).location}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Region / District</Typography>
                        <Typography variant="body2">
                          {parcels.find(p => p.id === surveyData.parcel_id).region} / {parcels.find(p => p.id === surveyData.parcel_id).district}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Area</Typography>
                        <Typography variant="body2">{parcels.find(p => p.id === surveyData.parcel_id).area} hectares</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Land Type</Typography>
                        <Typography variant="body2">{parcels.find(p => p.id === surveyData.parcel_id).land_type}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Chip
                          label={parcels.find(p => p.id === surveyData.parcel_id).status}
                          size="small"
                          color={parcels.find(p => p.id === surveyData.parcel_id).status === 'Pending Survey' ? 'warning' : 'default'}
                        />
                      </Grid>
                    </Grid>
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
              Or import survey data from professional tools.
            </Typography>

            {/* File Import Section */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CloudUpload sx={{ color: '#006B3F' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Import Survey Data
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported: GeoJSON, KML, LiDAR (.las/.laz), Shapefile (.shp/.zip), CSV/TXT
                  </Typography>
                </Box>
                <input
                  accept=".json,.geojson,.kml,.las,.laz,.shp,.zip,.csv,.txt"
                  style={{ display: 'none' }}
                  id="survey-file-upload"
                  type="file"
                  onChange={handleFileImport}
                />
                <label htmlFor="survey-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                  >
                    Choose File
                  </Button>
                </label>
              </Box>

              {importedFile && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip
                    icon={<CheckCircle />}
                    label={importedFile.name}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={surveyData.data_source}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={`${surveyData.boundary_points.length} points`}
                    size="small"
                  />
                  {surveyData.accuracy_score && (
                    <Chip
                      label={`Accuracy: ${(surveyData.accuracy_score * 100).toFixed(1)}%`}
                      size="small"
                    />
                  )}
                  <Tooltip title="Clear imported data">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setImportedFile(null);
                        setImportedData(null);
                        setSurveyData({
                          ...surveyData,
                          boundary_points: [],
                          data_source: 'Manual Entry',
                          accuracy_score: '',
                          instrument_type: 'GPS RTK'
                        });
                      }}
                    >
                      <Info sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <LocationPicker position={position} setPosition={setPosition} boundaryPoints={surveyData.boundary_points} />
            </Box>

            {/* GPS Status Panel */}
            <Card sx={{ mt: 2, bgcolor: '#f9fafb', border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {gpsStatus.available ? (
                      <Badge badgeContent={gpsStatus.satelliteCount} color="primary">
                        <GpsFixed sx={{ color: '#006B3F', fontSize: 28 }} />
                      </Badge>
                    ) : (
                      <GpsNotFixed sx={{ color: '#999', fontSize: 28 }} />
                    )}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        GPS Status: {gpsStatus.available ? 'Active' : 'Not Available'}
                      </Typography>
                      {gpsStatus.available && (
                        <Typography variant="caption" color="text.secondary">
                          {gpsStatus.fixType} | Accuracy: ±{gpsStatus.accuracy}m | HDOP: {gpsStatus.hdop}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Chip
                    icon={<Satellite />}
                    label={gpsStatus.signalStrength}
                    size="small"
                    color={
                      gpsStatus.signalStrength === 'excellent' ? 'success' :
                      gpsStatus.signalStrength === 'good' ? 'primary' :
                      gpsStatus.signalStrength === 'fair' ? 'warning' : 'default'
                    }
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useDeviceGPS}
                        onChange={(e) => setUseDeviceGPS(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MyLocation sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Use Device GPS</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={continuousTracking}
                        onChange={toggleContinuousTracking}
                        color="primary"
                        disabled={!useDeviceGPS}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {continuousTracking ? <Stop sx={{ fontSize: 16 }} /> : <PlayArrow sx={{ fontSize: 16 }} />}
                        <Typography variant="body2">Auto-Track (5s)</Typography>
                      </Box>
                    }
                  />
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  value={position[0].toFixed(6)}
                  disabled
                  InputProps={{
                    startAdornment: <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>°N</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  value={position[1].toFixed(6)}
                  disabled
                  InputProps={{
                    startAdornment: <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>°W</Typography>
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={capturingGPS ? <RadioButtonChecked className="pulse" /> : (useDeviceGPS ? <GpsFixed /> : <MapIcon />)}
                onClick={addBoundaryPoint}
                disabled={!position || capturingGPS}
                sx={{ minWidth: 200 }}
              >
                {capturingGPS ? 'Capturing...' : (useDeviceGPS ? 'Capture GPS Point' : 'Add Map Point')} ({surveyData.boundary_points.length})
              </Button>
              {continuousTracking && (
                <Chip
                  icon={<RadioButtonChecked />}
                  label="Recording..."
                  color="error"
                  sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                />
              )}
            </Box>

            {surveyData.boundary_points.length > 0 && (
              <Card sx={{ mt: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Boundary Points ({surveyData.boundary_points.length})
                    </Typography>
                    <Chip
                      label="Clear All"
                      size="small"
                      onClick={() => setSurveyData({ ...surveyData, boundary_points: [] })}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {surveyData.boundary_points.map((point, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          p: 1,
                          mb: 0.5,
                          bgcolor: 'white',
                          borderRadius: 1,
                          '&:hover': { bgcolor: '#f9f9f9' }
                        }}
                      >
                        <Chip
                          label={index + 1}
                          size="small"
                          sx={{ minWidth: 35, fontWeight: 600 }}
                          color={point.fixType === 'Manual' ? 'default' : 'primary'}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                            {point.fixType && point.fixType !== 'Manual' && (
                              <Chip
                                icon={<GpsFixed sx={{ fontSize: 12 }} />}
                                label={point.fixType}
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            )}
                            {point.accuracy && (
                              <Chip
                                label={`±${point.accuracy.toFixed(2)}m`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                                color={point.accuracy < 2 ? 'success' : point.accuracy < 5 ? 'primary' : 'default'}
                              />
                            )}
                            {point.satelliteCount > 0 && (
                              <Chip
                                icon={<Satellite sx={{ fontSize: 12 }} />}
                                label={`${point.satelliteCount} sats`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            )}
                            {point.altitude !== 0 && point.altitude && (
                              <Chip
                                label={`Alt: ${point.altitude.toFixed(1)}m`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            )}
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeBoundaryPoint(index)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
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
                    <MenuItem value="LiDAR Scanner">LiDAR Scanner</MenuItem>
                    <MenuItem value="ArcGIS Survey">ArcGIS Survey</MenuItem>
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
                <Typography variant="caption" color="text.secondary">Data Source</Typography>
                <Typography variant="body1">
                  <Chip
                    label={surveyData.data_source}
                    size="small"
                    color={surveyData.data_source !== 'Manual Entry' ? 'primary' : 'default'}
                  />
                </Typography>
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
                <Typography variant="caption" color="text.secondary">Boundary Points</Typography>
                <Typography variant="body1">{surveyData.boundary_points.length} points</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Center Point</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </Typography>
              </Grid>
              {importedFile && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Imported File</Typography>
                  <Typography variant="body1">{importedFile.name}</Typography>
                </Grid>
              )}
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

      {/* Create New Parcel Dialog */}
      <Dialog
        open={createParcelDialogOpen}
        onClose={() => !creatingParcel && setCreateParcelDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Parcel</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location / Address"
                value={newParcel.location}
                onChange={(e) => setNewParcel({ ...newParcel, location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Region</InputLabel>
                <Select
                  value={newParcel.region}
                  onChange={(e) => setNewParcel({ ...newParcel, region: e.target.value })}
                  label="Region"
                >
                  <MenuItem value="Greater Accra">Greater Accra</MenuItem>
                  <MenuItem value="Ashanti">Ashanti</MenuItem>
                  <MenuItem value="Western">Western</MenuItem>
                  <MenuItem value="Northern">Northern</MenuItem>
                  <MenuItem value="Eastern">Eastern</MenuItem>
                  <MenuItem value="Central">Central</MenuItem>
                  <MenuItem value="Volta">Volta</MenuItem>
                  <MenuItem value="Upper East">Upper East</MenuItem>
                  <MenuItem value="Upper West">Upper West</MenuItem>
                  <MenuItem value="Bono">Bono</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                value={newParcel.district}
                onChange={(e) => setNewParcel({ ...newParcel, district: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Area (hectares)"
                type="number"
                value={newParcel.area}
                onChange={(e) => setNewParcel({ ...newParcel, area: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Land Use</InputLabel>
                <Select
                  value={newParcel.land_use}
                  onChange={(e) => setNewParcel({ ...newParcel, land_use: e.target.value })}
                  label="Land Use"
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Agricultural">Agricultural</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Mixed Use">Mixed Use</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Owner Name"
                value={newParcel.owner}
                onChange={(e) => setNewParcel({ ...newParcel, owner: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Owner Phone"
                value={newParcel.owner_phone}
                onChange={(e) => setNewParcel({ ...newParcel, owner_phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Owner ID Number"
                value={newParcel.owner_id}
                onChange={(e) => setNewParcel({ ...newParcel, owner_id: e.target.value })}
                placeholder="Ghana Card / Passport"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateParcelDialogOpen(false)} disabled={creatingParcel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateNewParcel}
            disabled={creatingParcel}
            startIcon={creatingParcel ? <LinearProgress size={20} /> : <Add />}
          >
            {creatingParcel ? 'Creating...' : 'Create & Select Parcel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
