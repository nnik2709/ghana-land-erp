import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';

// Component to initialize Leaflet Geoman drawing tools
function GeomanControls({ onAreaDrawn }) {
  const map = useMap();

  useEffect(() => {
    // Add Geoman controls to the map
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawMarker: false,
      drawText: false,
      cutPolygon: false,
    });

    // Listen for shape creation
    map.on('pm:create', (e) => {
      const layer = e.layer;
      const geoJSON = layer.toGeoJSON();
      onAreaDrawn(geoJSON);

      // Remove previous drawn layers (keep only the latest)
      map.eachLayer((layer) => {
        if (layer.pm && layer !== e.layer && layer.toGeoJSON) {
          try {
            const layerGeoJSON = layer.toGeoJSON();
            if (layerGeoJSON.geometry && (layerGeoJSON.geometry.type === 'Polygon' || layerGeoJSON.geometry.type === 'Rectangle')) {
              // Check if it's a drawn layer (not a parcel)
              if (!layer.options.isParcel) {
                map.removeLayer(layer);
              }
            }
          } catch (err) {
            // Ignore errors from non-GeoJSON layers
          }
        }
      });
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
    };
  }, [map, onAreaDrawn]);

  return null;
}

const SpatialDashboardPage = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [parcelsInArea, setParcelsInArea] = useState([]);
  const [titlesInArea, setTitlesInArea] = useState([]);
  const [mortgagesInArea, setMortgagesInArea] = useState([]);
  const [allParcels, setAllParcels] = useState([]);
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalArea: 0,
    totalProperties: 0,
    registeredTitles: 0,
    activeMortgages: 0,
    totalMortgageValue: 0
  });
  const mapRef = useRef();

  useEffect(() => {
    fetchAllParcels();
  }, []);

  const fetchAllParcels = async () => {
    try {
      const response = await api.get('/api/parcels');
      setAllParcels(response.data.parcels || []);
    } catch (error) {
      console.error('Error fetching parcels:', error);
    }
  };

  const handleAreaDrawn = (geoJSON) => {
    setSelectedArea(geoJSON);
    analyzeArea(geoJSON);
  };

  const analyzeArea = async (areaGeoJSON) => {
    try {
      // Find parcels within the selected area using Turf.js
      const parcelsInside = allParcels.filter(parcel => {
        if (!parcel.geometry) return false;

        try {
          const parcelGeometry = JSON.parse(parcel.geometry);
          const parcelPolygon = turf.polygon(parcelGeometry.coordinates);
          const selectedPolygon = turf.polygon(areaGeoJSON.geometry.coordinates);

          // Check if parcel overlaps with selected area
          return turf.booleanIntersects(parcelPolygon, selectedPolygon);
        } catch (error) {
          console.error('Error checking parcel:', error);
          return false;
        }
      });

      setParcelsInArea(parcelsInside);

      // Fetch titles for these parcels
      const parcelIds = parcelsInside.map(p => p.id);
      if (parcelIds.length > 0) {
        const [titlesResponse, mortgagesResponse] = await Promise.all([
          api.get('/api/titles'),
          api.get('/api/mortgages')
        ]);

        const titles = (titlesResponse.data.titles || []).filter(t =>
          parcelIds.includes(t.parcel_id)
        );

        const mortgages = (mortgagesResponse.data.mortgages || []).filter(m =>
          parcelIds.includes(m.parcel_id)
        );

        setTitlesInArea(titles);
        setMortgagesInArea(mortgages);

        // Calculate statistics
        calculateStats(parcelsInside, titles, mortgages);
      } else {
        setTitlesInArea([]);
        setMortgagesInArea([]);
        calculateStats([], [], []);
      }
    } catch (error) {
      console.error('Error analyzing area:', error);
    }
  };

  const calculateStats = (parcels, titles, mortgages) => {
    const totalArea = parcels.reduce((sum, p) => sum + (p.area || 0), 0);
    const registeredTitles = titles.filter(t => t.status === 'issued').length;
    const activeMortgages = mortgages.filter(m => m.status === 'active').length;
    const totalMortgageValue = mortgages
      .filter(m => m.status === 'active')
      .reduce((sum, m) => sum + (m.loan_amount || 0), 0);

    setStats({
      totalArea: totalArea.toFixed(2),
      totalProperties: parcels.length,
      registeredTitles,
      activeMortgages,
      totalMortgageValue: totalMortgageValue.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })
    });
  };

  const getFilteredParcels = () => {
    let filtered = selectedArea ? parcelsInArea : allParcels;

    if (filterRegion !== 'all') {
      filtered = filtered.filter(p => p.region === filterRegion);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      registered: 'success',
      pending: 'warning',
      unregistered: 'default',
      disputed: 'error',
      issued: 'success',
      active: 'info',
      discharged: 'default'
    };
    return colors[status] || 'default';
  };

  const regions = [...new Set(allParcels.map(p => p.region))];
  const filteredParcels = getFilteredParcels();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#006B3F' }}>
        Spatial Analysis Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Draw an area on the map to analyze properties, titles, and mortgages within that region
      </Typography>

      {/* Statistics Cards */}
      {selectedArea && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: '#006B3F', color: 'white' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Area</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.totalArea} m²</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: '#CE1126', color: 'white' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Properties</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.totalProperties}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: '#FCD116', color: '#000' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Registered Titles</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.registeredTitles}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: '#1976d2', color: 'white' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Mortgages</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.activeMortgages}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Mortgage Value</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats.totalMortgageValue}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Map Section */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 2, height: '600px' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#006B3F' }}>
              Interactive Map - Draw Analysis Area
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Use the drawing tools on the left to select an area for analysis
            </Alert>
            <Box sx={{ height: '500px', position: 'relative' }}>
              <MapContainer
                center={[7.9465, -1.0232]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                <GeomanControls onAreaDrawn={handleAreaDrawn} />

                {/* Display all parcels */}
                {filteredParcels.map((parcel, index) => {
                  if (!parcel.geometry) return null;
                  try {
                    const geometry = JSON.parse(parcel.geometry);
                    const positions = geometry.coordinates[0].map(coord => [coord[1], coord[0]]);

                    const isInSelectedArea = selectedArea && parcelsInArea.some(p => p.id === parcel.id);

                    return (
                      <Polygon
                        key={index}
                        positions={positions}
                        pathOptions={{
                          color: isInSelectedArea ? '#CE1126' : '#006B3F',
                          fillColor: isInSelectedArea ? '#FCD116' : '#006B3F',
                          fillOpacity: isInSelectedArea ? 0.6 : 0.3,
                          weight: isInSelectedArea ? 3 : 2
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>{parcel.parcel_id}</strong><br />
                            <strong>Location:</strong> {parcel.location}<br />
                            <strong>Area:</strong> {parcel.area} m²<br />
                            <strong>Type:</strong> {parcel.land_type}<br />
                            <strong>Status:</strong> <Chip label={parcel.status} size="small" color={getStatusColor(parcel.status)} />
                          </div>
                        </Popup>
                      </Polygon>
                    );
                  } catch (error) {
                    return null;
                  }
                })}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Data Tables Section */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 2, maxHeight: '600px', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#006B3F' }}>
                {selectedArea ? 'Properties in Selected Area' : 'All Properties'}
              </Typography>
              {selectedArea && (
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedArea(null);
                    setParcelsInArea([]);
                    setTitlesInArea([]);
                    setMortgagesInArea([]);
                  }}
                  variant="outlined"
                  color="error"
                >
                  Clear Selection
                </Button>
              )}
            </Box>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={filterRegion}
                    label="Region"
                    onChange={(e) => setFilterRegion(e.target.value)}
                  >
                    <MenuItem value="all">All Regions</MenuItem>
                    {regions.map((region) => (
                      <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="registered">Registered</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="unregistered">Unregistered</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Properties List */}
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Properties ({filteredParcels.length})
            </Typography>
            <TableContainer sx={{ maxHeight: '200px' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Parcel ID</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Area (m²)</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredParcels.map((parcel) => (
                    <TableRow key={parcel.id} hover>
                      <TableCell>{parcel.parcel_id}</TableCell>
                      <TableCell>{parcel.location}</TableCell>
                      <TableCell>{parcel.area}</TableCell>
                      <TableCell>
                        <Chip label={parcel.status} size="small" color={getStatusColor(parcel.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedArea && titlesInArea.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Titles ({titlesInArea.length})
                </Typography>
                <TableContainer sx={{ maxHeight: '150px' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {titlesInArea.map((title) => (
                        <TableRow key={title.id} hover>
                          <TableCell>{title.title_id}</TableCell>
                          <TableCell>{title.title_type}</TableCell>
                          <TableCell>
                            <Chip label={title.status} size="small" color={getStatusColor(title.status)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {selectedArea && mortgagesInArea.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Mortgages ({mortgagesInArea.length})
                </Typography>
                <TableContainer sx={{ maxHeight: '150px' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mortgage ID</TableCell>
                        <TableCell>Lender</TableCell>
                        <TableCell>Amount (GHS)</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mortgagesInArea.map((mortgage) => (
                        <TableRow key={mortgage.id} hover>
                          <TableCell>{mortgage.mortgage_id}</TableCell>
                          <TableCell>{mortgage.lender_name}</TableCell>
                          <TableCell>{mortgage.loan_amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip label={mortgage.status} size="small" color={getStatusColor(mortgage.status)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SpatialDashboardPage;
