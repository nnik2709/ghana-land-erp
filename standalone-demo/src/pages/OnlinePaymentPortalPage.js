import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  TextField,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Payment,
  CreditCard,
  AccountBalance,
  Home,
  Search,
  Description,
  CheckCircle,
  Download,
  Print,
  Info,
  ArrowBack,
  ArrowForward,
  Receipt,
  Security
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock data for linked properties
const mockLinkedProperties = [
  {
    id: 1,
    brn: 'BRN-2024-001234',
    address: '15 Independence Avenue, Accra',
    titleNumber: 'GA-2024-00456',
    outstandingBalance: 2500.00,
    lastPaymentDate: '2024-08-15',
    propertyType: 'Residential'
  },
  {
    id: 2,
    brn: 'BRN-2024-005678',
    address: '23 Liberation Road, Kumasi',
    titleNumber: 'KU-2024-00789',
    outstandingBalance: 1800.00,
    lastPaymentDate: '2024-09-20',
    propertyType: 'Commercial'
  }
];

// Mock billing items
const mockBillingItems = [
  { id: 1, description: 'Annual Land Rent - 2024', amount: 1500.00, dueDate: '2024-12-31', status: 'due' },
  { id: 2, description: 'Survey Fee', amount: 500.00, dueDate: '2024-11-30', status: 'due' },
  { id: 3, description: 'Title Registration Fee', amount: 500.00, dueDate: '2024-11-15', status: 'overdue' }
];

export default function OnlinePaymentPortalPage() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('linked');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchBRN, setSearchBRN] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [paymentType, setPaymentType] = useState('card');
  const [selectedBills, setSelectedBills] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [paymentReference, setPaymentReference] = useState('');

  // Card payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Bank transfer details
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const steps = ['Select Property', 'Choose Bills', 'Payment Method', 'Confirm & Pay'];

  const handleNext = () => {
    if (activeStep === 0 && !selectedProperty) {
      setAlert({ type: 'error', message: 'Please select a property or search by BRN/Title' });
      return;
    }
    if (activeStep === 1 && selectedBills.length === 0) {
      setAlert({ type: 'error', message: 'Please select at least one bill to pay' });
      return;
    }
    setAlert(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setAlert(null);
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setAlert(null);
  };

  const handleBillToggle = (billId) => {
    setSelectedBills((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId]
    );
  };

  const getTotalAmount = () => {
    return mockBillingItems
      .filter((bill) => selectedBills.includes(bill.id))
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const handleSearchBRN = () => {
    // Mock search - in real app would call API
    const found = mockLinkedProperties.find(p => p.brn.toLowerCase().includes(searchBRN.toLowerCase()));
    if (found) {
      setSelectedProperty(found);
      setAlert({ type: 'success', message: 'Property found!' });
    } else {
      setAlert({ type: 'error', message: 'No property found with this BRN' });
    }
  };

  const handleSearchTitle = () => {
    // Mock search - in real app would call API
    const found = mockLinkedProperties.find(p => p.titleNumber.toLowerCase().includes(searchTitle.toLowerCase()));
    if (found) {
      setSelectedProperty(found);
      setAlert({ type: 'success', message: 'Property found!' });
    } else {
      setAlert({ type: 'error', message: 'No property found with this Title Number' });
    }
  };

  const handleProcessPayment = async () => {
    setProcessing(true);
    setConfirmDialogOpen(false);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate payment reference
    const ref = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setPaymentReference(ref);
    setProcessing(false);
    setPaymentComplete(true);
  };

  const handleDownloadReceipt = () => {
    // In real app, would generate PDF receipt
    alert('Receipt download started...');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const resetPayment = () => {
    setActiveStep(0);
    setSelectedProperty(null);
    setSelectedBills([]);
    setPaymentComplete(false);
    setPaymentReference('');
    setCardDetails({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
  };

  // Payment Complete Screen
  if (paymentComplete) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your payment has been processed successfully.
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mb: 3, maxWidth: 400, mx: 'auto' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Reference
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {paymentReference}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell align="right">{selectedProperty?.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BRN</TableCell>
                    <TableCell align="right">{selectedProperty?.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Amount Paid</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      GHS {getTotalAmount().toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">
                      {paymentType === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">{new Date().toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </Button>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrintReceipt}
              >
                Print Receipt
              </Button>
              <Button
                variant="contained"
                onClick={resetPayment}
              >
                Make Another Payment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Processing Screen
  if (processing) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Processing Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we process your payment...
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Do not close this window or refresh the page.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Online Payment Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Pay your land-related bills securely online using multiple payment options
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Select Property */}
      {activeStep === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              How would you like to find your property?
            </Typography>
          </Grid>

          {/* Method Selection Cards */}
          <Grid item xs={12} md={4}>
            <Card
              variant={paymentMethod === 'linked' ? 'elevation' : 'outlined'}
              sx={{
                border: paymentMethod === 'linked' ? '2px solid #006B3F' : undefined,
                height: '100%'
              }}
            >
              <CardActionArea onClick={() => setPaymentMethod('linked')} sx={{ height: '100%', p: 2 }}>
                <Box textAlign="center">
                  <Home sx={{ fontSize: 48, color: paymentMethod === 'linked' ? '#006B3F' : 'text.secondary' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    My Linked Properties
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select from properties linked to your account
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              variant={paymentMethod === 'brn' ? 'elevation' : 'outlined'}
              sx={{
                border: paymentMethod === 'brn' ? '2px solid #006B3F' : undefined,
                height: '100%'
              }}
            >
              <CardActionArea onClick={() => setPaymentMethod('brn')} sx={{ height: '100%', p: 2 }}>
                <Box textAlign="center">
                  <Receipt sx={{ fontSize: 48, color: paymentMethod === 'brn' ? '#006B3F' : 'text.secondary' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Search by BRN
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use your Billing Reference Number
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              variant={paymentMethod === 'title' ? 'elevation' : 'outlined'}
              sx={{
                border: paymentMethod === 'title' ? '2px solid #006B3F' : undefined,
                height: '100%'
              }}
            >
              <CardActionArea onClick={() => setPaymentMethod('title')} sx={{ height: '100%', p: 2 }}>
                <Box textAlign="center">
                  <Description sx={{ fontSize: 48, color: paymentMethod === 'title' ? '#006B3F' : 'text.secondary' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Search by Title
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use your Title Reference Number
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Property Selection Content */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />

            {paymentMethod === 'linked' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Your Linked Properties
                </Typography>
                <Grid container spacing={2}>
                  {mockLinkedProperties.map((property) => (
                    <Grid item xs={12} md={6} key={property.id}>
                      <Card
                        variant={selectedProperty?.id === property.id ? 'elevation' : 'outlined'}
                        sx={{
                          border: selectedProperty?.id === property.id ? '2px solid #006B3F' : undefined,
                          cursor: 'pointer'
                        }}
                        onClick={() => handlePropertySelect(property)}
                      >
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {property.address}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                BRN: {property.brn}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Title: {property.titleNumber}
                              </Typography>
                            </Box>
                            <Chip
                              label={property.propertyType}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Outstanding Balance:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                              GHS {property.outstandingBalance.toLocaleString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {paymentMethod === 'brn' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Search by Billing Reference Number (BRN)
                </Typography>
                <Box display="flex" gap={2} alignItems="flex-start">
                  <TextField
                    fullWidth
                    label="Enter BRN"
                    value={searchBRN}
                    onChange={(e) => setSearchBRN(e.target.value)}
                    placeholder="e.g., BRN-2024-001234"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearchBRN}>
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                {selectedProperty && (
                  <Card variant="outlined" sx={{ mt: 2, border: '2px solid #006B3F' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {selectedProperty.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Title: {selectedProperty.titleNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'error.main' }}>
                        Outstanding: GHS {selectedProperty.outstandingBalance.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}

            {paymentMethod === 'title' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Search by Title Reference Number
                </Typography>
                <Box display="flex" gap={2} alignItems="flex-start">
                  <TextField
                    fullWidth
                    label="Enter Title Number"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="e.g., GA-2024-00456"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearchTitle}>
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                {selectedProperty && (
                  <Card variant="outlined" sx={{ mt: 2, border: '2px solid #006B3F' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {selectedProperty.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        BRN: {selectedProperty.brn}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'error.main' }}>
                        Outstanding: GHS {selectedProperty.outstandingBalance.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {/* Step 2: Choose Bills */}
      {activeStep === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Select Bills to Pay
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Property: {selectedProperty?.address}
          </Typography>

          <Grid container spacing={2}>
            {mockBillingItems.map((bill) => (
              <Grid item xs={12} key={bill.id}>
                <Card
                  variant={selectedBills.includes(bill.id) ? 'elevation' : 'outlined'}
                  sx={{
                    border: selectedBills.includes(bill.id) ? '2px solid #006B3F' : undefined,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBillToggle(bill.id)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={2}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={selectedBills.includes(bill.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                          label=""
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {bill.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          GHS {bill.amount.toLocaleString()}
                        </Typography>
                        <Chip
                          label={bill.status === 'overdue' ? 'Overdue' : 'Due'}
                          size="small"
                          color={bill.status === 'overdue' ? 'error' : 'warning'}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedBills.length > 0 && (
            <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  Total Amount ({selectedBills.length} item{selectedBills.length > 1 ? 's' : ''})
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#006B3F' }}>
                  GHS {getTotalAmount().toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Step 3: Payment Method */}
      {activeStep === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Select Payment Method
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    variant={paymentType === 'card' ? 'elevation' : 'outlined'}
                    sx={{ border: paymentType === 'card' ? '2px solid #006B3F' : undefined }}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <CreditCard />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Credit/Debit Card
                            </Typography>
                          </Box>
                        }
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Pay instantly with Visa, Mastercard, or local bank cards
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    variant={paymentType === 'bank' ? 'elevation' : 'outlined'}
                    sx={{ border: paymentType === 'bank' ? '2px solid #006B3F' : undefined }}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="bank"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccountBalance />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Bank Transfer (EFT)
                            </Typography>
                          </Box>
                        }
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Direct bank transfer - processing takes 1-3 business days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>

          {/* Card Payment Form */}
          {paymentType === 'card' && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Enter Card Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      value={cardDetails.cardHolder}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                      placeholder="As shown on card"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      placeholder="123"
                      type="password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="3-digit code on back of card">
                              <Info fontSize="small" />
                            </Tooltip>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <Security fontSize="small" color="success" />
                  <Typography variant="caption" color="text.secondary">
                    Your payment is secured with 256-bit SSL encryption
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Bank Transfer Instructions */}
          {paymentType === 'bank' && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Bank Transfer Instructions
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Complete your payment by transferring to the following bank account.
                  Use your BRN as the payment reference.
                </Alert>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Bank Name</TableCell>
                      <TableCell>Ghana Commercial Bank</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Account Name</TableCell>
                      <TableCell>Lands Commission Ghana</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Account Number</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>1234567890123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Branch</TableCell>
                      <TableCell>Head Office, Accra</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {selectedProperty?.brn}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        GHS {getTotalAmount().toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Step 4: Confirm & Pay */}
      {activeStep === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Review & Confirm Payment
          </Typography>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Payment Summary
              </Typography>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell align="right">{selectedProperty?.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BRN</TableCell>
                    <TableCell align="right">{selectedProperty?.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Title Number</TableCell>
                    <TableCell align="right">{selectedProperty?.titleNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                      Bills to Pay
                    </TableCell>
                  </TableRow>
                  {mockBillingItems
                    .filter((bill) => selectedBills.includes(bill.id))
                    .map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell sx={{ pl: 4 }}>{bill.description}</TableCell>
                        <TableCell align="right">GHS {bill.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell align="right">
                      {paymentType === 'card' ? 'Credit/Debit Card' : 'Bank Transfer (EFT)'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Total Amount
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#006B3F' }}>
                      GHS {getTotalAmount().toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Alert severity="warning" sx={{ mt: 2 }}>
            Please review the payment details above carefully. Once confirmed, the payment cannot be reversed.
          </Alert>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForward />}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmDialogOpen(true)}
            startIcon={<Payment />}
          >
            {paymentType === 'card' ? 'Pay Now' : 'Confirm Transfer'}
          </Button>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed with the payment of{' '}
            <strong>GHS {getTotalAmount().toLocaleString()}</strong> for{' '}
            <strong>{selectedProperty?.address}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleProcessPayment}>
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
