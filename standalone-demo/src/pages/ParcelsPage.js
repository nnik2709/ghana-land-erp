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
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LocationOn, Landscape, CheckCircle, Description, Map as MapIcon, Assessment, TrendingUp, Download, AddCircle, QrCode2, ContentCopy, Search } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Fix Leaflet default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Generate ULPIN (Unique Land Parcel Identification Number)
// Format: GH-{RegionCode}-{DistrictCode}-{Year}-{Sequence}
const generateULPIN = (parcel) => {
  const regionCodes = {
    'Greater Accra': 'GAR',
    'Ashanti': 'ASH',
    'Western': 'WES',
    'Eastern': 'EAS',
    'Central': 'CEN',
    'Northern': 'NOR',
    'Volta': 'VOL',
    'Upper East': 'UEA',
    'Upper West': 'UWE',
    'Bono': 'BON',
    'Bono East': 'BEA',
    'Ahafo': 'AHA',
    'Western North': 'WNO',
    'Oti': 'OTI',
    'North East': 'NEA',
    'Savannah': 'SAV'
  };

  const districtCodes = {
    'Accra Metropolitan': 'ACC',
    'Tema Metropolitan': 'TEM',
    'Kumasi Metropolitan': 'KUM',
    'Sekondi-Takoradi': 'SKD',
    'Cape Coast Metropolitan': 'CAP',
    'Tamale Metropolitan': 'TAM',
    'Ho Municipal': 'HOM',
    'Sunyani Municipal': 'SUN'
  };

  const regionCode = regionCodes[parcel.region] || parcel.region?.substring(0, 3).toUpperCase() || 'UNK';
  const districtCode = districtCodes[parcel.district] || parcel.district?.substring(0, 3).toUpperCase() || 'UNK';
  const year = new Date().getFullYear();
  // Generate sequence from parcel ID or use random
  const sequence = parcel.id ? String(parcel.id).padStart(6, '0') : String(Math.floor(Math.random() * 999999)).padStart(6, '0');

  return `GH-${regionCode}-${districtCode}-${year}-${sequence}`;
};

export default function ParcelsPage() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedULPIN, setCopiedULPIN] = useState(null);
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

  // Copy ULPIN to clipboard
  const handleCopyULPIN = (ulpin) => {
    navigator.clipboard.writeText(ulpin);
    setCopiedULPIN(ulpin);
    setTimeout(() => setCopiedULPIN(null), 2000);
  };

  // Filter parcels based on search query (searches both Parcel ID and ULPIN)
  const filteredParcels = parcels.filter(parcel => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const ulpin = generateULPIN(parcel).toLowerCase();
    return parcel.parcel_id?.toLowerCase().includes(query) ||
           ulpin.includes(query) ||
           parcel.location?.toLowerCase().includes(query) ||
           parcel.district?.toLowerCase().includes(query);
  });

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

  const handleCreateParcel = async () => {
    if (!newParcel.location || !newParcel.region || !newParcel.district || !newParcel.area || !newParcel.owner) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setCreating(true);
    setAlert(null);
    try {
      const response = await api.post('/parcels', newParcel);
      setAlert({
        type: 'success',
        message: `Parcel created successfully! ID: ${response.data.data.parcel_id}`
      });
      setCreateDialogOpen(false);
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
      // Refresh parcel list
      const updatedParcels = await api.get('/parcels');
      setParcels(updatedParcels.data.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create parcel. Please try again.' });
    } finally {
      setCreating(false);
    }
  };

  const canCreateParcel = user && (user.role === 'admin' || user.role === 'lands_officer' || user.role === 'surveyor');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            Land Parcels
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage land parcel records
          </Typography>
        </Box>
        {canCreateParcel && (
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Parcel
          </Button>
        )}
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Parcel ID, ULPIN, location, or district..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          size="small"
        />
        {searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Showing {filteredParcels.length} of {parcels.length} parcels
          </Typography>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcel ID</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <QrCode2 sx={{ fontSize: 16 }} />
                  ULPIN
                </Box>
              </TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Area (ha)</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParcels.map(parcel => {
              const ulpin = generateULPIN(parcel);
              return (
                <TableRow key={parcel.id}>
                  <TableCell>{parcel.parcel_id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {ulpin}
                      </Typography>
                      <Button
                        size="small"
                        sx={{ minWidth: 'auto', p: 0.5 }}
                        onClick={() => handleCopyULPIN(ulpin)}
                        title="Copy ULPIN"
                      >
                        {copiedULPIN === ulpin ? (
                          <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                        ) : (
                          <ContentCopy sx={{ fontSize: 14 }} />
                        )}
                      </Button>
                    </Box>
                  </TableCell>
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(parcel.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<Assessment />}
                        onClick={() => {
                          setSelectedParcel(parcel);
                          setValuationOpen(true);
                        }}
                      >
                        Get Valuation
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
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

              {/* ULPIN Display */}
              <Grid item xs={12}>
                <Box sx={{
                  p: 2,
                  bgcolor: '#E3F2FD',
                  borderRadius: 1,
                  border: '1px solid #90CAF9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <QrCode2 sx={{ fontSize: 16 }} />
                      ULPIN (Unique Land Parcel Identification Number)
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1565C0' }}>
                      {generateULPIN(selectedParcel)}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={copiedULPIN === generateULPIN(selectedParcel) ? <CheckCircle /> : <ContentCopy />}
                    onClick={() => handleCopyULPIN(generateULPIN(selectedParcel))}
                    color={copiedULPIN === generateULPIN(selectedParcel) ? 'success' : 'primary'}
                  >
                    {copiedULPIN === generateULPIN(selectedParcel) ? 'Copied!' : 'Copy'}
                  </Button>
                </Box>
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

      {/* Property Valuation Dialog */}
      <Dialog open={valuationOpen} onClose={() => setValuationOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Assessment sx={{ mr: 1, color: '#006B3F' }} />
            AI-Powered Property Valuation
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedParcel && (
            <Grid container spacing={3}>
              {/* Parcel Summary */}
              <Grid item xs={12}>
                <Alert severity="info" icon={<TrendingUp />}>
                  <strong>Demo Feature:</strong> AI-powered market valuation using comparable sales analysis and machine learning algorithms
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Property Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Parcel ID</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedParcel.parcel_id}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">ULPIN</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{generateULPIN(selectedParcel)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{selectedParcel.location}, {selectedParcel.district}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Area</Typography>
                <Typography variant="body1">{selectedParcel.area} hectares ({(selectedParcel.area * 2.47105).toFixed(2)} acres)</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Land Type</Typography>
                <Typography variant="body1">{selectedParcel.land_type}</Typography>
              </Grid>

              {/* AI Valuation Results */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  <Assessment sx={{ verticalAlign: 'middle', mr: 1 }} />
                  AI Valuation Estimate
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    bgcolor: '#E8F5E9',
                    p: 3,
                    borderRadius: 2,
                    border: '2px solid #66BB6A'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Estimated Market Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 1 }}>
                    GHS {(selectedParcel.area * 85000).toLocaleString()} - GHS {(selectedParcel.area * 105000).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Median: GHS {(selectedParcel.area * 95000).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="87% Confidence" color="success" size="small" />
                    <Typography variant="caption" color="text.secondary">
                      Based on 24 comparable sales in the area
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Valuation Breakdown */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Valuation Factors
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Price per Hectare</Typography>
                  <Typography variant="h6" fontWeight="bold">GHS 95,000</Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Location Score</Typography>
                  <Typography variant="h6" fontWeight="bold">8.5/10</Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Development Potential</Typography>
                  <Typography variant="h6" fontWeight="bold">High</Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Market Trend (12mo)</Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">+12.3%</Typography>
                </Box>
              </Grid>

              {/* Comparable Sales */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Recent Comparable Sales (Within 2km)
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Location</TableCell>
                        <TableCell>Area (ha)</TableCell>
                        <TableCell>Sale Price</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedParcel.district}, 1.2km away</TableCell>
                        <TableCell>{(selectedParcel.area * 0.95).toFixed(2)}</TableCell>
                        <TableCell>GHS {(selectedParcel.area * 0.95 * 92000).toLocaleString()}</TableCell>
                        <TableCell>2024-10-15</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{selectedParcel.district}, 0.8km away</TableCell>
                        <TableCell>{(selectedParcel.area * 1.1).toFixed(2)}</TableCell>
                        <TableCell>GHS {(selectedParcel.area * 1.1 * 98000).toLocaleString()}</TableCell>
                        <TableCell>2024-09-22</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{selectedParcel.district}, 1.5km away</TableCell>
                        <TableCell>{(selectedParcel.area * 0.88).toFixed(2)}</TableCell>
                        <TableCell>GHS {(selectedParcel.area * 0.88 * 89000).toLocaleString()}</TableCell>
                        <TableCell>2024-08-30</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Stamp Duty Calculation */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Estimated Transaction Costs (If Sold)
                </Typography>
                <Box sx={{ p: 2, bgcolor: '#FFF3E0', borderRadius: 1, border: '1px solid #FFB74D' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={8}>
                      <Typography variant="body2">Stamp Duty (1%)</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="bold">GHS {(selectedParcel.area * 95000 * 0.01).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">Registration Fee</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="bold">GHS 250</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">Legal & Processing</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="bold">GHS 1,500</Typography>
                    </Grid>
                    <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" fontWeight="bold">Total Transaction Cost</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        GHS {(selectedParcel.area * 95000 * 0.01 + 250 + 1500).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Last Valuation Info */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Alert severity="success">
                  <strong>Last Official Valuation:</strong> GHS {(selectedParcel.area * 88000).toLocaleString()}
                  {' '}(Conducted on 2024-03-15 by Ghana Lands Commission)
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Download />}
            variant="outlined"
            onClick={() => alert('Valuation Report Download:\n\nIn production, this would generate a PDF report with:\n• Detailed valuation analysis\n• Comparable sales data\n• Market trends\n• Legal disclaimers\n• Digital signature\n• Blockchain verification hash')}
          >
            Download Report (PDF)
          </Button>
          <Button onClick={() => setValuationOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Parcel Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AddCircle sx={{ mr: 1, color: '#006B3F' }} />
            Create New Parcel
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                Create a preliminary parcel record. A surveyor will need to complete the GPS survey before final registration.
              </Alert>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Region"
                value={newParcel.region}
                onChange={(e) => setNewParcel({ ...newParcel, region: e.target.value })}
                placeholder="e.g., Greater Accra"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="District"
                value={newParcel.district}
                onChange={(e) => setNewParcel({ ...newParcel, district: e.target.value })}
                placeholder="e.g., Accra Metropolitan"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Location / Address"
                value={newParcel.location}
                onChange={(e) => setNewParcel({ ...newParcel, location: e.target.value })}
                placeholder="e.g., East Legon, Behind Ecobank"
                helperText="Provide detailed location description"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Area (hectares)"
                type="number"
                value={newParcel.area}
                onChange={(e) => setNewParcel({ ...newParcel, area: e.target.value })}
                placeholder="e.g., 2.5"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Land Use / Type</InputLabel>
                <Select
                  value={newParcel.land_use}
                  onChange={(e) => setNewParcel({ ...newParcel, land_use: e.target.value })}
                  label="Land Use / Type"
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Agricultural">Agricultural</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Mixed Use">Mixed Use</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                  <MenuItem value="Stool Land">Stool Land</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                Owner Information
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Owner Name"
                value={newParcel.owner}
                onChange={(e) => setNewParcel({ ...newParcel, owner: e.target.value })}
                placeholder="e.g., Kofi Mensah"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Owner Phone"
                value={newParcel.owner_phone}
                onChange={(e) => setNewParcel({ ...newParcel, owner_phone: e.target.value })}
                placeholder="+233 24 123 4567"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Owner ID (Ghana Card / Passport)"
                value={newParcel.owner_id}
                onChange={(e) => setNewParcel({ ...newParcel, owner_id: e.target.value })}
                placeholder="GHA-123456789-1"
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="warning">
                <strong>Note:</strong> This parcel will be created with status "Pending Survey".
                Assign a surveyor to complete GPS boundary mapping before final registration.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateParcel}
            variant="contained"
            disabled={creating}
            startIcon={creating ? <CircularProgress size={20} /> : <AddCircle />}
          >
            {creating ? 'Creating...' : 'Create Parcel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
