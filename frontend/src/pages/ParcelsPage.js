import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { LocationOn, Landscape, CheckCircle, Description, Map as MapIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';

// Fix Leaflet default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function ParcelsPage() {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/parcels').then(res => setParcels(res.data.data));
  }, []);

  const handleViewDetails = async (parcelId) => {
    setLoading(true);
    setError(null);
    setDetailsOpen(true);

    try {
      const response = await api.get(`/parcels/${parcelId}`);
      setSelectedParcel(response.data.data);
    } catch (err) {
      setError('Failed to load parcel details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDetailsOpen(false);
    setSelectedParcel(null);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
        Land Parcels
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcel ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Area (hectares)</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parcels.map(parcel => (
              <TableRow key={parcel.id}>
                <TableCell>{parcel.parcel_id}</TableCell>
                <TableCell>{parcel.location}, {parcel.district}</TableCell>
                <TableCell>{parcel.area}</TableCell>
                <TableCell>{parcel.land_type}</TableCell>
                <TableCell>
                  <Chip
                    label={parcel.status}
                    color={parcel.status === 'registered' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewDetails(parcel.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <LocationOn sx={{ mr: 1, color: '#006B3F' }} />
            Parcel Details
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : selectedParcel ? (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  <Landscape sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Parcel ID</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedParcel.parcel_id}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedParcel.status}
                  color={selectedParcel.status === 'registered' ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Region</Typography>
                <Typography variant="body1">{selectedParcel.region}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">District</Typography>
                <Typography variant="body1">{selectedParcel.district}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{selectedParcel.location}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Area</Typography>
                <Typography variant="body1">{selectedParcel.area} hectares</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Land Type</Typography>
                <Typography variant="body1">{selectedParcel.land_type}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">GPS Coordinates</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {selectedParcel.coordinates || 'Not available'}
                </Typography>
              </Grid>

              {/* Map Display */}
              {selectedParcel.coordinates && (() => {
                try {
                  const coords = JSON.parse(selectedParcel.coordinates);
                  const center = [coords.lat || 5.6037, coords.lng || -0.1870];

                  // Check if geometry (polygon) is available
                  let polygonCoords = null;
                  if (selectedParcel.geometry) {
                    try {
                      const geometry = JSON.parse(selectedParcel.geometry);
                      if (geometry.type === 'Polygon' && geometry.coordinates && geometry.coordinates[0]) {
                        // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
                        polygonCoords = geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                      }
                    } catch (e) {
                      console.warn('Failed to parse geometry:', e);
                    }
                  }

                  // Color coding functions
                  const getColorByStatus = (status) => {
                    const colors = {
                      'registered': '#2E7D32',
                      'pending': '#F57C00',
                      'disputed': '#C62828',
                      'unregistered': '#757575'
                    };
                    return colors[status] || '#757575';
                  };

                  const getFillColorByLandType = (landType) => {
                    const colors = {
                      'RESIDENTIAL': '#81C784',
                      'COMMERCIAL': '#64B5F6',
                      'AGRICULTURAL': '#FFB74D',
                      'INDUSTRIAL': '#E57373',
                      'STOOL_LAND': '#BA68C8'
                    };
                    return colors[landType] || '#BDBDBD';
                  };

                  return (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        <MapIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Parcel Location Map
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ height: 400, width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
                        <MapContainer
                          center={center}
                          zoom={16}
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={false}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />

                          {/* Render polygon if available */}
                          {polygonCoords ? (
                            <Polygon
                              positions={polygonCoords}
                              pathOptions={{
                                color: getColorByStatus(selectedParcel.status),
                                fillColor: getFillColorByLandType(selectedParcel.land_type),
                                fillOpacity: 0.4,
                                weight: 3
                              }}
                            >
                              <Popup>
                                <strong>{selectedParcel.parcel_id}</strong><br />
                                {selectedParcel.location}<br />
                                Area: {selectedParcel.area} hectares<br />
                                Type: {selectedParcel.land_type}<br />
                                Status: <strong style={{ color: getColorByStatus(selectedParcel.status) }}>
                                  {selectedParcel.status}
                                </strong>
                              </Popup>
                            </Polygon>
                          ) : (
                            /* Fallback to marker if no polygon */
                            <Marker position={center}>
                              <Popup>
                                <strong>{selectedParcel.parcel_id}</strong><br />
                                {selectedParcel.location}<br />
                                Area: {selectedParcel.area} hectares<br />
                                Type: {selectedParcel.land_type}
                              </Popup>
                            </Marker>
                          )}
                        </MapContainer>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        📍 Latitude: {coords.lat}, Longitude: {coords.lng}
                        {polygonCoords && <span> | 📐 Polygon boundary with {polygonCoords.length} vertices</span>}
                      </Typography>

                      {/* Legend */}
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>Map Legend</Typography>
                        <Box display="flex" gap={3} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 20, height: 20, bgcolor: '#81C784', border: '1px solid #2E7D32' }} />
                            <Typography variant="caption">Residential</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 20, height: 20, bgcolor: '#64B5F6', border: '1px solid #1976D2' }} />
                            <Typography variant="caption">Commercial</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 20, height: 20, bgcolor: '#FFB74D', border: '1px solid #F57C00' }} />
                            <Typography variant="caption">Agricultural</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 20, height: 20, bgcolor: '#E57373', border: '1px solid #C62828' }} />
                            <Typography variant="caption">Industrial</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 20, height: 20, bgcolor: '#BA68C8', border: '1px solid #7B1FA2' }} />
                            <Typography variant="caption">Stool Land</Typography>
                          </Box>
                        </Box>
                        <Box display="flex" gap={3} flexWrap="wrap" sx={{ mt: 1 }}>
                          <Typography variant="caption">
                            <strong style={{ color: '#2E7D32' }}>Green border:</strong> Registered
                          </Typography>
                          <Typography variant="caption">
                            <strong style={{ color: '#F57C00' }}>Orange border:</strong> Pending
                          </Typography>
                          <Typography variant="caption">
                            <strong style={{ color: '#757575' }}>Gray border:</strong> Unregistered
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                } catch (e) {
                  return (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Map coordinates are not available in the correct format
                      </Alert>
                    </Grid>
                  );
                }
              })()}

              {selectedParcel.blockchain_token_id && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Blockchain Token ID</Typography>
                  <Chip
                    label={selectedParcel.blockchain_token_id}
                    color="success"
                    icon={<CheckCircle />}
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Grid>
              )}

              {/* Survey Information */}
              {selectedParcel.survey && (
                <>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Description sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Survey Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Survey ID</Typography>
                    <Typography variant="body1">{selectedParcel.survey.survey_id}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={selectedParcel.survey.status}
                      color={selectedParcel.survey.status === 'approved' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Survey Date</Typography>
                    <Typography variant="body1">{selectedParcel.survey.survey_date}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Accuracy Score</Typography>
                    <Typography variant="body1">{selectedParcel.survey.accuracy_score ? (selectedParcel.survey.accuracy_score * 100).toFixed(1) + '%' : 'N/A'}</Typography>
                  </Grid>

                  {selectedParcel.survey.instrument_type && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Instrument</Typography>
                      <Typography variant="body1">{selectedParcel.survey.instrument_type}</Typography>
                    </Grid>
                  )}
                </>
              )}

              {/* Title Information */}
              {selectedParcel.title && (
                <>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      <CheckCircle sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Land Title Certificate
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Title ID</Typography>
                    <Typography variant="body1">{selectedParcel.title.title_id}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Title Type</Typography>
                    <Typography variant="body1">{selectedParcel.title.title_type}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Issuance Date</Typography>
                    <Typography variant="body1">{selectedParcel.title.issuance_date || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={selectedParcel.title.status}
                      color={selectedParcel.title.status === 'issued' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Grid>
                </>
              )}

              {!selectedParcel.survey && !selectedParcel.title && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No survey or title information available for this parcel yet.
                  </Alert>
                </Grid>
              )}
            </Grid>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
