import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Divider, Alert, LinearProgress
} from '@mui/material';
import {
  EventNote, Refresh, Warning, NotificationsActive, Description, Add,
  Business, Person, CalendarMonth
} from '@mui/icons-material';

export default function LeaseManagementPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [newLeaseOpen, setNewLeaseOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState(null);

  // Mock lease data
  const leases = [
    {
      id: 1,
      leaseNumber: 'LSE/2024/001',
      parcelId: 'ACC/2024/001',
      location: 'East Legon, Accra',
      lessor: 'Ghana Lands Commission',
      lessee: 'Accra Business Center Ltd',
      leaseType: 'Government Lease',
      purpose: 'Commercial',
      startDate: '2019-01-01',
      endDate: '2069-01-01',
      duration: 50,
      annualRent: 25000,
      nextPayment: '2025-01-01',
      paymentStatus: 'Paid',
      daysUntilExpiry: 16436,
      status: 'Active'
    },
    {
      id: 2,
      leaseNumber: 'LSE/2024/002',
      parcelId: 'ASH/2024/015',
      location: 'Adum, Kumasi',
      lessor: 'Asantehene Stool',
      lessee: 'Kumasi Traders Association',
      leaseType: 'Stool Land Lease',
      purpose: 'Commercial',
      startDate: '2015-06-01',
      endDate: '2025-06-01',
      duration: 10,
      annualRent: 15000,
      nextPayment: '2025-06-01',
      paymentStatus: 'Due Soon',
      daysUntilExpiry: 195,
      status: 'Expiring Soon'
    },
    {
      id: 3,
      leaseNumber: 'LSE/2024/003',
      parcelId: 'WES/2024/008',
      location: 'Takoradi Port Area',
      lessor: 'Ghana Ports Authority',
      lessee: 'Western Shipping Co',
      leaseType: 'Special Purpose',
      purpose: 'Industrial',
      startDate: '2010-03-15',
      endDate: '2025-03-15',
      duration: 15,
      annualRent: 45000,
      nextPayment: '2025-03-15',
      paymentStatus: 'Overdue',
      daysUntilExpiry: 117,
      status: 'Expiring Soon'
    },
    {
      id: 4,
      leaseNumber: 'LSE/2024/004',
      parcelId: 'NOR/2024/022',
      location: 'Tamale Agricultural Zone',
      lessor: 'Northern Regional Lands',
      lessee: 'Agri-Business Ghana Ltd',
      leaseType: 'Agricultural Lease',
      purpose: 'Agricultural',
      startDate: '2020-01-01',
      endDate: '2045-01-01',
      duration: 25,
      annualRent: 8000,
      nextPayment: '2025-01-01',
      paymentStatus: 'Paid',
      daysUntilExpiry: 7336,
      status: 'Active'
    },
    {
      id: 5,
      leaseNumber: 'LSE/2024/005',
      parcelId: 'ACC/2024/045',
      location: 'Airport City, Accra',
      lessor: 'Ghana Civil Aviation',
      lessee: 'Skyview Hotels Ltd',
      leaseType: 'Government Lease',
      purpose: 'Commercial',
      startDate: '2018-07-01',
      endDate: '2024-07-01',
      duration: 6,
      annualRent: 35000,
      nextPayment: '2024-07-01',
      paymentStatus: 'Expired',
      daysUntilExpiry: -140,
      status: 'Expired'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expiring Soon': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Due Soon': return 'warning';
      case 'Overdue': return 'error';
      case 'Expired': return 'default';
      default: return 'default';
    }
  };

  const handleViewDetails = (lease) => {
    setSelectedLease(lease);
    setDialogOpen(true);
  };

  const handleRenew = (lease) => {
    setSelectedLease(lease);
    setRenewDialogOpen(true);
  };

  const handleSubmitRenewal = () => {
    setAlert({ type: 'success', message: 'Lease renewal application submitted. Reference: REN/2024/089' });
    setRenewDialogOpen(false);
  };

  const handleNewLease = () => {
    setNewLeaseOpen(true);
  };

  const handleSubmitNewLease = () => {
    setAlert({ type: 'success', message: 'New lease application submitted successfully.' });
    setNewLeaseOpen(false);
  };

  const filteredLeases = filterStatus === 'all'
    ? leases
    : leases.filter(l => l.status === filterStatus);

  const activeCount = leases.filter(l => l.status === 'Active').length;
  const expiringCount = leases.filter(l => l.status === 'Expiring Soon').length;
  const expiredCount = leases.filter(l => l.status === 'Expired').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <EventNote sx={{ mr: 1, verticalAlign: 'middle' }} />
            Lease Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage land leases, renewals, and payments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewLease}
          sx={{ bgcolor: '#006B3F' }}
        >
          New Lease
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#006B3F', color: 'white' }}>
            <CardContent>
              <EventNote sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{activeCount}</Typography>
              <Typography variant="body2">Active Leases</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FCD116', color: '#333' }}>
            <CardContent>
              <Warning sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{expiringCount}</Typography>
              <Typography variant="body2">Expiring Soon</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#CE1126', color: 'white' }}>
            <CardContent>
              <NotificationsActive sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{expiredCount}</Typography>
              <Typography variant="body2">Expired</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leases Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Lease Records</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter Status"
            >
              <MenuItem value="all">All Leases</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Expiring Soon">Expiring Soon</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lease No.</TableCell>
                <TableCell>Lessee</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Annual Rent</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeases.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {lease.leaseNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {lease.lessee.includes('Ltd') ? <Business fontSize="small" /> : <Person fontSize="small" />}
                      <Typography variant="body2">{lease.lessee}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{lease.location}</TableCell>
                  <TableCell>{lease.duration} years</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      GHS {lease.annualRent.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(lease.endDate).toLocaleDateString()}
                      </Typography>
                      {lease.daysUntilExpiry > 0 ? (
                        <Typography variant="caption" color="text.secondary">
                          {lease.daysUntilExpiry} days left
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="error">
                          Expired
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lease.status}
                      size="small"
                      color={getStatusColor(lease.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleViewDetails(lease)}>
                      View
                    </Button>
                    {(lease.status === 'Expiring Soon' || lease.status === 'Expired') && (
                      <Button
                        size="small"
                        color="warning"
                        startIcon={<Refresh />}
                        onClick={() => handleRenew(lease)}
                      >
                        Renew
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Lease Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedLease && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Lease Details</Typography>
                <Chip
                  label={selectedLease.status}
                  color={getStatusColor(selectedLease.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Lease Number</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedLease.leaseNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parcel ID</Typography>
                  <Typography variant="body1">{selectedLease.parcelId}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{selectedLease.location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Lessor</Typography>
                  <Typography variant="body1">{selectedLease.lessor}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Lessee</Typography>
                  <Typography variant="body1">{selectedLease.lessee}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Lease Type</Typography>
                  <Typography variant="body1">{selectedLease.leaseType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Purpose</Typography>
                  <Typography variant="body1">{selectedLease.purpose}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">
                    {new Date(selectedLease.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">End Date</Typography>
                  <Typography variant="body1">
                    {new Date(selectedLease.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Duration</Typography>
                  <Typography variant="body1">{selectedLease.duration} years</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Annual Rent</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    GHS {selectedLease.annualRent.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                  <Chip
                    label={selectedLease.paymentStatus}
                    color={getPaymentColor(selectedLease.paymentStatus)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                {selectedLease.daysUntilExpiry > 0 && selectedLease.daysUntilExpiry < 365 && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      This lease expires in {selectedLease.daysUntilExpiry} days.
                      Consider submitting a renewal application.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Description />}>
                Download Agreement
              </Button>
              {(selectedLease.status === 'Expiring Soon' || selectedLease.status === 'Expired') && (
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={() => {
                    setDialogOpen(false);
                    handleRenew(selectedLease);
                  }}
                  sx={{ bgcolor: '#006B3F' }}
                >
                  Apply for Renewal
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog
        open={renewDialogOpen}
        onClose={() => setRenewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedLease && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Refresh />
                Lease Renewal Application
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Renewing lease: <strong>{selectedLease.leaseNumber}</strong>
                </Alert>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Renewal Period</InputLabel>
                  <Select label="Renewal Period" defaultValue="">
                    <MenuItem value="5">5 Years</MenuItem>
                    <MenuItem value="10">10 Years</MenuItem>
                    <MenuItem value="25">25 Years</MenuItem>
                    <MenuItem value="50">50 Years</MenuItem>
                    <MenuItem value="99">99 Years</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Proposed Annual Rent"
                  type="number"
                  sx={{ mb: 2 }}
                  defaultValue={selectedLease.annualRent}
                  helperText="Subject to lessor approval and market valuation"
                />
                <TextField
                  fullWidth
                  label="Reason for Renewal"
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <Alert severity="warning">
                  Renewal processing fee: GHS 2,000 - 10,000 depending on lease type and duration.
                  Processing time: 30-60 days.
                </Alert>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRenewDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmitRenewal}
                sx={{ bgcolor: '#006B3F' }}
              >
                Submit Renewal
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Lease Dialog */}
      <Dialog
        open={newLeaseOpen}
        onClose={() => setNewLeaseOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>New Lease Application</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parcel ID" placeholder="e.g., ACC/2024/001" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Lease Type</InputLabel>
                  <Select label="Lease Type" defaultValue="">
                    <MenuItem value="government">Government Lease</MenuItem>
                    <MenuItem value="stool">Stool Land Lease</MenuItem>
                    <MenuItem value="family">Family Land Lease</MenuItem>
                    <MenuItem value="private">Private Lease</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Lessee Name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Lessee Contact" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Purpose</InputLabel>
                  <Select label="Purpose" defaultValue="">
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="agricultural">Agricultural</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select label="Duration" defaultValue="">
                    <MenuItem value="5">5 Years</MenuItem>
                    <MenuItem value="10">10 Years</MenuItem>
                    <MenuItem value="25">25 Years</MenuItem>
                    <MenuItem value="50">50 Years</MenuItem>
                    <MenuItem value="99">99 Years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Proposed Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Proposed Annual Rent (GHS)"
                  type="number"
                />
              </Grid>
            </Grid>
            <Alert severity="info" sx={{ mt: 2 }}>
              Required documents: ID, Company registration (if applicable), Site plan,
              Consent from lessor, Tax clearance certificate
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLeaseOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitNewLease}
            sx={{ bgcolor: '#006B3F' }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
