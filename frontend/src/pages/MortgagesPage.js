import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button, Alert, Box,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Divider
} from '@mui/material';
import { AccountBalance, Add, CheckCircle, Cancel, Visibility, MonetizationOn } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function MortgagesPage() {
  const { user } = useAuth();
  const [mortgages, setMortgages] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMortgage, setSelectedMortgage] = useState(null);
  const [formData, setFormData] = useState({
    parcel_id: '',
    lender_name: '',
    lender_contact: '',
    borrower_id: '',
    loan_amount: '',
    interest_rate: '',
    duration_months: '240',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const canManageMortgages = user && (user.role === 'admin' || user.role === 'lands_officer');

  useEffect(() => {
    fetchMortgages();
    if (canManageMortgages) {
      fetchParcels();
      fetchUsers();
    }
  }, [canManageMortgages]);

  const fetchMortgages = async () => {
    try {
      const response = await api.get('/mortgages');
      setMortgages(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mortgages:', error);
      setLoading(false);
    }
  };

  const fetchParcels = async () => {
    try {
      const response = await api.get('/parcels');
      setParcels(response.data.data);
    } catch (error) {
      console.error('Error fetching parcels:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/demo-users');
      setUsers(response.data.users.filter(u => u.role === 'citizen'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRegisterMortgage = async () => {
    try {
      if (!formData.parcel_id || !formData.lender_name || !formData.borrower_id || !formData.loan_amount) {
        setAlert({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }

      await api.post('/mortgages', formData);
      setAlert({ type: 'success', message: 'Mortgage registered successfully' });
      setRegisterDialogOpen(false);
      fetchMortgages();
      setFormData({
        parcel_id: '',
        lender_name: '',
        lender_contact: '',
        borrower_id: '',
        loan_amount: '',
        interest_rate: '',
        duration_months: '240',
        start_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to register mortgage' });
    }
  };

  const handleDischargeMortgage = async (mortgageId) => {
    try {
      await api.put(`/mortgages/${mortgageId}/discharge`, { notes: 'Mortgage discharged' });
      setAlert({ type: 'success', message: 'Mortgage discharged successfully' });
      setDetailDialogOpen(false);
      fetchMortgages();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to discharge mortgage' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'discharged': return 'default';
      case 'foreclosed': return 'error';
      case 'defaulted': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            Mortgage Registration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage property mortgages and encumbrances
          </Typography>
        </Box>
        {canManageMortgages && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setRegisterDialogOpen(true)}
            sx={{ bgcolor: '#006B3F', '&:hover': { bgcolor: '#005030' } }}
          >
            Register Mortgage
          </Button>
        )}
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalance sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {mortgages.filter(m => m.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Mortgages
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignments="center">
                <CheckCircle sx={{ fontSize: 40, color: '#666', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {mortgages.filter(m => m.status === 'discharged').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discharged
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MonetizationOn sx={{ fontSize: 40, color: '#FCD116', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    GHS {mortgages.filter(m => m.status === 'active').reduce((sum, m) => sum + m.loan_amount, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Active Loans
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mortgages Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Mortgage Records</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mortgage ID</TableCell>
                    <TableCell>Lender</TableCell>
                    <TableCell>Parcel</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mortgages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No mortgages registered yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mortgages.map((mortgage) => (
                      <TableRow key={mortgage.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {mortgage.mortgage_id}
                          </Typography>
                        </TableCell>
                        <TableCell>{mortgage.lender_name}</TableCell>
                        <TableCell>{mortgage.parcel_id || 'N/A'}</TableCell>
                        <TableCell>GHS {mortgage.loan_amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(mortgage.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={mortgage.status} size="small" color={getStatusColor(mortgage.status)} />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => {
                              setSelectedMortgage(mortgage);
                              setDetailDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Register Mortgage Dialog */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Register New Mortgage</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Parcel *"
                  value={formData.parcel_id}
                  onChange={(e) => setFormData({ ...formData, parcel_id: e.target.value })}
                >
                  {parcels.map((parcel) => (
                    <MenuItem key={parcel.id} value={parcel.id}>
                      {parcel.parcel_id} - {parcel.location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lender Name *"
                  value={formData.lender_name}
                  onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                  placeholder="e.g., GCB Bank"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lender Contact"
                  value={formData.lender_contact}
                  onChange={(e) => setFormData({ ...formData, lender_contact: e.target.value })}
                  placeholder="+233..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Borrower *"
                  value={formData.borrower_id}
                  onChange={(e) => setFormData({ ...formData, borrower_id: e.target.value })}
                >
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Loan Amount (GHS) *"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Interest Rate (%)"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (months)"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date *"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRegisterMortgage}>
            Register Mortgage
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mortgage Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedMortgage && (
          <>
            <DialogTitle>Mortgage Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Mortgage ID</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {selectedMortgage.mortgage_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedMortgage.status} color={getStatusColor(selectedMortgage.status)} />
                  </Box>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Lender</Typography>
                  <Typography variant="body1">{selectedMortgage.lender_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Lender Contact</Typography>
                  <Typography variant="body1">{selectedMortgage.lender_contact || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Borrower</Typography>
                  <Typography variant="body1">{selectedMortgage.borrower_name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Parcel</Typography>
                  <Typography variant="body1">{selectedMortgage.parcel_id || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Loan Amount</Typography>
                  <Typography variant="h6" color="primary">GHS {selectedMortgage.loan_amount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
                  <Typography variant="body1">{selectedMortgage.interest_rate}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">{new Date(selectedMortgage.start_date).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Maturity Date</Typography>
                  <Typography variant="body1">{new Date(selectedMortgage.maturity_date).toLocaleDateString()}</Typography>
                </Grid>
                {selectedMortgage.discharged_at && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Discharged At</Typography>
                    <Typography variant="body1">{new Date(selectedMortgage.discharged_at).toLocaleString()}</Typography>
                  </Grid>
                )}
                {selectedMortgage.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Notes</Typography>
                    <Typography variant="body2">{selectedMortgage.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              {canManageMortgages && selectedMortgage.status === 'active' && (
                <Button
                  color="success"
                  variant="contained"
                  startIcon={<CheckCircle />}
                  onClick={() => handleDischargeMortgage(selectedMortgage.id)}
                >
                  Discharge Mortgage
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
