import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Alert, Stepper, Step, StepLabel, Card, CardContent, Divider, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Autocomplete, IconButton, Tooltip
} from '@mui/material';
import {
  ArrowBack, Send, CheckCircle, Person, AttachMoney, Gavel, Description,
  SwapHoriz, Warning, Schedule, Verified, Cancel, Upload, AccountBalance,
  Assignment, History, Notifications
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function TitleTransferPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);

  // Transfer data
  const [transferData, setTransferData] = useState({
    title_id: '',
    transfer_type: 'Sale',
    sale_price: '',
    buyer_name: '',
    buyer_id_type: 'Ghana Card',
    buyer_id_number: '',
    buyer_phone: '',
    buyer_email: '',
    reason: '',
    documents: []
  });

  // Workflow simulation states
  const [buyerAccepted, setBuyerAccepted] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [officerReview, setOfficerReview] = useState(null);
  const [transferComplete, setTransferComplete] = useState(false);

  // Dialogs
  const [buyerDialogOpen, setBuyerDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Mock transfer history
  const [transferHistory] = useState([
    {
      id: 'TRF-2023-001',
      title_number: 'GA/2024/001/TL',
      from: 'Kwame Asante',
      to: 'Kofi Mensah',
      date: '2023-06-15',
      type: 'Sale',
      amount: 'GHS 320,000',
      status: 'Completed'
    },
    {
      id: 'TRF-2022-045',
      title_number: 'GA/2024/001/TL',
      from: 'Yaa Sarpong',
      to: 'Kwame Asante',
      date: '2022-01-20',
      type: 'Inheritance',
      amount: 'N/A',
      status: 'Completed'
    }
  ]);

  useEffect(() => {
    api.get('/titles').then(res => {
      // Filter to only show titles owned by current user (for demo, show all)
      setTitles(res.data.data);
    });
  }, []);

  const steps = [
    'Select Title & Buyer',
    'Buyer Acceptance',
    'Payment & Documents',
    'Officer Review',
    'Transfer Complete'
  ];

  const calculateFees = () => {
    const salePrice = parseFloat(transferData.sale_price) || 0;
    const stampDuty = salePrice * 0.005; // 0.5%
    const registrationFee = 500;
    const processingFee = 200;
    return {
      stampDuty,
      registrationFee,
      processingFee,
      total: stampDuty + registrationFee + processingFee
    };
  };

  const handleTitleSelect = (title) => {
    setSelectedTitle(title);
    setTransferData({ ...transferData, title_id: title?.id || '' });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedTitle || !transferData.buyer_name || !transferData.buyer_id_number) {
        setAlert({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }
    }
    setAlert(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleBuyerAccept = () => {
    setLoading(true);
    setTimeout(() => {
      setBuyerAccepted(true);
      setBuyerDialogOpen(false);
      setAlert({ type: 'success', message: 'Buyer has accepted the transfer. Proceeding to payment.' });
      setLoading(false);
      setActiveStep(2);
    }, 1500);
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setPaymentComplete(true);
      setPaymentDialogOpen(false);
      setAlert({ type: 'success', message: 'Payment confirmed. Application sent for officer review.' });
      setLoading(false);
      setActiveStep(3);
    }, 2000);
  };

  const handleOfficerApproval = (approved) => {
    setLoading(true);
    setTimeout(() => {
      setOfficerReview(approved ? 'approved' : 'rejected');
      setReviewDialogOpen(false);
      if (approved) {
        setAlert({ type: 'success', message: 'Transfer approved! Generating new title...' });
        setTimeout(() => {
          setTransferComplete(true);
          setActiveStep(4);
          setAlert({ type: 'success', message: 'Transfer complete! New title has been issued to the buyer.' });
        }, 1500);
      } else {
        setAlert({ type: 'error', message: 'Transfer rejected. Please review the feedback and resubmit.' });
      }
      setLoading(false);
    }, 2000);
  };

  const handleSubmitTransfer = () => {
    setLoading(true);
    setAlert(null);

    setTimeout(() => {
      setAlert({
        type: 'info',
        message: 'Transfer application submitted. Waiting for buyer acceptance...'
      });
      setLoading(false);
      setActiveStep(1);
    }, 1000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/titles')} sx={{ mr: 2 }}>
          Back to Titles
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006B3F', flex: 1 }}>
          Title Transfer
        </Typography>
        <Tooltip title="View Transfer History">
          <IconButton onClick={() => setHistoryDialogOpen(true)}>
            <History />
          </IconButton>
        </Tooltip>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label} completed={
            index === 0 ? activeStep > 0 :
            index === 1 ? buyerAccepted :
            index === 2 ? paymentComplete :
            index === 3 ? officerReview === 'approved' :
            transferComplete
          }>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4 }}>
        {/* Step 1: Select Title & Buyer Details */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              <SwapHoriz sx={{ mr: 1, verticalAlign: 'middle' }} />
              Initiate Title Transfer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the title you want to transfer and provide buyer information.
            </Typography>

            <Grid container spacing={3}>
              {/* Title Selection */}
              <Grid item xs={12}>
                <Autocomplete
                  options={titles}
                  value={selectedTitle}
                  onChange={(e, value) => handleTitleSelect(value)}
                  getOptionLabel={(option) => `${option.title_number} - ${option.location}`}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Title to Transfer *" />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="subtitle2">{option.title_number}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.location} | {option.title_type} | Owner: {option.owner_name}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Grid>

              {selectedTitle && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Selected Title Details</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Title Number</Typography>
                          <Typography variant="body2">{selectedTitle.title_number}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Type</Typography>
                          <Typography variant="body2">{selectedTitle.title_type}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Current Owner</Typography>
                          <Typography variant="body2">{selectedTitle.owner_name}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Chip label={selectedTitle.status} size="small" color="success" />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="Buyer Information" />
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Transfer Type</InputLabel>
                  <Select
                    value={transferData.transfer_type}
                    onChange={(e) => setTransferData({ ...transferData, transfer_type: e.target.value })}
                    label="Transfer Type"
                  >
                    <MenuItem value="Sale">Sale</MenuItem>
                    <MenuItem value="Gift">Gift</MenuItem>
                    <MenuItem value="Inheritance">Inheritance</MenuItem>
                    <MenuItem value="Court Order">Court Order</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sale Price (GHS)"
                  type="number"
                  value={transferData.sale_price}
                  onChange={(e) => setTransferData({ ...transferData, sale_price: e.target.value })}
                  disabled={transferData.transfer_type !== 'Sale'}
                  helperText={transferData.transfer_type !== 'Sale' ? 'Not applicable for this transfer type' : ''}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Buyer Full Name"
                  value={transferData.buyer_name}
                  onChange={(e) => setTransferData({ ...transferData, buyer_name: e.target.value })}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>ID Type</InputLabel>
                  <Select
                    value={transferData.buyer_id_type}
                    onChange={(e) => setTransferData({ ...transferData, buyer_id_type: e.target.value })}
                    label="ID Type"
                  >
                    <MenuItem value="Ghana Card">Ghana Card</MenuItem>
                    <MenuItem value="Passport">Passport</MenuItem>
                    <MenuItem value="Voter ID">Voter ID</MenuItem>
                    <MenuItem value="Driver License">Driver License</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Buyer ID Number"
                  value={transferData.buyer_id_number}
                  onChange={(e) => setTransferData({ ...transferData, buyer_id_number: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Buyer Phone"
                  value={transferData.buyer_phone}
                  onChange={(e) => setTransferData({ ...transferData, buyer_phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Buyer Email"
                  type="email"
                  value={transferData.buyer_email}
                  onChange={(e) => setTransferData({ ...transferData, buyer_email: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Reason for Transfer"
                  value={transferData.reason}
                  onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                  placeholder="Provide details about this transfer..."
                />
              </Grid>

              {/* Fee Preview */}
              {transferData.sale_price && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        <AttachMoney sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                        Estimated Transfer Fees
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={8}>
                          <Typography variant="body2">Stamp Duty (0.5%)</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" align="right">
                            GHS {calculateFees().stampDuty.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">Registration Fee</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" align="right">GHS 500</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">Processing Fee</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" align="right">GHS 200</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="subtitle2">Total Fees</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" align="right" color="primary">
                            GHS {calculateFees().total.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmitTransfer}
                disabled={loading || !selectedTitle || !transferData.buyer_name}
                startIcon={loading ? <LinearProgress size={20} /> : <Send />}
              >
                {loading ? 'Submitting...' : 'Submit Transfer Request'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Buyer Acceptance */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Awaiting Buyer Acceptance
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                A notification has been sent to <strong>{transferData.buyer_name}</strong> at {transferData.buyer_email || transferData.buyer_phone}.
                The buyer must accept this transfer to proceed.
              </Typography>
            </Alert>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Transfer Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">From (Seller)</Typography>
                    <Typography variant="body2">{selectedTitle?.owner_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">To (Buyer)</Typography>
                    <Typography variant="body2">{transferData.buyer_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Title</Typography>
                    <Typography variant="body2">{selectedTitle?.title_number}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Transfer Type</Typography>
                    <Typography variant="body2">{transferData.transfer_type}</Typography>
                  </Grid>
                  {transferData.sale_price && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Sale Price</Typography>
                      <Typography variant="body2">GHS {parseFloat(transferData.sale_price).toLocaleString()}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => {
                  setAlert({ type: 'warning', message: 'Transfer cancelled by seller' });
                  setActiveStep(0);
                }}
              >
                Cancel Transfer
              </Button>
              <Button
                variant="contained"
                startIcon={<Notifications />}
                onClick={() => setBuyerDialogOpen(true)}
              >
                Simulate Buyer Response
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: Payment & Documents */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment & Document Upload
            </Typography>

            <Alert severity="success" sx={{ mb: 3 }}>
              Buyer has accepted the transfer. Please complete payment and upload required documents.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Required Documents</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {[
                        { name: 'Sale Agreement / Deed of Transfer', required: true },
                        { name: 'Seller ID Document', required: true },
                        { name: 'Buyer ID Document', required: true },
                        { name: 'Tax Clearance Certificate', required: true },
                        { name: 'Consent Letter (if applicable)', required: false }
                      ].map((doc, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            size="small"
                            label={doc.required ? 'Required' : 'Optional'}
                            color={doc.required ? 'error' : 'default'}
                            variant="outlined"
                          />
                          <Typography variant="body2">{doc.name}</Typography>
                          <IconButton size="small">
                            <Upload fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Payment Summary</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <Typography variant="body2">Stamp Duty (0.5%)</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" align="right">
                          GHS {calculateFees().stampDuty.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">Registration Fee</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" align="right">GHS 500</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">Processing Fee</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" align="right">GHS 200</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="subtitle1" fontWeight="bold">Total Due</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1" fontWeight="bold" align="right" color="primary">
                          GHS {calculateFees().total.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      startIcon={<AccountBalance />}
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      Make Payment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 4: Officer Review */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
              Lands Officer Review
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Your transfer application is under review by a Lands Officer. This typically takes 2-3 business days.
            </Alert>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Review Checklist</Typography>
                <Grid container spacing={1}>
                  {[
                    { item: 'Seller ownership verified', status: 'passed' },
                    { item: 'No encumbrances on title', status: 'passed' },
                    { item: 'All documents complete', status: 'passed' },
                    { item: 'Fees fully paid', status: 'passed' },
                    { item: 'Tax clearance valid', status: 'passed' },
                    { item: 'Identity verification', status: 'pending' }
                  ].map((check, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {check.status === 'passed' ? (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                        ) : (
                          <Schedule sx={{ color: 'warning.main', fontSize: 18 }} />
                        )}
                        <Typography variant="body2">{check.item}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => setReviewDialogOpen(true)}
              >
                Simulate Officer Decision
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 5: Transfer Complete */}
        {activeStep === 4 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Transfer Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The title has been successfully transferred to <strong>{transferData.buyer_name}</strong>.
            </Typography>

            <Card variant="outlined" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>New Title Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">New Title Number</Typography>
                    <Typography variant="body2">GA/2024/NEW/TL</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">New Owner</Typography>
                    <Typography variant="body2">{transferData.buyer_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Transfer Date</Typography>
                    <Typography variant="body2">{new Date().toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Chip label="Active" size="small" color="success" />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Previous Title</Typography>
                    <Typography variant="body2">
                      {selectedTitle?.title_number} (Now marked as "Transferred")
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Description />}>
                Download New Title
              </Button>
              <Button variant="contained" onClick={() => navigate('/titles')}>
                Back to Titles
              </Button>
            </Box>
          </Box>
        )}

        {/* Navigation for steps 0-2 */}
        {activeStep < 3 && activeStep > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={handleBack}>Back</Button>
          </Box>
        )}
      </Paper>

      {/* Buyer Acceptance Dialog */}
      <Dialog open={buyerDialogOpen} onClose={() => setBuyerDialogOpen(false)}>
        <DialogTitle>Buyer Response Simulation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            In a real scenario, the buyer ({transferData.buyer_name}) would receive a notification
            and accept or reject the transfer through their account.
          </Typography>
          <Alert severity="info">
            For demo purposes, click below to simulate the buyer accepting the transfer.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyerDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setBuyerDialogOpen(false);
              setAlert({ type: 'error', message: 'Buyer has rejected the transfer.' });
            }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            onClick={handleBuyerAccept}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Accept Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Total amount due: <strong>GHS {calculateFees().total.toLocaleString()}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select defaultValue="momo" label="Payment Method">
              <MenuItem value="momo">Mobile Money (MTN/Vodafone)</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
              <MenuItem value="card">Debit/Credit Card</MenuItem>
            </Select>
          </FormControl>
          <Alert severity="info">
            For demo purposes, click "Confirm Payment" to simulate successful payment.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Officer Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)}>
        <DialogTitle>Officer Review Decision</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            As a Lands Officer, review the transfer application and make a decision.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            For demo purposes, select the officer's decision below.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOfficerApproval(false)}
            disabled={loading}
            startIcon={<Cancel />}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleOfficerApproval(true)}
            disabled={loading}
            startIcon={<Verified />}
          >
            {loading ? 'Processing...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer History Dialog */}
      <Dialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <History sx={{ mr: 1, verticalAlign: 'middle' }} />
          Title Transfer History
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Transfer ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transferHistory.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.id}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>{transfer.from}</TableCell>
                    <TableCell>{transfer.to}</TableCell>
                    <TableCell>{transfer.type}</TableCell>
                    <TableCell>{transfer.amount}</TableCell>
                    <TableCell>
                      <Chip label={transfer.status} size="small" color="success" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
