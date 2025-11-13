import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Payment, AddCircle, AccountBalance, CheckCircle, PendingActions } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [paymentData, setPaymentData] = useState({
    application_id: '',
    amount: '',
    payment_method: 'mobile_money',
    reference_number: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreatePayment = async () => {
    if (!paymentData.amount) {
      setAlert({ type: 'error', message: 'Please enter payment amount' });
      return;
    }

    setProcessing(true);
    setAlert(null);
    try {
      const response = await api.post('/payments', paymentData);
      setAlert({
        type: 'success',
        message: `Payment recorded successfully! Reference: ${response.data.data.reference_number}`
      });
      setPaymentDialogOpen(false);
      setPaymentData({ application_id: '', amount: '', payment_method: 'mobile_money', reference_number: '' });
      fetchPayments();
      fetchStats();
    } catch (error) {
      setAlert({ type: 'error', message: 'Payment processing failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const filteredPayments = filterStatus === 'all'
    ? payments
    : payments.filter(p => p.status === filterStatus);

  const canCreatePayment = user && (user.role === 'admin' || user.role === 'lands_officer' || user.role === 'citizen');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            Payment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage land transaction payments
          </Typography>
        </Box>
        {canCreatePayment && (
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => setPaymentDialogOpen(true)}
          >
            Record Payment
          </Button>
        )}
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountBalance sx={{ fontSize: 40, color: '#006B3F', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      GHS {stats.total_revenue?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
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
                  <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {payments.filter(p => p.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Payments
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
                  <PendingActions sx={{ fontSize: 40, color: '#FCD116', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {payments.filter(p => p.status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Payments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payments Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Payment History</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter Status"
              >
                <MenuItem value="all">All Payments</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference #</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Amount (GHS)</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {filterStatus === 'all'
                          ? 'No payments recorded yet.'
                          : `No ${filterStatus} payments found.`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {payment.reference_number}
                          </Typography>
                        </TableCell>
                        <TableCell>User #{payment.user_id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {payment.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.payment_method}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            size="small"
                            color={
                              payment.status === 'completed' ? 'success' :
                              payment.status === 'pending' ? 'warning' :
                              'error'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(payment.created_at).toLocaleDateString()}
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

      {/* Create Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Payment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Application ID (optional)"
            value={paymentData.application_id}
            onChange={(e) => setPaymentData({ ...paymentData, application_id: e.target.value })}
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            label="Amount (GHS)"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            margin="normal"
            type="number"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentData.payment_method}
              onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
              label="Payment Method"
            >
              <MenuItem value="mobile_money">Mobile Money</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card Payment</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Reference Number (optional)"
            value={paymentData.reference_number}
            onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
            margin="normal"
            placeholder="Auto-generated if empty"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Payment will be recorded with status 'pending' and require confirmation.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePayment}
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <Payment />}
          >
            {processing ? 'Recording...' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
