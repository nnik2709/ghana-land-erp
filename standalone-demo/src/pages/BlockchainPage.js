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
  DialogActions
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function BlockchainPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [mintDialogOpen, setMintDialogOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintData, setMintData] = useState({
    parcel_id: '',
    owner_id: '',
    metadata: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/blockchain/transactions');
      setTransactions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/blockchain/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMintToken = async () => {
    if (!mintData.parcel_id || !mintData.owner_id) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setMinting(true);
    setAlert(null);
    try {
      const response = await api.post('/blockchain/mint', mintData);
      setAlert({
        type: 'success',
        message: `Token minted successfully! TX: ${response.data.tx_hash}`
      });
      setMintDialogOpen(false);
      setMintData({ parcel_id: '', owner_id: '', metadata: '' });
      fetchTransactions();
      fetchStats();
    } catch (error) {
      setAlert({ type: 'error', message: 'Minting failed. Please try again.' });
    } finally {
      setMinting(false);
    }
  };

  const canMint = user && (user.role === 'admin' || user.role === 'lands_officer');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            Blockchain Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Immutable land ownership records on Hyperledger Fabric
          </Typography>
        </Box>
        {canMint && (
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => setMintDialogOpen(true)}
          >
            Mint Token
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
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.total_transactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.tokens_minted}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tokens Minted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.latest_block}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest Block
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Transactions Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transaction History
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction Hash</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Block #</TableCell>
                    <TableCell>Token ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No blockchain transactions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {tx.transaction_hash ? tx.transaction_hash.substring(0, 20) + '...' : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tx.transaction_type || 'UNKNOWN'}
                            size="small"
                            color={tx.transaction_type === 'MINT' ? 'success' : 'primary'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            #{tx.block_number || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {tx.token_id || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Confirmed"
                            size="small"
                            color="success"
                          />
                        </TableCell>
                        <TableCell>
                          {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}
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

      {/* Mint Token Dialog */}
      <Dialog open={mintDialogOpen} onClose={() => setMintDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mint Land Ownership Token</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Parcel ID"
            value={mintData.parcel_id}
            onChange={(e) => setMintData({ ...mintData, parcel_id: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Owner ID (User ID)"
            value={mintData.owner_id}
            onChange={(e) => setMintData({ ...mintData, owner_id: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Metadata (JSON)"
            value={mintData.metadata}
            onChange={(e) => setMintData({ ...mintData, metadata: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            placeholder='{"region": "Greater Accra", "size": "2.5 acres"}'
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This will create an immutable blockchain record representing land ownership.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMintDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleMintToken}
            variant="contained"
            disabled={minting}
            startIcon={minting ? <CircularProgress size={20} /> : <AddCircle />}
          >
            {minting ? 'Minting...' : 'Mint Token'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
