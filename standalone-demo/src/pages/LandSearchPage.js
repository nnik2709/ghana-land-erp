import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Divider,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Payment,
  Receipt,
  CheckCircle,
  Warning,
  Info,
  Phone,
  CreditCard,
  AccountBalance,
  Download,
  Print,
  History,
  LocationOn,
  Person,
  Gavel,
  Description,
  VerifiedUser,
} from '@mui/icons-material';

// Search types with descriptions and pricing
const searchTypes = [
  {
    id: 'basic',
    name: 'Basic Title Search',
    price: 50,
    description: 'Current ownership and title status only',
    deliveryTime: 'Instant',
    includes: ['Current owner name', 'Title status', 'Parcel ID', 'Land use type'],
  },
  {
    id: 'standard',
    name: 'Standard Search',
    price: 150,
    description: 'Ownership, encumbrances, and recent transactions',
    deliveryTime: '1-3 days',
    includes: [
      'Current owner details',
      'Title status & certificate number',
      'Encumbrances (mortgages, liens)',
      'Last 3 transactions',
      'Property boundaries',
    ],
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Search',
    price: 300,
    description: 'Full history, disputes, valuations, and certified report',
    deliveryTime: '3-5 days',
    includes: [
      'Complete ownership history',
      'All encumbrances with details',
      'Full transaction history',
      'Court cases & disputes',
      'Property valuation history',
      'Certified PDF report',
      'Blockchain verification proof',
    ],
  },
];

// Mock search results database
const mockSearchDatabase = {
  'ACC/2024/001': {
    basic: {
      parcelId: 'ACC/2024/001',
      currentOwner: 'Kwame Asante',
      titleStatus: 'Registered',
      landUse: 'Residential',
    },
    standard: {
      parcelId: 'ACC/2024/001',
      currentOwner: 'Kwame Asante',
      ownerContact: 'P.O. Box 123, Accra',
      titleStatus: 'Registered',
      certificateNo: 'GA/ACC/2024/T-001234',
      landUse: 'Residential',
      area: '850 sq.m',
      location: 'East Legon, Greater Accra',
      coordinates: '5.6037° N, 0.1870° W',
      encumbrances: 'None',
      lastTransactions: [
        { date: '2024-06-15', type: 'Transfer', parties: 'Previous Owner → Kwame Asante' },
        { date: '2022-03-10', type: 'Subdivision', parties: 'Original Plot Split' },
        { date: '2020-01-05', type: 'Initial Registration', parties: 'First Registration' },
      ],
    },
    comprehensive: {
      parcelId: 'ACC/2024/001',
      currentOwner: 'Kwame Asante',
      ownerContact: 'P.O. Box 123, Accra',
      ownerPhone: '+233 20 XXX XXXX',
      titleStatus: 'Registered',
      certificateNo: 'GA/ACC/2024/T-001234',
      landUse: 'Residential',
      area: '850 sq.m',
      location: 'East Legon, Greater Accra',
      district: 'Accra Metropolitan',
      region: 'Greater Accra',
      coordinates: '5.6037° N, 0.1870° W',
      encumbrances: [],
      ownershipHistory: [
        { period: '2024-Present', owner: 'Kwame Asante', acquisitionType: 'Purchase' },
        { period: '2020-2024', owner: 'James Mensah', acquisitionType: 'Inheritance' },
        { period: '2010-2020', owner: 'Elizabeth Mensah', acquisitionType: 'Purchase' },
      ],
      allTransactions: [
        { date: '2024-06-15', type: 'Transfer', amount: 'GHS 450,000', parties: 'James Mensah → Kwame Asante' },
        { date: '2022-03-10', type: 'Subdivision', amount: 'N/A', parties: 'Plot GA/2022/100 Split' },
        { date: '2020-05-20', type: 'Inheritance', amount: 'N/A', parties: 'Estate of Elizabeth Mensah → James Mensah' },
        { date: '2020-01-05', type: 'Initial Registration', amount: 'GHS 2,500', parties: 'First Registration' },
        { date: '2010-08-15', type: 'Purchase', amount: 'GHS 180,000', parties: 'Stool Lands → Elizabeth Mensah' },
      ],
      disputes: [],
      valuations: [
        { date: '2024-06-01', value: 'GHS 520,000', purpose: 'Sale' },
        { date: '2022-01-15', value: 'GHS 380,000', purpose: 'Mortgage' },
        { date: '2020-01-05', value: 'GHS 250,000', purpose: 'Registration' },
      ],
      blockchainHash: '0x8f4e3d2c1b0a9876543210fedcba9876543210abcdef',
    },
  },
  'ASH/2024/003': {
    basic: {
      parcelId: 'ASH/2024/003',
      currentOwner: 'Ashanti Development Ltd',
      titleStatus: 'Registered',
      landUse: 'Mixed Use',
    },
    standard: {
      parcelId: 'ASH/2024/003',
      currentOwner: 'Ashanti Development Ltd',
      ownerContact: 'P.O. Box 456, Kumasi',
      titleStatus: 'Registered',
      certificateNo: 'GA/ASH/2024/T-005678',
      landUse: 'Mixed Use',
      area: '5,000 sq.m',
      location: 'Ahodwo, Kumasi',
      coordinates: '6.6885° N, 1.6244° W',
      encumbrances: 'Mortgage (Standard Chartered Bank - GHS 2,500,000)',
      lastTransactions: [
        { date: '2023-11-10', type: 'Mortgage Registration', parties: 'Standard Chartered Bank' },
        { date: '2023-06-01', type: 'Transfer', parties: 'Previous Owner → Ashanti Dev Ltd' },
        { date: '2021-02-15', type: 'Initial Registration', parties: 'First Registration' },
      ],
    },
    comprehensive: {
      parcelId: 'ASH/2024/003',
      currentOwner: 'Ashanti Development Ltd',
      ownerContact: 'P.O. Box 456, Kumasi',
      ownerPhone: '+233 32 XXX XXXX',
      titleStatus: 'Registered',
      certificateNo: 'GA/ASH/2024/T-005678',
      landUse: 'Mixed Use',
      area: '5,000 sq.m',
      location: 'Ahodwo, Kumasi',
      district: 'Kumasi Metropolitan',
      region: 'Ashanti',
      coordinates: '6.6885° N, 1.6244° W',
      encumbrances: [
        {
          type: 'Mortgage',
          holder: 'Standard Chartered Bank Ghana',
          amount: 'GHS 2,500,000',
          registrationDate: '2023-11-10',
          expiryDate: '2033-11-10',
          status: 'Active',
        },
      ],
      ownershipHistory: [
        { period: '2023-Present', owner: 'Ashanti Development Ltd', acquisitionType: 'Purchase' },
        { period: '2021-2023', owner: 'Osei Family Trust', acquisitionType: 'Transfer' },
      ],
      allTransactions: [
        { date: '2023-11-10', type: 'Mortgage Registration', amount: 'GHS 2,500,000', parties: 'Standard Chartered Bank' },
        { date: '2023-06-01', type: 'Transfer', amount: 'GHS 3,200,000', parties: 'Osei Family Trust → Ashanti Dev Ltd' },
        { date: '2021-02-15', type: 'Initial Registration', amount: 'GHS 5,000', parties: 'First Registration' },
      ],
      disputes: [],
      valuations: [
        { date: '2023-10-15', value: 'GHS 4,500,000', purpose: 'Mortgage' },
        { date: '2023-05-01', value: 'GHS 3,800,000', purpose: 'Sale' },
      ],
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890fedcba98',
    },
  },
};

export default function LandSearchPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    { id: 'SRCH-001', date: '2024-11-10', parcel: 'ACC/2024/001', type: 'Standard', amount: 150, status: 'Completed' },
    { id: 'SRCH-002', date: '2024-10-25', parcel: 'WES/2024/004', type: 'Basic', amount: 50, status: 'Completed' },
  ]);

  const steps = ['Search Details', 'Select Package', 'Payment', 'Results'];

  const selectedPackage = searchTypes.find(t => t.id === selectedSearchType);

  const handleNext = () => {
    if (activeStep === 2) {
      // Process payment
      processPayment();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate receipt
    const newReceipt = {
      receiptNo: `RCP-${Date.now().toString().slice(-8)}`,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      parcelId: searchQuery.toUpperCase(),
      searchType: selectedPackage.name,
      amount: selectedPackage.price,
      paymentMethod: paymentMethod === 'momo' ? 'Mobile Money' : paymentMethod === 'card' ? 'Bank Card' : 'Bank Transfer',
      status: 'Paid',
    };

    setReceipt(newReceipt);

    // Get search results
    const parcelData = mockSearchDatabase[searchQuery.toUpperCase()];
    if (parcelData) {
      setSearchResult(parcelData[selectedSearchType] || parcelData.basic);
    } else {
      // Generate mock result for unknown parcels
      setSearchResult({
        parcelId: searchQuery.toUpperCase(),
        currentOwner: 'Information Not Available',
        titleStatus: 'Not Found in Registry',
        landUse: 'Unknown',
        message: 'This parcel ID was not found in our records. Please verify the ID and try again, or visit your nearest Lands Commission office.',
      });
    }

    // Add to search history
    setSearchHistory(prev => [
      {
        id: `SRCH-${Date.now().toString().slice(-3)}`,
        date: new Date().toISOString().split('T')[0],
        parcel: searchQuery.toUpperCase(),
        type: selectedPackage.name.split(' ')[0],
        amount: selectedPackage.price,
        status: 'Completed',
      },
      ...prev,
    ]);

    setIsProcessing(false);
    setActiveStep(3);
  };

  const resetSearch = () => {
    setActiveStep(0);
    setSearchQuery('');
    setSelectedSearchType('standard');
    setPaymentMethod('momo');
    setPhoneNumber('');
    setSearchResult(null);
    setReceipt(null);
  };

  const renderSearchDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Enter Search Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the Parcel ID or property reference number you want to search
      </Typography>

      <TextField
        fullWidth
        label="Parcel ID / Property Reference"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="e.g., ACC/2024/001"
        helperText="Try: ACC/2024/001 or ASH/2024/003"
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Alert severity="info" icon={<Info />}>
        <Typography variant="body2">
          <strong>What you can search:</strong> Parcel IDs, Title Certificate Numbers, Plot Numbers
        </Typography>
      </Alert>
    </Box>
  );

  const renderSearchPackages = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Search Package
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the level of detail you need for your search
      </Typography>

      <Grid container spacing={2}>
        {searchTypes.map((type) => (
          <Grid item xs={12} md={4} key={type.id}>
            <Card
              variant="outlined"
              sx={{
                cursor: 'pointer',
                height: '100%',
                border: selectedSearchType === type.id ? 2 : 1,
                borderColor: selectedSearchType === type.id ? 'primary.main' : 'divider',
                bgcolor: selectedSearchType === type.id ? 'rgba(13, 148, 136, 0.04)' : 'background.paper',
              }}
              onClick={() => setSelectedSearchType(type.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {type.name}
                  </Typography>
                  {selectedSearchType === type.id && (
                    <CheckCircle color="primary" fontSize="small" />
                  )}
                </Box>

                <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                  GHS {type.price}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {type.description}
                </Typography>

                <Chip
                  label={`Delivery: ${type.deliveryTime}`}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Includes:
                </Typography>
                <List dense disablePadding>
                  {type.includes.map((item, i) => (
                    <ListItem key={i} disablePadding sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPayment = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>

      {/* Order Summary */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#F8FAFC' }}>
        <Typography variant="subtitle2" gutterBottom>Order Summary</Typography>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0 }}>Parcel ID</TableCell>
              <TableCell sx={{ border: 0, textAlign: 'right' }}>{searchQuery.toUpperCase()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0 }}>Search Type</TableCell>
              <TableCell sx={{ border: 0, textAlign: 'right' }}>{selectedPackage?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ border: 0, textAlign: 'right', fontWeight: 'bold', color: 'primary.main' }}>
                GHS {selectedPackage?.price}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Payment Method */}
      <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
            <FormControlLabel
              value="momo"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone color="warning" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">Mobile Money</Typography>
                    <Typography variant="caption" color="text.secondary">
                      MTN MoMo, Vodafone Cash, AirtelTigo Money
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">Bank Card</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Visa, Mastercard
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <FormControlLabel
              value="bank"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance color="info" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">Bank Transfer</Typography>
                    <Typography variant="caption" color="text.secondary">
                      GhIPSS Instant Pay
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </Paper>
        </RadioGroup>
      </FormControl>

      {/* Phone number for MoMo */}
      {paymentMethod === 'momo' && (
        <TextField
          fullWidth
          label="Mobile Money Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="024 XXX XXXX"
          helperText="You will receive a payment prompt on this number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone color="action" />
              </InputAdornment>
            ),
          }}
        />
      )}
    </Box>
  );

  const renderResults = () => (
    <Box>
      {/* Receipt Section */}
      {receipt && (
        <Alert
          severity="success"
          icon={<CheckCircle />}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Receipt />}
              onClick={() => setShowReceiptDialog(true)}
            >
              View Receipt
            </Button>
          }
          sx={{ mb: 3 }}
        >
          Payment successful! Receipt No: {receipt.receiptNo}
        </Alert>
      )}

      {/* Search Results */}
      <Typography variant="h6" gutterBottom>
        Search Results
      </Typography>

      {searchResult && (
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                {searchResult.parcelId}
              </Typography>
              <Chip
                label={searchResult.titleStatus}
                color={searchResult.titleStatus === 'Registered' ? 'success' : 'warning'}
                icon={searchResult.titleStatus === 'Registered' ? <VerifiedUser /> : <Warning />}
              />
            </Box>

            {searchResult.message ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {searchResult.message}
              </Alert>
            ) : (
              <>
                {/* Basic Info */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Current Owner</Typography>
                    <Typography variant="body1">
                      <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {searchResult.currentOwner}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Land Use</Typography>
                    <Typography variant="body1">{searchResult.landUse}</Typography>
                  </Grid>
                  {searchResult.area && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Area</Typography>
                      <Typography variant="body1">{searchResult.area}</Typography>
                    </Grid>
                  )}
                  {searchResult.location && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography variant="body1">{searchResult.location}</Typography>
                    </Grid>
                  )}
                  {searchResult.certificateNo && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Certificate No</Typography>
                      <Typography variant="body1">{searchResult.certificateNo}</Typography>
                    </Grid>
                  )}
                  {searchResult.coordinates && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Coordinates</Typography>
                      <Typography variant="body1">{searchResult.coordinates}</Typography>
                    </Grid>
                  )}
                </Grid>

                {/* Encumbrances */}
                {searchResult.encumbrances !== undefined && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Gavel sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Encumbrances
                    </Typography>
                    {Array.isArray(searchResult.encumbrances) ? (
                      searchResult.encumbrances.length === 0 ? (
                        <Chip label="None" size="small" color="success" icon={<CheckCircle />} />
                      ) : (
                        searchResult.encumbrances.map((enc, i) => (
                          <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1 }}>
                            <Typography variant="body2" fontWeight="medium">{enc.type}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {enc.holder} | {enc.amount} | Expires: {enc.expiryDate}
                            </Typography>
                          </Paper>
                        ))
                      )
                    ) : (
                      <Typography variant="body2">
                        {searchResult.encumbrances === 'None' ? (
                          <Chip label="None" size="small" color="success" icon={<CheckCircle />} />
                        ) : (
                          <Chip label={searchResult.encumbrances} size="small" color="warning" icon={<Warning />} />
                        )}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Transaction History */}
                {searchResult.lastTransactions && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <History sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Recent Transactions
                    </Typography>
                    {searchResult.lastTransactions.map((txn, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box>
                          <Typography variant="body2">{txn.type}</Typography>
                          <Typography variant="caption" color="text.secondary">{txn.parties}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{txn.date}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Comprehensive: Ownership History */}
                {searchResult.ownershipHistory && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Ownership History
                    </Typography>
                    {searchResult.ownershipHistory.map((owner, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box>
                          <Typography variant="body2">{owner.owner}</Typography>
                          <Typography variant="caption" color="text.secondary">{owner.acquisitionType}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{owner.period}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Comprehensive: Valuations */}
                {searchResult.valuations && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Description sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Valuation History
                    </Typography>
                    {searchResult.valuations.map((val, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box>
                          <Typography variant="body2">{val.value}</Typography>
                          <Typography variant="caption" color="text.secondary">{val.purpose}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{val.date}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Blockchain Verification */}
                {searchResult.blockchainHash && (
                  <Alert severity="info" icon={<VerifiedUser />} sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>Blockchain Verified</strong><br />
                      Hash: {searchResult.blockchainHash}
                    </Typography>
                  </Alert>
                )}
              </>
            )}
          </CardContent>

          {/* Actions */}
          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button startIcon={<Download />} variant="outlined" size="small">
              Download PDF
            </Button>
            <Button startIcon={<Print />} variant="outlined" size="small">
              Print Results
            </Button>
          </Box>
        </Card>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="contained" onClick={resetSearch}>
          New Search
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0: return renderSearchDetails();
      case 1: return renderSearchPackages();
      case 2: return renderPayment();
      case 3: return renderResults();
      default: return 'Unknown step';
    }
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0: return !searchQuery.trim();
      case 1: return !selectedSearchType;
      case 2: return paymentMethod === 'momo' && !phoneNumber.trim();
      default: return false;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Land Search
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Search for land ownership, titles, encumbrances, and transaction history
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              {isProcessing ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CircularProgress size={48} sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Processing Payment...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethod === 'momo'
                      ? 'Please approve the payment on your phone'
                      : 'Please wait while we process your payment'}
                  </Typography>
                </Box>
              ) : (
                getStepContent(activeStep)
              )}

              {/* Navigation */}
              {activeStep < 3 && !isProcessing && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    startIcon={activeStep === 2 ? <Payment /> : null}
                  >
                    {activeStep === 2 ? `Pay GHS ${selectedPackage?.price}` : 'Next'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Search History */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History fontSize="small" />
                Recent Searches
              </Typography>
              {searchHistory.slice(0, 3).map((search) => (
                <Paper key={search.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {search.parcel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {search.type} | GHS {search.amount}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {search.date}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </CardContent>
          </Card>

          {/* Help Box */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Info sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                Search Help
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Basic Search:</strong> Quick ownership verification for due diligence.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Standard Search:</strong> Recommended for property purchases, includes encumbrances.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Comprehensive Search:</strong> Full legal report for mortgages, court cases, and major transactions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onClose={() => setShowReceiptDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt color="primary" />
            Payment Receipt
          </Box>
        </DialogTitle>
        <DialogContent>
          {receipt && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Payment Successful
              </Alert>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Receipt No</TableCell>
                    <TableCell>{receipt.receiptNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                    <TableCell>{receipt.transactionId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell>{new Date(receipt.date).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Parcel ID</TableCell>
                    <TableCell>{receipt.parcelId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Search Type</TableCell>
                    <TableCell>{receipt.searchType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell>{receipt.paymentMethod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      GHS {receipt.amount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Download />} onClick={() => setShowReceiptDialog(false)}>
            Download PDF
          </Button>
          <Button startIcon={<Print />} onClick={() => setShowReceiptDialog(false)}>
            Print
          </Button>
          <Button onClick={() => setShowReceiptDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
