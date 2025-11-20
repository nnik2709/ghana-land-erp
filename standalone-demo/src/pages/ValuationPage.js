import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Divider, Alert, LinearProgress
} from '@mui/material';
import {
  Assessment, Calculate, History, Print, TrendingUp, Home, Business,
  Agriculture, Factory, Search
} from '@mui/icons-material';

export default function ValuationPage() {
  const [searchParcelId, setSearchParcelId] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [valuationDialogOpen, setValuationDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [newValuationOpen, setNewValuationOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mock property data with valuations
  const properties = [
    {
      id: 1,
      parcelId: 'ACC/2024/001',
      location: 'East Legon, Accra',
      landUse: 'Residential',
      area: 850,
      currentValue: 1250000,
      lastValuation: '2024-06-15',
      taxRate: 0.5,
      annualTax: 6250,
      taxStatus: 'Paid',
      owner: 'Kwame Asante',
      valuationHistory: [
        { date: '2024-06-15', value: 1250000, method: 'Market Comparison', officer: 'J. Mensah' },
        { date: '2022-06-10', value: 980000, method: 'Market Comparison', officer: 'A. Boateng' },
        { date: '2020-05-20', value: 750000, method: 'Cost Approach', officer: 'J. Mensah' }
      ]
    },
    {
      id: 2,
      parcelId: 'ACC/2024/002',
      location: 'Osu, Accra',
      landUse: 'Commercial',
      area: 1200,
      currentValue: 3500000,
      lastValuation: '2024-03-20',
      taxRate: 1.2,
      annualTax: 42000,
      taxStatus: 'Overdue',
      owner: 'Accra Business Ltd',
      valuationHistory: [
        { date: '2024-03-20', value: 3500000, method: 'Income Capitalization', officer: 'K. Owusu' },
        { date: '2021-03-15', value: 2800000, method: 'Income Capitalization', officer: 'K. Owusu' }
      ]
    },
    {
      id: 3,
      parcelId: 'ASH/2024/003',
      location: 'Kumasi Central',
      landUse: 'Mixed Use',
      area: 2500,
      currentValue: 4200000,
      lastValuation: '2023-11-10',
      taxRate: 0.8,
      annualTax: 33600,
      taxStatus: 'Partial',
      owner: 'Ashanti Investments',
      valuationHistory: [
        { date: '2023-11-10', value: 4200000, method: 'Market Comparison', officer: 'E. Amoah' },
        { date: '2020-11-05', value: 3100000, method: 'Market Comparison', officer: 'E. Amoah' }
      ]
    },
    {
      id: 4,
      parcelId: 'WES/2024/004',
      location: 'Takoradi Industrial',
      landUse: 'Industrial',
      area: 5000,
      currentValue: 2800000,
      lastValuation: '2024-01-25',
      taxRate: 0.6,
      annualTax: 16800,
      taxStatus: 'Paid',
      owner: 'Western Manufacturing Co',
      valuationHistory: [
        { date: '2024-01-25', value: 2800000, method: 'Cost Approach', officer: 'P. Darko' }
      ]
    },
    {
      id: 5,
      parcelId: 'NOR/2024/005',
      location: 'Tamale Suburbs',
      landUse: 'Agricultural',
      area: 15000,
      currentValue: 450000,
      lastValuation: '2023-08-30',
      taxRate: 0.2,
      annualTax: 900,
      taxStatus: 'Paid',
      owner: 'Northern Agri Farms',
      valuationHistory: [
        { date: '2023-08-30', value: 450000, method: 'Productivity Method', officer: 'I. Abdul' },
        { date: '2021-08-25', value: 380000, method: 'Productivity Method', officer: 'I. Abdul' }
      ]
    }
  ];

  const getLandUseIcon = (type) => {
    switch (type) {
      case 'Residential': return <Home />;
      case 'Commercial': return <Business />;
      case 'Industrial': return <Factory />;
      case 'Agricultural': return <Agriculture />;
      default: return <Home />;
    }
  };

  const getTaxStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Overdue': return 'error';
      case 'Partial': return 'warning';
      default: return 'default';
    }
  };

  const handleSearch = () => {
    const found = properties.find(p =>
      p.parcelId.toLowerCase().includes(searchParcelId.toLowerCase())
    );
    if (found) {
      setSelectedProperty(found);
      setValuationDialogOpen(true);
    } else {
      setAlert({ type: 'error', message: 'Property not found. Please check the Parcel ID.' });
    }
  };

  const handleViewHistory = (property) => {
    setSelectedProperty(property);
    setHistoryDialogOpen(true);
  };

  const handleNewValuation = () => {
    setNewValuationOpen(true);
  };

  const handleSubmitValuation = () => {
    setAlert({ type: 'success', message: 'Valuation request submitted successfully. An officer will be assigned.' });
    setNewValuationOpen(false);
  };

  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalTax = properties.reduce((sum, p) => sum + p.annualTax, 0);
  const overdueCount = properties.filter(p => p.taxStatus === 'Overdue').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Property Valuation & Tax
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Property valuations, tax assessments, and payment tracking
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Search by Parcel ID"
              value={searchParcelId}
              onChange={(e) => setSearchParcelId(e.target.value)}
              placeholder="e.g., ACC/2024/001"
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ bgcolor: '#006B3F' }}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Calculate />}
              onClick={handleNewValuation}
            >
              Request
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#006B3F', color: 'white' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                GHS {(totalValue / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2">Total Property Value</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FCD116', color: '#333' }}>
            <CardContent>
              <Assessment sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                GHS {totalTax.toLocaleString()}
              </Typography>
              <Typography variant="body2">Annual Tax Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: overdueCount > 0 ? '#CE1126' : '#4caf50', color: 'white' }}>
            <CardContent>
              <Calculate sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                {overdueCount}
              </Typography>
              <Typography variant="body2">Overdue Payments</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Properties Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Property Valuations</Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parcel ID</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Land Use</TableCell>
                <TableCell>Area (m²)</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell>Annual Tax</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {property.parcelId}
                    </Typography>
                  </TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getLandUseIcon(property.landUse)}
                      <Typography variant="body2">{property.landUse}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{property.area.toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      GHS {property.currentValue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>GHS {property.annualTax.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={property.taxStatus}
                      size="small"
                      color={getTaxStatusColor(property.taxStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<History />}
                      onClick={() => handleViewHistory(property)}
                    >
                      History
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Valuation Details Dialog */}
      <Dialog
        open={valuationDialogOpen}
        onClose={() => setValuationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProperty && (
          <>
            <DialogTitle>
              Property Valuation Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parcel ID</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedProperty.parcelId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Owner</Typography>
                  <Typography variant="body1">{selectedProperty.owner}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{selectedProperty.location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Land Use</Typography>
                  <Typography variant="body1">{selectedProperty.landUse}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Area</Typography>
                  <Typography variant="body1">{selectedProperty.area.toLocaleString()} m²</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Current Value</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    GHS {selectedProperty.currentValue.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Last Valuation</Typography>
                  <Typography variant="body1">
                    {new Date(selectedProperty.lastValuation).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tax Rate</Typography>
                  <Typography variant="body1">{selectedProperty.taxRate}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Annual Tax</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    GHS {selectedProperty.annualTax.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Chip
                    label={`Payment Status: ${selectedProperty.taxStatus}`}
                    color={getTaxStatusColor(selectedProperty.taxStatus)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setValuationDialogOpen(false)}>Close</Button>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={() => {
                  setValuationDialogOpen(false);
                  setHistoryDialogOpen(true);
                }}
              >
                View History
              </Button>
              <Button
                variant="contained"
                startIcon={<Print />}
                sx={{ bgcolor: '#006B3F' }}
              >
                Print Report
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Valuation History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProperty && (
          <>
            <DialogTitle>
              Valuation History - {selectedProperty.parcelId}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Officer</TableCell>
                      <TableCell>Change</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProperty.valuationHistory.map((record, index) => {
                      const prevValue = selectedProperty.valuationHistory[index + 1]?.value;
                      const change = prevValue ? ((record.value - prevValue) / prevValue * 100).toFixed(1) : null;
                      return (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              GHS {record.value.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{record.method}</TableCell>
                          <TableCell>{record.officer}</TableCell>
                          <TableCell>
                            {change && (
                              <Chip
                                label={`${change > 0 ? '+' : ''}${change}%`}
                                size="small"
                                color={change > 0 ? 'success' : 'error'}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Valuation Request Dialog */}
      <Dialog
        open={newValuationOpen}
        onClose={() => setNewValuationOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request New Valuation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Parcel ID"
              sx={{ mb: 2 }}
              placeholder="Enter parcel ID"
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Valuation Purpose</InputLabel>
              <Select label="Valuation Purpose" defaultValue="">
                <MenuItem value="sale">Property Sale</MenuItem>
                <MenuItem value="mortgage">Mortgage Application</MenuItem>
                <MenuItem value="tax">Tax Assessment</MenuItem>
                <MenuItem value="insurance">Insurance</MenuItem>
                <MenuItem value="legal">Legal Proceedings</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Preferred Method</InputLabel>
              <Select label="Preferred Method" defaultValue="">
                <MenuItem value="market">Market Comparison</MenuItem>
                <MenuItem value="income">Income Capitalization</MenuItem>
                <MenuItem value="cost">Cost Approach</MenuItem>
                <MenuItem value="auto">Automatic Selection</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              placeholder="Any specific requirements or information..."
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              Valuation fee: GHS 500 - 2,000 depending on property type and size.
              Processing time: 5-10 business days.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewValuationOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitValuation}
            sx={{ bgcolor: '#006B3F' }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
