import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Sync, Payment, Calculate } from '@mui/icons-material';
import api from '../services/api';

export default function IntegrationsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gelisLoading, setGelisLoading] = useState(false);
  const [momoLoading, setMomoLoading] = useState(false);
  const [graLoading, setGraLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mobile Money form
  const [momoData, setMomoData] = useState({
    amount: '',
    phone_number: '',
    provider: 'MTN'
  });

  // GRA Stamp Duty form
  const [graData, setGraData] = useState({
    property_value: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/integrations/logs');
      setLogs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const handleGelisSync = async () => {
    setGelisLoading(true);
    setAlert(null);
    try {
      const response = await api.post('/integrations/gelis/sync');
      setAlert({ type: 'success', message: response.data.message });
      fetchLogs();
    } catch (error) {
      setAlert({ type: 'error', message: 'GELIS sync failed' });
    } finally {
      setGelisLoading(false);
    }
  };

  const handleMomoPayment = async () => {
    if (!momoData.amount || !momoData.phone_number) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setMomoLoading(true);
    setAlert(null);
    try {
      const response = await api.post('/integrations/momo/pay', momoData);
      if (response.data.success) {
        setAlert({
          type: 'success',
          message: `Payment successful! Reference: ${response.data.reference}`
        });
        setMomoData({ amount: '', phone_number: '', provider: 'MTN' });
        fetchLogs();
      } else {
        setAlert({ type: 'error', message: 'Payment failed. Please try again.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Payment processing error' });
    } finally {
      setMomoLoading(false);
    }
  };

  const handleGraCalculation = async () => {
    if (!graData.property_value) {
      setAlert({ type: 'error', message: 'Please enter property value' });
      return;
    }

    setGraLoading(true);
    setAlert(null);
    try {
      const response = await api.post('/integrations/gra/stamp-duty', graData);
      setAlert({
        type: 'info',
        message: `Stamp Duty: GHS ${response.data.stamp_duty.toFixed(2)} (${response.data.rate}%)`
      });
      fetchLogs();
    } catch (error) {
      setAlert({ type: 'error', message: 'GRA calculation failed' });
    } finally {
      setGraLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
        External System Integrations
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Test integrations with GELIS, Mobile Money, and Ghana Revenue Authority
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* GELIS Integration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Sync sx={{ fontSize: 40, color: '#006B3F', mr: 2 }} />
                <Typography variant="h6">GELIS Sync</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Synchronize land data with Ghana Enterprise Land Information System
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last sync: Mock simulation
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGelisSync}
                disabled={gelisLoading}
                startIcon={gelisLoading ? <CircularProgress size={20} /> : <Sync />}
              >
                {gelisLoading ? 'Syncing...' : 'Sync Now'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Mobile Money Payment */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Payment sx={{ fontSize: 40, color: '#FCD116', mr: 2 }} />
                <Typography variant="h6">Mobile Money</Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={momoData.provider}
                  onChange={(e) => setMomoData({ ...momoData, provider: e.target.value })}
                  label="Provider"
                >
                  <MenuItem value="MTN">MTN Mobile Money</MenuItem>
                  <MenuItem value="Vodafone">Vodafone Cash</MenuItem>
                  <MenuItem value="AirtelTigo">AirtelTigo Money</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="0244123456"
                value={momoData.phone_number}
                onChange={(e) => setMomoData({ ...momoData, phone_number: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Amount (GHS)"
                type="number"
                value={momoData.amount}
                onChange={(e) => setMomoData({ ...momoData, amount: e.target.value })}
              />
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleMomoPayment}
                disabled={momoLoading}
                startIcon={momoLoading ? <CircularProgress size={20} /> : <Payment />}
              >
                {momoLoading ? 'Processing...' : 'Make Payment'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* GRA Stamp Duty */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Calculate sx={{ fontSize: 40, color: '#CE1126', mr: 2 }} />
                <Typography variant="h6">GRA Stamp Duty</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Calculate stamp duty with Ghana Revenue Authority
              </Typography>
              <TextField
                fullWidth
                label="Property Value (GHS)"
                type="number"
                value={graData.property_value}
                onChange={(e) => setGraData({ ...graData, property_value: e.target.value })}
                placeholder="150000"
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Rate: 1.5% of property value
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGraCalculation}
                disabled={graLoading}
                startIcon={graLoading ? <CircularProgress size={20} /> : <Calculate />}
              >
                {graLoading ? 'Calculating...' : 'Calculate Duty'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Integration Logs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Integration Logs</Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>System</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No integration logs yet. Try testing an integration above.
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <Chip
                                label={log.system}
                                size="small"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>
                              <Chip
                                label={log.status}
                                size="small"
                                color={log.status === 'success' ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(log.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {log.request_data}
                              </Typography>
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
        </Grid>
      </Grid>
    </Container>
  );
}
