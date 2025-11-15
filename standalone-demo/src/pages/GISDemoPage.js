import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Divider,
  Stack,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Map as MapIcon,
  FilterList,
  Search,
  Square,
  Circle,
  Timeline,
  Straighten,
  Delete,
  Download,
  Upload,
  Satellite,
  Terrain,
  Home,
  AccountBalance,
  TrendingUp,
  Info
} from '@mui/icons-material';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';

// Component to control Geoman drawing tools
function GeomanControls({ selectedTool, onClearDrawings, onShapeDrawn }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Initialize Geoman without default controls (we use custom buttons)
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: false,
      drawRectangle: false,
      drawCircle: false,
      drawPolyline: false,
      drawMarker: false,
      drawCircleMarker: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    });

    // Listen for shape creation
    const handleCreate = (e) => {
      const layer = e.layer;
      const shape = e.shape;

      // Calculate approximate area (not accurate, just for demo)
      let area = 0;
      if (shape === 'Circle') {
        const radius = layer.getRadius();
        area = Math.PI * radius * radius; // in square meters
      } else if (shape === 'Polygon' || shape === 'Rectangle') {
        const latlngs = layer.getLatLngs()[0];
        // Simple area calculation (not geodetically accurate)
        let sum = 0;
        for (let i = 0; i < latlngs.length; i++) {
          const j = (i + 1) % latlngs.length;
          sum += (latlngs[j].lng - latlngs[i].lng) * (latlngs[j].lat + latlngs[i].lat);
        }
        area = Math.abs(sum / 2) * 111000 * 111000; // rough conversion to m²
      }

      // Notify parent component
      if (onShapeDrawn) {
        onShapeDrawn({ shape, layer, area });
      }
    };

    map.on('pm:create', handleCreate);

    // Enable appropriate drawing mode based on selectedTool
    if (selectedTool === 'polygon') {
      map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20,
        finishOn: 'dblclick',
        pathOptions: {
          color: '#4A90E2',
          fillColor: '#4A90E2',
          fillOpacity: 0.3,
        }
      });
    } else if (selectedTool === 'circle') {
      map.pm.enableDraw('Circle', {
        pathOptions: {
          color: '#66BB6A',
          fillColor: '#66BB6A',
          fillOpacity: 0.3,
        }
      });
    } else if (selectedTool === 'line') {
      map.pm.enableDraw('Line', {
        pathOptions: {
          color: '#FFA726',
          weight: 3,
        }
      });
    } else if (selectedTool === 'measure') {
      map.pm.enableDraw('Rectangle', {
        pathOptions: {
          color: '#AB47BC',
          fillColor: '#AB47BC',
          fillOpacity: 0.3,
        }
      });
    } else {
      // Disable all drawing modes
      map.pm.disableDraw();
    }

    // Clean up on unmount or tool change
    return () => {
      map.pm.disableDraw();
      map.off('pm:create', handleCreate);
    };
  }, [map, selectedTool, onShapeDrawn]);

  // Handle clear drawings
  useEffect(() => {
    if (onClearDrawings) {
      const handleClear = () => {
        map.eachLayer((layer) => {
          if (layer.pm && layer.pm._shape && !layer.options.isParcel) {
            map.removeLayer(layer);
          }
        });
      };

      // Store the handler so it can be called from parent
      map._clearDrawings = handleClear;
    }
  }, [map, onClearDrawings]);

  return null;
}

export default function GISDemoPage() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [mapLayer, setMapLayer] = useState('satellite');
  const [selectedRegion, setSelectedRegion] = useState('Greater Accra');
  const [mapInstance, setMapInstance] = useState(null);
  const [drawnParcels, setDrawnParcels] = useState([]);
  const [totalDrawnArea, setTotalDrawnArea] = useState(0);
  const [updateKey, setUpdateKey] = useState(0); // Force re-render trigger

  // Sample parcels in Greater Accra region
  const sampleParcels = [
    {
      id: 'GH-ACC-001',
      name: 'Cantonments Estate',
      coordinates: [
        [5.5800, -0.1900],
        [5.5800, -0.1850],
        [5.5750, -0.1850],
        [5.5750, -0.1900],
      ],
      area: '2.5 hectares',
      status: 'Registered',
      owner: 'Kofi Mensah',
      color: '#4A90E2'
    },
    {
      id: 'GH-ACC-002',
      name: 'East Legon Plot',
      coordinates: [
        [5.6400, -0.1500],
        [5.6400, -0.1450],
        [5.6350, -0.1450],
        [5.6350, -0.1500],
      ],
      area: '3.2 hectares',
      status: 'Pending',
      owner: 'Ama Adjei',
      color: '#66BB6A'
    },
    {
      id: 'GH-ACC-003',
      name: 'Airport Residential',
      coordinates: [
        [5.6050, -0.1700],
        [5.6050, -0.1650],
        [5.6000, -0.1650],
        [5.6000, -0.1700],
      ],
      area: '1.8 hectares',
      status: 'Registered',
      owner: 'Kwame Osei',
      color: '#FFA726'
    },
    {
      id: 'GH-ACC-004',
      name: 'Tema Community 1',
      coordinates: [
        [5.6700, -0.0100],
        [5.6700, -0.0050],
        [5.6650, -0.0050],
        [5.6650, -0.0100],
      ],
      area: '4.1 hectares',
      status: 'Registered',
      owner: 'Ghana Lands Commission',
      color: '#AB47BC'
    },
  ];

  // Dynamic statistics that update when shapes are drawn
  const baseParcelCount = 124582;
  const totalParcelCount = baseParcelCount + drawnParcels.length;
  const baseSurveyedArea = 45289; // km²
  const additionalArea = Math.round(totalDrawnArea / 1000000); // Convert m² to km²

  console.log('Rendering GIS Demo - Drawn parcels:', drawnParcels.length, 'Total:', totalParcelCount);

  const statistics = [
    {
      title: 'Total Parcels',
      value: totalParcelCount.toLocaleString(),
      change: drawnParcels.length > 0 ? `+${drawnParcels.length} new` : '+2.4%',
      icon: <Home />,
      color: '#4A90E2',
      bgColor: '#E3F2FD'
    },
    {
      title: 'Active Titles',
      value: (98234 + drawnParcels.length).toLocaleString(),
      change: drawnParcels.length > 0 ? `+${drawnParcels.length} new` : '+1.8%',
      icon: <AccountBalance />,
      color: '#66BB6A',
      bgColor: '#E8F5E9'
    },
    {
      title: 'Surveyed Area',
      value: `${(baseSurveyedArea + additionalArea).toLocaleString()} km²`,
      change: additionalArea > 0 ? `+${additionalArea} km²` : '+5.2%',
      icon: <Terrain />,
      color: '#FFA726',
      bgColor: '#FFF3E0'
    },
    {
      title: 'Data Accuracy',
      value: '94.7%',
      change: '+0.3%',
      icon: <TrendingUp />,
      color: '#7E57C2',
      bgColor: '#F3E5F5'
    }
  ];

  const staticParcels = [
    { id: 'GH-AC-2024-001', region: 'Greater Accra', area: '2,450 m²', status: 'Verified', owner: 'Kofi Mensah', date: '2024-11-10' },
    { id: 'GH-AC-2024-002', region: 'Greater Accra', area: '1,820 m²', status: 'Pending', owner: 'Ama Adjei', date: '2024-11-09' },
    { id: 'GH-AS-2024-156', region: 'Ashanti', area: '3,150 m²', status: 'Verified', owner: 'Kwame Osei', date: '2024-11-08' },
    { id: 'GH-NR-2024-089', region: 'Northern', area: '5,200 m²', status: 'Processing', owner: 'Abena Mensah', date: '2024-11-07' },
    { id: 'GH-WR-2024-045', region: 'Western', area: '2,890 m²', status: 'Verified', owner: 'Yaw Boateng', date: '2024-11-06' }
  ];

  // Combine drawn parcels with static parcels (drawn parcels appear first)
  const recentParcels = [...drawnParcels, ...staticParcels];

  const layers = [
    { name: 'Cadastral Boundaries', visible: true, opacity: 100 },
    { name: 'Land Titles', visible: true, opacity: 85 },
    { name: 'Survey Points', visible: false, opacity: 100 },
    { name: 'Administrative Regions', visible: true, opacity: 60 },
    { name: 'Protected Areas', visible: false, opacity: 70 }
  ];

  const drawingTools = [
    { id: 'polygon', icon: <Square />, label: 'Polygon', tooltip: 'Draw polygon boundary' },
    { id: 'circle', icon: <Circle />, label: 'Circle', tooltip: 'Draw circular area' },
    { id: 'line', icon: <Timeline />, label: 'Line', tooltip: 'Measure distance' },
    { id: 'measure', icon: <Straighten />, label: 'Measure', tooltip: 'Measure area' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'Pending': return 'warning';
      case 'Processing': return 'info';
      default: return 'default';
    }
  };

  const handleShapeDrawn = ({ shape, layer, area }) => {
    console.log('Shape drawn!', { shape, area });
    const newParcel = {
      id: `GH-DRAWN-${Date.now()}`,
      region: selectedRegion,
      area: `${Math.round(area).toLocaleString()} m²`,
      status: 'Processing',
      owner: 'User Drawn',
      date: new Date().toISOString().split('T')[0],
      shape: shape
    };

    console.log('Adding new parcel:', newParcel);
    setDrawnParcels(prev => {
      const updated = [newParcel, ...prev];
      console.log('Updated parcels:', updated);
      return updated;
    });
    setTotalDrawnArea(prev => prev + area);
    setUpdateKey(prev => prev + 1); // Force re-render
  };

  const handleClearDrawings = () => {
    if (mapInstance && mapInstance._clearDrawings) {
      mapInstance._clearDrawings();
      setSelectedTool(null);
      setDrawnParcels([]);
      setTotalDrawnArea(0);
      setUpdateKey(prev => prev + 1); // Force re-render
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C3E50', mb: 1 }}>
            Spatial Data Platform
          </Typography>
          <Typography variant="body1" sx={{ color: '#7F8C8D' }}>
            Geographic Information System - Interactive Map & Analytics
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid #E8EBF0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Chip
                      label={stat.change}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main GIS Interface */}
        <Grid container spacing={3}>
          {/* Left Sidebar - Tools & Layers */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
              {/* Search */}
              <Paper
                elevation={0}
                sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search parcels, titles..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#7F8C8D' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F8F9FA',
                      '& fieldset': { border: 'none' }
                    }
                  }}
                />
              </Paper>

              {/* Drawing Tools */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50' }}>
                  Drawing Tools
                </Typography>
                <Grid container spacing={1}>
                  {drawingTools.map((tool) => (
                    <Grid item xs={6} key={tool.id}>
                      <Tooltip title={tool.tooltip} placement="top">
                        <Button
                          fullWidth
                          variant={selectedTool === tool.id ? 'contained' : 'outlined'}
                          onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                          sx={{
                            height: 64,
                            flexDirection: 'column',
                            gap: 0.5,
                            bgcolor: selectedTool === tool.id ? '#4A90E2' : 'transparent',
                            borderColor: '#E8EBF0',
                            color: selectedTool === tool.id ? '#fff' : '#7F8C8D',
                            '&:hover': {
                              bgcolor: selectedTool === tool.id ? '#357ABD' : '#F8F9FA',
                              borderColor: '#4A90E2'
                            }
                          }}
                        >
                          {tool.icon}
                          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            {tool.label}
                          </Typography>
                        </Button>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    fullWidth
                    onClick={handleClearDrawings}
                    sx={{ borderColor: '#E8EBF0', color: '#7F8C8D' }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Paper>

              {/* Map Layers */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50' }}>
                  Map Layers
                </Typography>
                <Stack spacing={1.5}>
                  {layers.map((layer, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 1,
                              bgcolor: layer.visible ? '#4A90E2' : '#E8EBF0',
                              cursor: 'pointer'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#2C3E50' }}>
                            {layer.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
                          {layer.opacity}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={layer.opacity}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: '#F0F2F5',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: layer.visible ? '#4A90E2' : '#E8EBF0'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* Base Map Selection */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50' }}>
                  Base Map
                </Typography>
                <Stack spacing={1}>
                  <Button
                    variant={mapLayer === 'satellite' ? 'contained' : 'outlined'}
                    startIcon={<Satellite />}
                    onClick={() => setMapLayer('satellite')}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      bgcolor: mapLayer === 'satellite' ? '#4A90E2' : 'transparent',
                      borderColor: '#E8EBF0',
                      color: mapLayer === 'satellite' ? '#fff' : '#7F8C8D'
                    }}
                  >
                    Satellite
                  </Button>
                  <Button
                    variant={mapLayer === 'street' ? 'contained' : 'outlined'}
                    startIcon={<MapIcon />}
                    onClick={() => setMapLayer('street')}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      bgcolor: mapLayer === 'street' ? '#4A90E2' : 'transparent',
                      borderColor: '#E8EBF0',
                      color: mapLayer === 'street' ? '#fff' : '#7F8C8D'
                    }}
                  >
                    Street Map
                  </Button>
                  <Button
                    variant={mapLayer === 'terrain' ? 'contained' : 'outlined'}
                    startIcon={<Terrain />}
                    onClick={() => setMapLayer('terrain')}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      bgcolor: mapLayer === 'terrain' ? '#4A90E2' : 'transparent',
                      borderColor: '#E8EBF0',
                      color: mapLayer === 'terrain' ? '#fff' : '#7F8C8D'
                    }}
                  >
                    Terrain
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Center - Map View */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                height: 720,
                border: '1px solid #E8EBF0',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#E5E7EB'
              }}
            >
              {/* Real Leaflet Map */}
              <MapContainer
                center={[5.6037, -0.1870]}
                zoom={11}
                style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                zoomControl={false}
                whenReady={(map) => setMapInstance(map.target)}
              >
                <TileLayer
                  url={
                    mapLayer === 'satellite'
                      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                      : mapLayer === 'terrain'
                      ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  }
                  attribution={
                    mapLayer === 'satellite'
                      ? '&copy; Esri'
                      : mapLayer === 'terrain'
                      ? '&copy; OpenTopoMap'
                      : '&copy; OpenStreetMap contributors'
                  }
                />

                {/* Geoman drawing controls */}
                <GeomanControls
                  selectedTool={selectedTool}
                  onClearDrawings={true}
                  onShapeDrawn={handleShapeDrawn}
                />

                {/* Render sample parcels */}
                {sampleParcels.map((parcel) => (
                  <Polygon
                    key={parcel.id}
                    positions={parcel.coordinates}
                    pathOptions={{
                      color: parcel.color,
                      fillColor: parcel.color,
                      fillOpacity: 0.3,
                      weight: 3,
                      isParcel: true,
                    }}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#006B3F' }}>
                          {parcel.name}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          <strong>Parcel ID:</strong> {parcel.id}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          <strong>Area:</strong> {parcel.area}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          <strong>Status:</strong> {parcel.status}
                        </Typography>
                        <Typography variant="caption" display="block">
                          <strong>Owner:</strong> {parcel.owner}
                        </Typography>
                      </Box>
                    </Popup>
                  </Polygon>
                ))}
              </MapContainer>

              {/* Scale Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  bgcolor: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                  0 ―――――― 500m
                </Typography>
              </Box>

              {/* Coordinates Display */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#2C3E50', fontFamily: 'monospace' }}>
                  5.6037°N, 0.1870°W
                </Typography>
              </Box>

              {/* Info Badge */}
              {selectedTool && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'rgba(74, 144, 226, 0.95)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Info sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {drawingTools.find(t => t.id === selectedTool)?.tooltip}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Upload />}
                sx={{
                  flex: 1,
                  bgcolor: '#4A90E2',
                  '&:hover': { bgcolor: '#357ABD' }
                }}
              >
                Import Shapefile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  flex: 1,
                  borderColor: '#E8EBF0',
                  color: '#7F8C8D'
                }}
              >
                Export GeoJSON
              </Button>
            </Box>
          </Grid>

          {/* Right Sidebar - Data Panel */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
              {/* Region Filter */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50' }}>
                  Region
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F8F9FA',
                      '& fieldset': { border: 'none' }
                    }
                  }}
                >
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Western">Western</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Central">Central</option>
                  <option value="Northern">Northern</option>
                </TextField>
              </Paper>

              {/* Selected Area Info */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50' }}>
                  Selected Area
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7F8C8D', mb: 0.5, display: 'block' }}>
                      Total Area
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                      {drawnParcels.length === 0 ? '0 m²' : `${Math.round(totalDrawnArea).toLocaleString()} m²`}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7F8C8D', mb: 0.5, display: 'block' }}>
                      Parcels in View
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                      {drawnParcels.length}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7F8C8D', mb: 0.5, display: 'block' }}>
                      Average Size
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                      {drawnParcels.length === 0 ? '0 m²' : `${Math.round(totalDrawnArea / drawnParcels.length).toLocaleString()} m²`}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Recent Activity */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E8EBF0', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                    Recent Activity
                  </Typography>
                  <Chip label="Live" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
                </Box>
                <Stack spacing={2}>
                  {[
                    { action: 'New parcel created', time: '2 min ago', color: '#4A90E2' },
                    { action: 'Title verified', time: '15 min ago', color: '#66BB6A' },
                    { action: 'Survey uploaded', time: '1 hour ago', color: '#FFA726' },
                    { action: 'Boundary adjusted', time: '2 hours ago', color: '#7E57C2' }
                  ].map((activity, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: activity.color
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#2C3E50', mb: 0.25 }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        {/* Recent Parcels Table */}
        <Box sx={{ mt: 4 }}>
          <Paper elevation={0} sx={{ border: '1px solid #E8EBF0', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #E8EBF0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                  Recent Parcels
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FilterList />}
                  sx={{ borderColor: '#E8EBF0', color: '#7F8C8D' }}
                >
                  Filter
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', bgcolor: '#F8F9FA' }}>Parcel ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', bgcolor: '#F8F9FA' }}>Region</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', bgcolor: '#F8F9FA' }}>Area</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', bgcolor: '#F8F9FA' }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', bgcolor: '#F8F9FA' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', bgcolor: '#F8F9FA' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentParcels.map((parcel) => (
                    <TableRow
                      key={parcel.id}
                      sx={{
                        '&:hover': { bgcolor: '#F8F9FA' },
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#4A90E2' }}>
                          {parcel.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#2C3E50' }}>
                          {parcel.region}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 500 }}>
                          {parcel.area}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#2C3E50' }}>
                          {parcel.owner}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={parcel.status}
                          color={getStatusColor(parcel.status)}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                          {parcel.date}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
