import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Download,
  Print,
  Visibility,
  Receipt,
  CalendarMonth,
  Payment,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  FilterList,
  Search
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock billing history data
const mockBillingHistory = [
  {
    id: 1,
    billNumber: 'BILL-2024-001234',
    brn: 'BRN-2024-001234',
    property: '15 Independence Avenue, Accra',
    description: 'Annual Land Rent - 2024',
    amount: 1500.00,
    issueDate: '2024-01-01',
    dueDate: '2024-12-31',
    status: 'paid',
    paidDate: '2024-06-15',
    paymentRef: 'PAY-2024-567890'
  },
  {
    id: 2,
    billNumber: 'BILL-2024-001235',
    brn: 'BRN-2024-001234',
    property: '15 Independence Avenue, Accra',
    description: 'Survey Fee',
    amount: 500.00,
    issueDate: '2024-08-01',
    dueDate: '2024-11-30',
    status: 'pending',
    paidDate: null,
    paymentRef: null
  },
  {
    id: 3,
    billNumber: 'BILL-2024-001236',
    brn: 'BRN-2024-001234',
    property: '15 Independence Avenue, Accra',
    description: 'Title Registration Fee',
    amount: 500.00,
    issueDate: '2024-09-01',
    dueDate: '2024-11-15',
    status: 'overdue',
    paidDate: null,
    paymentRef: null
  },
  {
    id: 4,
    billNumber: 'BILL-2024-002001',
    brn: 'BRN-2024-005678',
    property: '23 Liberation Road, Kumasi',
    description: 'Lease Rental - Q4 2024',
    amount: 1800.00,
    issueDate: '2024-10-01',
    dueDate: '2024-12-15',
    status: 'pending',
    paidDate: null,
    paymentRef: null
  },
  {
    id: 5,
    billNumber: 'BILL-2024-002002',
    brn: 'BRN-2024-005678',
    property: '23 Liberation Road, Kumasi',
    description: 'Lease Rental - Q3 2024',
    amount: 1800.00,
    issueDate: '2024-07-01',
    dueDate: '2024-09-15',
    status: 'paid',
    paidDate: '2024-09-10',
    paymentRef: 'PAY-2024-789012'
  },
  {
    id: 6,
    billNumber: 'BILL-2023-008765',
    brn: 'BRN-2024-001234',
    property: '15 Independence Avenue, Accra',
    description: 'Annual Land Rent - 2023',
    amount: 1400.00,
    issueDate: '2023-01-01',
    dueDate: '2023-12-31',
    status: 'paid',
    paidDate: '2023-11-20',
    paymentRef: 'PAY-2023-345678'
  }
];

// Mock payment history
const mockPaymentHistory = [
  {
    id: 1,
    paymentRef: 'PAY-2024-789012',
    brn: 'BRN-2024-005678',
    property: '23 Liberation Road, Kumasi',
    amount: 1800.00,
    paymentDate: '2024-09-10',
    paymentMethod: 'Credit Card',
    status: 'completed',
    bills: ['BILL-2024-002002']
  },
  {
    id: 2,
    paymentRef: 'PAY-2024-567890',
    brn: 'BRN-2024-001234',
    property: '15 Independence Avenue, Accra',
    amount: 1500.00,
    paymentDate: '2024-06-15',
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    bills: ['BILL-2024-001234']
  },
  {
    id: 3,
    paymentRef: 'PAY-2023-345678',
    brn: 'BRN-2024-001234',
    property: '15 Independence Avenue, Accra',
    amount: 1400.00,
    paymentDate: '2023-11-20',
    paymentMethod: 'Mobile Money',
    status: 'completed',
    bills: ['BILL-2023-008765']
  }
];

export default function BillingHistoryPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Get unique properties for filter
  const uniqueProperties = [...new Set(mockBillingHistory.map(b => b.property))];
  const uniqueYears = [...new Set(mockBillingHistory.map(b => new Date(b.issueDate).getFullYear()))].sort((a, b) => b - a);

  // Filter bills
  const filteredBills = mockBillingHistory.filter(bill => {
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    const matchesProperty = filterProperty === 'all' || bill.property === filterProperty;
    const matchesYear = filterYear === 'all' || new Date(bill.issueDate).getFullYear().toString() === filterYear;
    const matchesSearch = searchTerm === '' ||
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesProperty && matchesYear && matchesSearch;
  });

  // Filter payments
  const filteredPayments = mockPaymentHistory.filter(payment => {
    const matchesProperty = filterProperty === 'all' || payment.property === filterProperty;
    const matchesYear = filterYear === 'all' || new Date(payment.paymentDate).getFullYear().toString() === filterYear;
    const matchesSearch = searchTerm === '' ||
      payment.paymentRef.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProperty && matchesYear && matchesSearch;
  });

  // Calculate totals
  const totalOutstanding = mockBillingHistory
    .filter(b => b.status === 'pending' || b.status === 'overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPaid = mockPaymentHistory.reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'pending': return <Warning fontSize="small" />;
      case 'overdue': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setBillDialogOpen(true);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handleDownload = (type, ref) => {
    setAlert({ type: 'success', message: `Downloading ${type} ${ref}...` });
    setTimeout(() => setAlert(null), 3000);
  };

  const handlePrint = (type, ref) => {
    setAlert({ type: 'success', message: `Preparing ${type} ${ref} for printing...` });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Billing History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your billing history and payment records
        </Typography>
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
              <Box display="flex" alignItems="center" gap={1}>
                <Receipt color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {mockBillingHistory.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Bills
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Warning color="error" />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  GHS {totalOutstanding.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Outstanding Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Payment color="success" />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  GHS {totalPaid.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Paid (All Time)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Bills" icon={<Receipt />} iconPosition="start" />
          <Tab label="Payments" icon={<Payment />} iconPosition="start" />
        </Tabs>

        {/* Filters */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FilterList color="action" />
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
            }}
            sx={{ minWidth: 200 }}
          />
          {tabValue === 0 && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          )}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Property</InputLabel>
            <Select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              label="Property"
            >
              <MenuItem value="all">All Properties</MenuItem>
              {uniqueProperties.map(prop => (
                <MenuItem key={prop} value={prop}>{prop}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              label="Year"
            >
              <MenuItem value="all">All</MenuItem>
              {uniqueYears.map(year => (
                <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Bills Tab */}
        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill Number</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No bills found matching your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {bill.billNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{bill.property}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bill.brn}
                        </Typography>
                      </TableCell>
                      <TableCell>{bill.description}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          GHS {bill.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(bill.status)}
                          label={bill.status}
                          size="small"
                          color={getStatusColor(bill.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewBill(bill)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small" onClick={() => handleDownload('bill', bill.billNumber)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                        {(bill.status === 'pending' || bill.status === 'overdue') && (
                          <Tooltip title="Pay Now">
                            <IconButton size="small" color="primary">
                              <Payment />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Payments Tab */}
        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment Reference</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No payments found matching your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {payment.paymentRef}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{payment.property}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.brn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          GHS {payment.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip label={payment.paymentMethod} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(payment.status)}
                          label={payment.status}
                          size="small"
                          color={getStatusColor(payment.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Receipt">
                          <IconButton size="small" onClick={() => handleViewPayment(payment)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Receipt">
                          <IconButton size="small" onClick={() => handleDownload('receipt', payment.paymentRef)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Receipt">
                          <IconButton size="small" onClick={() => handlePrint('receipt', payment.paymentRef)}>
                            <Print />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Bill Details Dialog */}
      <Dialog open={billDialogOpen} onClose={() => setBillDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent>
          {selectedBill && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                  {selectedBill.billNumber}
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedBill.status)}
                  label={selectedBill.status}
                  color={getStatusColor(selectedBill.status)}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                    <TableCell>{selectedBill.property}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>BRN</TableCell>
                    <TableCell>{selectedBill.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell>{selectedBill.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>GHS {selectedBill.amount.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Issue Date</TableCell>
                    <TableCell>{new Date(selectedBill.issueDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                    <TableCell>{new Date(selectedBill.dueDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  {selectedBill.paidDate && (
                    <>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Paid Date</TableCell>
                        <TableCell>{new Date(selectedBill.paidDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Payment Ref</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{selectedBill.paymentRef}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillDialogOpen(false)}>Close</Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload('bill', selectedBill?.billNumber)}
          >
            Download
          </Button>
          {(selectedBill?.status === 'pending' || selectedBill?.status === 'overdue') && (
            <Button variant="contained" startIcon={<Payment />}>
              Pay Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Box textAlign="center" mb={2}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                <Typography variant="h6">Payment Successful</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{selectedPayment.paymentRef}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                    <TableCell>{selectedPayment.property}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>BRN</TableCell>
                    <TableCell>{selectedPayment.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount Paid</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      GHS {selectedPayment.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Date</TableCell>
                    <TableCell>{new Date(selectedPayment.paymentDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell>{selectedPayment.paymentMethod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Bills Paid</TableCell>
                    <TableCell>{selectedPayment.bills.join(', ')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Close</Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload('receipt', selectedPayment?.paymentRef)}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => handlePrint('receipt', selectedPayment?.paymentRef)}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
