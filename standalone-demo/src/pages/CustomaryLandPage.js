import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  Alert, Tabs, Tab, IconButton, Tooltip, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  AccountBalance, Add, Visibility, Person, Description, LocationOn, CheckCircle,
  Groups, History, Assignment, HowToVote, Verified
} from '@mui/icons-material';

export default function CustomaryLandPage() {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [alert, setAlert] = useState(null);

  // Mock customary lands data
  const [customaryLands] = useState([
    {
      id: 'STL-2024-001',
      stool_name: 'Ga Mantse Stool',
      traditional_area: 'Greater Accra',
      location: 'Accra Metropolitan',
      land_type: 'Stool Land',
      total_area: '2,500 hectares',
      chief: 'Nii Tackie Teiko Tsuru II',
      secretary: 'Nii Armah Ashitey',
      contact: '+233 24 123 4567',
      registered_parcels: 450,
      pending_allocations: 12,
      status: 'Active',
      allocations: [
        { id: 'ALL-001', applicant: 'Kofi Mensah', purpose: 'Residential', area: '0.5 acres', status: 'Approved', date: '2024-10-15' },
        { id: 'ALL-002', applicant: 'ABC Construction Ltd', purpose: 'Commercial', area: '2 acres', status: 'Pending Chief Consent', date: '2024-11-01' },
        { id: 'ALL-003', applicant: 'Ama Serwaa', purpose: 'Agricultural', area: '5 acres', status: 'Under Review', date: '2024-11-10' }
      ]
    },
    {
      id: 'STL-2024-002',
      stool_name: 'Asantehene Golden Stool',
      traditional_area: 'Ashanti',
      location: 'Kumasi Metropolitan',
      land_type: 'Stool Land',
      total_area: '15,000 hectares',
      chief: 'Otumfuo Osei Tutu II',
      secretary: 'Nana Baffour Asare',
      contact: '+233 20 234 5678',
      registered_parcels: 2340,
      pending_allocations: 45,
      status: 'Active',
      allocations: []
    },
    {
      id: 'SKN-2024-001',
      stool_name: 'Dagbon Skin',
      traditional_area: 'Northern',
      location: 'Tamale Metropolitan',
      land_type: 'Skin Land',
      total_area: '8,000 hectares',
      chief: 'Ya-Na Abukari II',
      secretary: 'Alhaji Iddrisu',
      contact: '+233 26 345 6789',
      registered_parcels: 890,
      pending_allocations: 23,
      status: 'Active',
      allocations: []
    },
    {
      id: 'FAM-2024-001',
      stool_name: 'Mensah Family Land',
      traditional_area: 'Greater Accra',
      location: 'Tema',
      land_type: 'Family Land',
      total_area: '50 hectares',
      chief: 'Nii Mensah III (Family Head)',
      secretary: 'Akosua Mensah',
      contact: '+233 27 456 7890',
      registered_parcels: 35,
      pending_allocations: 3,
      status: 'Active',
      allocations: []
    }
  ]);

  const [newAllocation, setNewAllocation] = useState({
    stool_id: '',
    applicant_name: '',
    applicant_id: '',
    purpose: '',
    area_requested: '',
    location_description: ''
  });

  const handleRequestAllocation = () => {
    setAlert({ type: 'success', message: 'Allocation request submitted. Awaiting traditional authority consent.' });
    setDialogOpen(false);
  };

  const handleGrantConsent = () => {
    setAlert({ type: 'success', message: 'Consent granted by Traditional Authority. Allocation letter will be issued.' });
    setConsentDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
            Customary Land Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage stool, skin, and family lands with traditional authority integration
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#006B3F' }}
        >
          Request Allocation
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#006B3F', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {customaryLands.filter(l => l.land_type === 'Stool Land').length}
              </Typography>
              <Typography variant="body2">Stool Lands</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#FCD116', color: '#333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {customaryLands.filter(l => l.land_type === 'Skin Land').length}
              </Typography>
              <Typography variant="body2">Skin Lands</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#CE1126', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {customaryLands.filter(l => l.land_type === 'Family Land').length}
              </Typography>
              <Typography variant="body2">Family Lands</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {customaryLands.reduce((sum, l) => sum + l.pending_allocations, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Pending Allocations</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="All Customary Lands" />
          <Tab label="Stool Lands" />
          <Tab label="Skin Lands" />
          <Tab label="Family Lands" />
        </Tabs>
      </Paper>

      {/* Customary Lands Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Stool/Skin/Family Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Traditional Area</TableCell>
              <TableCell>Chief/Head</TableCell>
              <TableCell>Total Area</TableCell>
              <TableCell>Registered</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customaryLands
              .filter(land => tabValue === 0 ||
                (tabValue === 1 && land.land_type === 'Stool Land') ||
                (tabValue === 2 && land.land_type === 'Skin Land') ||
                (tabValue === 3 && land.land_type === 'Family Land'))
              .map((land) => (
              <TableRow key={land.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{land.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{land.stool_name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={land.land_type}
                    size="small"
                    color={land.land_type === 'Stool Land' ? 'success' : land.land_type === 'Skin Land' ? 'warning' : 'error'}
                  />
                </TableCell>
                <TableCell>{land.traditional_area}</TableCell>
                <TableCell>
                  <Typography variant="body2">{land.chief}</Typography>
                </TableCell>
                <TableCell>{land.total_area}</TableCell>
                <TableCell>{land.registered_parcels}</TableCell>
                <TableCell>
                  <Chip label={land.pending_allocations} size="small" color={land.pending_allocations > 0 ? 'warning' : 'default'} />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => { setSelectedLand(land); setDetailDialogOpen(true); }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Request Allocation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Request Land Allocation
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Customary land allocations require consent from the Traditional Authority (Chief/Family Head)
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Stool/Skin/Family</InputLabel>
                <Select
                  value={newAllocation.stool_id}
                  onChange={(e) => setNewAllocation({ ...newAllocation, stool_id: e.target.value })}
                  label="Select Stool/Skin/Family"
                >
                  {customaryLands.map(land => (
                    <MenuItem key={land.id} value={land.id}>{land.stool_name} ({land.land_type})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Applicant Full Name"
                value={newAllocation.applicant_name}
                onChange={(e) => setNewAllocation({ ...newAllocation, applicant_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ghana Card / ID Number"
                value={newAllocation.applicant_id}
                onChange={(e) => setNewAllocation({ ...newAllocation, applicant_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Purpose</InputLabel>
                <Select
                  value={newAllocation.purpose}
                  onChange={(e) => setNewAllocation({ ...newAllocation, purpose: e.target.value })}
                  label="Purpose"
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Agricultural">Agricultural</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Mixed Use">Mixed Use</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Area Requested"
                value={newAllocation.area_requested}
                onChange={(e) => setNewAllocation({ ...newAllocation, area_requested: e.target.value })}
                placeholder="e.g., 0.5 acres"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Location Description"
                value={newAllocation.location_description}
                onChange={(e) => setNewAllocation({ ...newAllocation, location_description: e.target.value })}
                placeholder="Describe the specific location within the customary land..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRequestAllocation}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Land Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedLand && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedLand.stool_name}</Typography>
                <Chip label={selectedLand.land_type} color="primary" />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Traditional Authority Info */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        <AccountBalance sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                        Traditional Authority
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><Person sx={{ fontSize: 20 }} /></ListItemIcon>
                          <ListItemText primary="Chief/Head" secondary={selectedLand.chief} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Person sx={{ fontSize: 20 }} /></ListItemIcon>
                          <ListItemText primary="Secretary" secondary={selectedLand.secretary} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationOn sx={{ fontSize: 20 }} /></ListItemIcon>
                          <ListItemText primary="Location" secondary={selectedLand.location} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Statistics */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Land Statistics</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Total Area</Typography>
                          <Typography variant="body1" fontWeight="bold">{selectedLand.total_area}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Registered Parcels</Typography>
                          <Typography variant="body1" fontWeight="bold">{selectedLand.registered_parcels}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Pending Allocations</Typography>
                          <Typography variant="body1" fontWeight="bold" color="warning.main">{selectedLand.pending_allocations}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Typography variant="body1">
                            <Chip label={selectedLand.status} size="small" color="success" />
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recent Allocations */}
                {selectedLand.allocations && selectedLand.allocations.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>Recent Allocation Requests</Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Applicant</TableCell>
                                <TableCell>Purpose</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedLand.allocations.map((alloc) => (
                                <TableRow key={alloc.id}>
                                  <TableCell>{alloc.id}</TableCell>
                                  <TableCell>{alloc.applicant}</TableCell>
                                  <TableCell>{alloc.purpose}</TableCell>
                                  <TableCell>{alloc.area}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={alloc.status}
                                      size="small"
                                      color={alloc.status === 'Approved' ? 'success' : alloc.status === 'Pending Chief Consent' ? 'warning' : 'default'}
                                    />
                                  </TableCell>
                                  <TableCell>{alloc.date}</TableCell>
                                  <TableCell>
                                    {alloc.status === 'Pending Chief Consent' && (
                                      <Button size="small" onClick={() => setConsentDialogOpen(true)}>
                                        Grant Consent
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Consent Dialog */}
      <Dialog open={consentDialogOpen} onClose={() => setConsentDialogOpen(false)}>
        <DialogTitle>
          <HowToVote sx={{ mr: 1, verticalAlign: 'middle' }} />
          Traditional Authority Consent
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            By granting consent, the Traditional Authority approves this land allocation request.
          </Alert>
          <Typography variant="body2" paragraph>
            This action will:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" sx={{ fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary="Issue allocation letter to applicant" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" sx={{ fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary="Register allocation in Lands Commission records" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" sx={{ fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary="Enable applicant to apply for formal title registration" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleGrantConsent} startIcon={<Verified />}>
            Grant Consent
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
