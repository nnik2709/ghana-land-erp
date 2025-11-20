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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Calculate,
  Receipt,
  Download,
  Print,
  Info,
  ExpandMore,
  CheckCircle,
  Warning,
  Help,
  History,
  Gavel,
} from '@mui/icons-material';

// Stamp duty rates based on Ghana Land Act
const stampDutyRates = {
  transfer: {
    residential: 0.005, // 0.5%
    commercial: 0.01,   // 1%
    agricultural: 0.0025, // 0.25%
    industrial: 0.01,   // 1%
  },
  mortgage: {
    all: 0.0025, // 0.25%
  },
  lease: {
    shortTerm: 0.005, // 0.5% for leases < 5 years
    longTerm: 0.01,   // 1% for leases >= 5 years
  },
};

// Additional fees
const additionalFees = {
  registrationFee: {
    base: 500,
    perHectare: 50,
  },
  surveyFee: {
    base: 1500,
    perHectare: 200,
  },
  searchFee: 150,
  processingFee: 250,
  expeditedProcessing: 1000,
};

// Exemptions
const exemptions = [
  { id: 'government', label: 'Government/State Transaction', discount: 1.0 },
  { id: 'inheritance', label: 'Inheritance/Succession', discount: 0.5 },
  { id: 'spouse', label: 'Transfer to Spouse', discount: 0.75 },
  { id: 'charity', label: 'Charitable Organization', discount: 1.0 },
  { id: 'firstTime', label: 'First-Time Homebuyer (< GHS 300,000)', discount: 0.25 },
];

export default function StampDutyCalculatorPage() {
  const [transactionType, setTransactionType] = useState('transfer');
  const [propertyType, setPropertyType] = useState('residential');
  const [propertyValue, setPropertyValue] = useState('');
  const [propertyArea, setPropertyArea] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [selectedExemption, setSelectedExemption] = useState('');
  const [includeRegistration, setIncludeRegistration] = useState(true);
  const [includeSurvey, setIncludeSurvey] = useState(false);
  const [includeSearch, setIncludeSearch] = useState(true);
  const [expedited, setExpedited] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);

  const calculateFees = () => {
    const value = parseFloat(propertyValue) || 0;
    const area = parseFloat(propertyArea) || 0;

    if (value <= 0) {
      return;
    }

    let stampDuty = 0;
    let stampDutyRate = 0;

    // Calculate stamp duty based on transaction type
    if (transactionType === 'transfer') {
      stampDutyRate = stampDutyRates.transfer[propertyType] || 0.005;
      stampDuty = value * stampDutyRate;
    } else if (transactionType === 'mortgage') {
      stampDutyRate = stampDutyRates.mortgage.all;
      stampDuty = value * stampDutyRate;
    } else if (transactionType === 'lease') {
      const duration = parseInt(leaseDuration) || 1;
      stampDutyRate = duration >= 5 ? stampDutyRates.lease.longTerm : stampDutyRates.lease.shortTerm;
      stampDuty = value * stampDutyRate * Math.min(duration, 10); // Cap at 10 years for calculation
    }

    // Apply exemption discount
    let exemptionDiscount = 0;
    let exemptionLabel = '';
    if (selectedExemption) {
      const exemption = exemptions.find(e => e.id === selectedExemption);
      if (exemption) {
        exemptionDiscount = stampDuty * exemption.discount;
        exemptionLabel = exemption.label;
      }
    }

    // Calculate additional fees
    let registrationFee = 0;
    if (includeRegistration) {
      registrationFee = additionalFees.registrationFee.base + (area * additionalFees.registrationFee.perHectare);
    }

    let surveyFee = 0;
    if (includeSurvey) {
      surveyFee = additionalFees.surveyFee.base + (area * additionalFees.surveyFee.perHectare);
    }

    const searchFee = includeSearch ? additionalFees.searchFee : 0;
    const processingFee = additionalFees.processingFee;
    const expeditedFee = expedited ? additionalFees.expeditedProcessing : 0;

    // Calculate totals
    const netStampDuty = stampDuty - exemptionDiscount;
    const totalFees = registrationFee + surveyFee + searchFee + processingFee + expeditedFee;
    const grandTotal = netStampDuty + totalFees;

    const result = {
      transactionType,
      propertyType,
      propertyValue: value,
      propertyArea: area,
      stampDutyRate: (stampDutyRate * 100).toFixed(2),
      grossStampDuty: stampDuty,
      exemptionLabel,
      exemptionDiscount,
      netStampDuty,
      registrationFee,
      surveyFee,
      searchFee,
      processingFee,
      expeditedFee,
      totalFees,
      grandTotal,
      calculatedAt: new Date().toISOString(),
      referenceNo: `SDC-${Date.now().toString().slice(-8)}`,
    };

    setCalculationResult(result);

    // Add to history
    setCalculationHistory(prev => [result, ...prev].slice(0, 10));
  };

  const resetCalculator = () => {
    setTransactionType('transfer');
    setPropertyType('residential');
    setPropertyValue('');
    setPropertyArea('');
    setLeaseDuration('');
    setSelectedExemption('');
    setIncludeRegistration(true);
    setIncludeSurvey(false);
    setIncludeSearch(true);
    setExpedited(false);
    setCalculationResult(null);
  };

  const formatCurrency = (amount) => {
    return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Stamp Duty & Fee Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calculate stamp duty, registration fees, and other charges for land transactions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Calculator Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Calculate sx={{ mr: 1, verticalAlign: 'middle' }} />
                Transaction Details
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Transaction Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      label="Transaction Type"
                    >
                      <MenuItem value="transfer">Title Transfer / Sale</MenuItem>
                      <MenuItem value="mortgage">Mortgage Registration</MenuItem>
                      <MenuItem value="lease">Lease Registration</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Property Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      label="Property Type"
                    >
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                      <MenuItem value="agricultural">Agricultural</MenuItem>
                      <MenuItem value="industrial">Industrial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Property Value */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Property Value / Consideration"
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">GHS</InputAdornment>,
                    }}
                    helperText="Market value or sale price"
                  />
                </Grid>

                {/* Property Area */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Property Area"
                    type="number"
                    value={propertyArea}
                    onChange={(e) => setPropertyArea(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">hectares</InputAdornment>,
                    }}
                    helperText="For registration fee calculation"
                  />
                </Grid>

                {/* Lease Duration (conditional) */}
                {transactionType === 'lease' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Lease Duration"
                      type="number"
                      value={leaseDuration}
                      onChange={(e) => setLeaseDuration(e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">years</InputAdornment>,
                      }}
                      helperText="Duration affects stamp duty rate"
                    />
                  </Grid>
                )}

                {/* Exemptions */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Exemption / Discount</InputLabel>
                    <Select
                      value={selectedExemption}
                      onChange={(e) => setSelectedExemption(e.target.value)}
                      label="Exemption / Discount"
                    >
                      <MenuItem value="">No Exemption</MenuItem>
                      {exemptions.map((exemption) => (
                        <MenuItem key={exemption.id} value={exemption.id}>
                          {exemption.label} ({(exemption.discount * 100).toFixed(0)}% off stamp duty)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Additional Services */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Additional Services
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={`Registration Fee (GHS ${additionalFees.registrationFee.base}+)`}
                    color={includeRegistration ? 'primary' : 'default'}
                    onClick={() => setIncludeRegistration(!includeRegistration)}
                    variant={includeRegistration ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Survey Fee (GHS ${additionalFees.surveyFee.base}+)`}
                    color={includeSurvey ? 'primary' : 'default'}
                    onClick={() => setIncludeSurvey(!includeSurvey)}
                    variant={includeSurvey ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Search Fee (GHS ${additionalFees.searchFee})`}
                    color={includeSearch ? 'primary' : 'default'}
                    onClick={() => setIncludeSearch(!includeSearch)}
                    variant={includeSearch ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Expedited (GHS ${additionalFees.expeditedProcessing})`}
                    color={expedited ? 'warning' : 'default'}
                    onClick={() => setExpedited(!expedited)}
                    variant={expedited ? 'filled' : 'outlined'}
                  />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Calculate />}
                  onClick={calculateFees}
                  disabled={!propertyValue}
                >
                  Calculate Fees
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetCalculator}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Rate Information */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">
                <Info sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                Stamp Duty Rates & Fee Schedule
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
                Transfer Stamp Duty Rates:
              </Typography>
              <Table size="small" sx={{ mb: 2 }}>
                <TableBody>
                  <TableRow>
                    <TableCell>Residential</TableCell>
                    <TableCell align="right">0.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Commercial</TableCell>
                    <TableCell align="right">1.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Agricultural</TableCell>
                    <TableCell align="right">0.25%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Industrial</TableCell>
                    <TableCell align="right">1.0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
                Other Rates:
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Mortgage Registration</TableCell>
                    <TableCell align="right">0.25%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lease (&lt; 5 years)</TableCell>
                    <TableCell align="right">0.5% per year</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lease (&ge; 5 years)</TableCell>
                    <TableCell align="right">1.0% per year</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} md={5}>
          {calculationResult ? (
            <Card sx={{ position: 'sticky', top: 16 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Fee Breakdown
                  </Typography>
                  <Chip
                    label={calculationResult.referenceNo}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#F8FAFC' }}>
                  <Typography variant="caption" color="text.secondary">Transaction</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {calculationResult.transactionType} - {calculationResult.propertyType}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Property Value
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(calculationResult.propertyValue)}
                  </Typography>
                </Paper>

                <Table size="small">
                  <TableBody>
                    {/* Stamp Duty */}
                    <TableRow>
                      <TableCell>
                        Stamp Duty ({calculationResult.stampDutyRate}%)
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(calculationResult.grossStampDuty)}
                      </TableCell>
                    </TableRow>

                    {/* Exemption */}
                    {calculationResult.exemptionDiscount > 0 && (
                      <TableRow>
                        <TableCell sx={{ color: 'success.main' }}>
                          Exemption: {calculationResult.exemptionLabel}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'success.main' }}>
                          -{formatCurrency(calculationResult.exemptionDiscount)}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Net Stamp Duty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(calculationResult.netStampDuty)}
                      </TableCell>
                    </TableRow>

                    {/* Divider */}
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Divider />
                      </TableCell>
                    </TableRow>

                    {/* Additional Fees */}
                    {calculationResult.registrationFee > 0 && (
                      <TableRow>
                        <TableCell>Registration Fee</TableCell>
                        <TableCell align="right">
                          {formatCurrency(calculationResult.registrationFee)}
                        </TableCell>
                      </TableRow>
                    )}

                    {calculationResult.surveyFee > 0 && (
                      <TableRow>
                        <TableCell>Survey Fee</TableCell>
                        <TableCell align="right">
                          {formatCurrency(calculationResult.surveyFee)}
                        </TableCell>
                      </TableRow>
                    )}

                    {calculationResult.searchFee > 0 && (
                      <TableRow>
                        <TableCell>Search Fee</TableCell>
                        <TableCell align="right">
                          {formatCurrency(calculationResult.searchFee)}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <TableCell>Processing Fee</TableCell>
                      <TableCell align="right">
                        {formatCurrency(calculationResult.processingFee)}
                      </TableCell>
                    </TableRow>

                    {calculationResult.expeditedFee > 0 && (
                      <TableRow>
                        <TableCell sx={{ color: 'warning.main' }}>
                          Expedited Processing
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'warning.main' }}>
                          {formatCurrency(calculationResult.expeditedFee)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <Divider sx={{ my: 2 }} />

                {/* Grand Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Total Payable</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(calculationResult.grandTotal)}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    size="small"
                    fullWidth
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                    size="small"
                    fullWidth
                  >
                    Print
                  </Button>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }} icon={<Info />}>
                  <Typography variant="caption">
                    This is an estimate. Final fees may vary based on verification and current rates.
                    Valid for 30 days from calculation date.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Calculate sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Fee Calculator
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter transaction details and click "Calculate Fees" to see the breakdown
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Calculation History */}
          {calculationHistory.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  <History sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                  Recent Calculations
                </Typography>
                {calculationHistory.slice(0, 3).map((calc, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {calc.transactionType} - {calc.propertyType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(calc.propertyValue)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          {formatCurrency(calc.grandTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(calc.calculatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
