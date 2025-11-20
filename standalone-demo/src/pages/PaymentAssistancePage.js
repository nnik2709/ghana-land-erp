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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  HelpOutline,
  AttachFile,
  Send,
  CheckCircle,
  Warning,
  Info,
  Visibility,
  Delete,
  AccessTime,
  Description
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock existing applications
const mockApplications = [
  {
    id: 1,
    applicationNumber: 'HRD-2024-001234',
    property: '15 Independence Avenue, Accra',
    brn: 'BRN-2024-001234',
    type: 'Payment Plan',
    status: 'approved',
    submittedDate: '2024-06-15',
    reviewedDate: '2024-06-22',
    planDetails: {
      totalAmount: 2500.00,
      monthlyPayment: 250.00,
      duration: 10,
      startDate: '2024-07-01'
    }
  },
  {
    id: 2,
    applicationNumber: 'HRD-2024-005678',
    property: '23 Liberation Road, Kumasi',
    brn: 'BRN-2024-005678',
    type: 'Hardship Waiver',
    status: 'under_review',
    submittedDate: '2024-10-20',
    reviewedDate: null,
    planDetails: null
  }
];

// Mock linked properties
const mockProperties = [
  { id: 1, brn: 'BRN-2024-001234', address: '15 Independence Avenue, Accra', outstandingBalance: 2500.00 },
  { id: 2, brn: 'BRN-2024-005678', address: '23 Liberation Road, Kumasi', outstandingBalance: 1800.00 }
];

export default function PaymentAssistancePage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState(mockApplications);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);

  // Application form data
  const [formData, setFormData] = useState({
    property: '',
    assistanceType: 'payment_plan',
    reason: '',
    monthlyIncome: '',
    householdSize: '',
    employmentStatus: '',
    additionalInfo: '',
    preferredPlanDuration: '6',
    documents: [],
    declaration: false
  });

  const steps = ['Select Property', 'Assistance Details', 'Supporting Documents', 'Review & Submit'];

  const handleNext = () => {
    if (activeStep === 0 && !formData.property) {
      setAlert({ type: 'error', message: 'Please select a property' });
      return;
    }
    if (activeStep === 1 && (!formData.reason || !formData.monthlyIncome)) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    if (activeStep === 3 && !formData.declaration) {
      setAlert({ type: 'error', message: 'Please accept the declaration' });
      return;
    }
    setAlert(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setAlert(null);
  };

  const handleSubmit = async () => {
    setProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedProp = mockProperties.find(p => p.brn === formData.property);
    const newApplication = {
      id: applications.length + 1,
      applicationNumber: `HRD-${Date.now()}`,
      property: selectedProp?.address,
      brn: formData.property,
      type: formData.assistanceType === 'payment_plan' ? 'Payment Plan' : 'Hardship Waiver',
      status: 'submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      reviewedDate: null,
      planDetails: null
    };

    setApplications([newApplication, ...applications]);
    setProcessing(false);
    setApplyDialogOpen(false);
    resetForm();
    setAlert({
      type: 'success',
      message: `Application ${newApplication.applicationNumber} submitted successfully! We will review it within 5-7 business days.`
    });
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      property: '',
      assistanceType: 'payment_plan',
      reason: '',
      monthlyIncome: '',
      householdSize: '',
      employmentStatus: '',
      additionalInfo: '',
      preferredPlanDuration: '6',
      documents: [],
      declaration: false
    });
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'submitted':
      case 'under_review': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            Payment Assistance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Apply for payment plans or hardship assistance for your land-related bills
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<HelpOutline />}
          onClick={() => setApplyDialogOpen(true)}
        >
          Apply for Assistance
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Information Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AccessTime />
                <Typography variant="h6">Payment Plans</Typography>
              </Box>
              <Typography variant="body2">
                Spread your outstanding payments over 3-12 months with an interest-free payment plan.
                Ideal for managing large bills while maintaining good standing.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <HelpOutline />
                <Typography variant="h6">Hardship Waivers</Typography>
              </Box>
              <Typography variant="body2">
                If you're experiencing financial hardship, you may qualify for partial or full fee waivers.
                Documentation of financial circumstances is required.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Applications Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Assistance Applications
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application #</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <HelpOutline sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography color="text.secondary">
                        No assistance applications yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {application.applicationNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{application.property}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {application.brn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={application.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {new Date(application.submittedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(application.status)}
                          size="small"
                          color={getStatusColor(application.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewApplication(application)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={() => {
          setApplyDialogOpen(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Apply for Payment Assistance
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 1 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {alert && (
            <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}

          {/* Step 1: Select Property */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the property for which you need payment assistance.
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Property</InputLabel>
                <Select
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  label="Select Property"
                >
                  {mockProperties.map((prop) => (
                    <MenuItem key={prop.id} value={prop.brn}>
                      <Box>
                        <Typography variant="body2">{prop.address}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {prop.brn} - Outstanding: GHS {prop.outstandingBalance.toLocaleString()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {formData.property && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Outstanding Balance: GHS {mockProperties.find(p => p.brn === formData.property)?.outstandingBalance.toLocaleString()}
                </Alert>
              )}
            </Box>
          )}

          {/* Step 2: Assistance Details */}
          {activeStep === 1 && (
            <Box>
              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <FormLabel component="legend">Type of Assistance Required</FormLabel>
                <RadioGroup
                  value={formData.assistanceType}
                  onChange={(e) => setFormData({ ...formData, assistanceType: e.target.value })}
                >
                  <FormControlLabel
                    value="payment_plan"
                    control={<Radio />}
                    label="Payment Plan - Spread payments over time"
                  />
                  <FormControlLabel
                    value="hardship_waiver"
                    control={<Radio />}
                    label="Hardship Waiver - Request partial/full fee waiver"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason for Assistance *"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                sx={{ mb: 2 }}
                placeholder="Please explain why you need payment assistance..."
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Household Income (GHS) *"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Household Size"
                    type="number"
                    value={formData.householdSize}
                    onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Employment Status</InputLabel>
                    <Select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                      label="Employment Status"
                    >
                      <MenuItem value="employed">Employed</MenuItem>
                      <MenuItem value="self_employed">Self-Employed</MenuItem>
                      <MenuItem value="unemployed">Unemployed</MenuItem>
                      <MenuItem value="retired">Retired</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {formData.assistanceType === 'payment_plan' && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Preferred Plan Duration</InputLabel>
                      <Select
                        value={formData.preferredPlanDuration}
                        onChange={(e) => setFormData({ ...formData, preferredPlanDuration: e.target.value })}
                        label="Preferred Plan Duration"
                      >
                        <MenuItem value="3">3 months</MenuItem>
                        <MenuItem value="6">6 months</MenuItem>
                        <MenuItem value="9">9 months</MenuItem>
                        <MenuItem value="12">12 months</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Additional Information"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                sx={{ mt: 2 }}
                placeholder="Any other relevant information..."
              />
            </Box>
          )}

          {/* Step 3: Supporting Documents */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload supporting documents to strengthen your application.
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Recommended Documents:</Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Proof of income (payslips, bank statements)</li>
                  <li>Identification documents</li>
                  <li>Medical certificates (if applicable)</li>
                  <li>Unemployment letter (if applicable)</li>
                  <li>Other financial hardship evidence</li>
                </ul>
              </Alert>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                <AttachFile sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Drag and drop files here, or click to browse
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: PDF, JPG, PNG (Max 5MB each)
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" startIcon={<AttachFile />}>
                    Browse Files
                  </Button>
                </Box>
              </Box>

              {formData.documents.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {formData.documents.length} file(s) attached
                </Typography>
              )}
            </Box>
          )}

          {/* Step 4: Review & Submit */}
          {activeStep === 3 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Application Summary
              </Typography>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                        <TableCell>
                          {mockProperties.find(p => p.brn === formData.property)?.address}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>BRN</TableCell>
                        <TableCell>{formData.property}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Assistance Type</TableCell>
                        <TableCell>
                          {formData.assistanceType === 'payment_plan' ? 'Payment Plan' : 'Hardship Waiver'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Outstanding Amount</TableCell>
                        <TableCell>
                          GHS {mockProperties.find(p => p.brn === formData.property)?.outstandingBalance.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      {formData.assistanceType === 'payment_plan' && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Preferred Duration</TableCell>
                          <TableCell>{formData.preferredPlanDuration} months</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Monthly Income</TableCell>
                        <TableCell>GHS {parseFloat(formData.monthlyIncome || 0).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Documents</TableCell>
                        <TableCell>{formData.documents.length} file(s) attached</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.declaration}
                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                  />
                }
                label={
                  <Typography variant="body2">
                    I declare that all information provided is true and accurate. I understand that providing false information may result in rejection of my application and potential legal action.
                  </Typography>
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          <Button onClick={() => {
            setApplyDialogOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={processing || !formData.declaration}
              startIcon={processing ? <CircularProgress size={20} /> : <Send />}
            >
              {processing ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                  {selectedApplication.applicationNumber}
                </Typography>
                <Chip
                  label={getStatusLabel(selectedApplication.status)}
                  color={getStatusColor(selectedApplication.status)}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                    <TableCell>{selectedApplication.property}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>BRN</TableCell>
                    <TableCell>{selectedApplication.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell>{selectedApplication.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Submitted</TableCell>
                    <TableCell>{new Date(selectedApplication.submittedDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  {selectedApplication.reviewedDate && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reviewed</TableCell>
                      <TableCell>{new Date(selectedApplication.reviewedDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {selectedApplication.planDetails && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Approved Payment Plan
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>GHS {selectedApplication.planDetails.totalAmount.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Monthly Payment</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                              GHS {selectedApplication.planDetails.monthlyPayment.toLocaleString()}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Duration</TableCell>
                            <TableCell>{selectedApplication.planDetails.duration} months</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Start Date</TableCell>
                            <TableCell>{new Date(selectedApplication.planDetails.startDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {selectedApplication.status === 'under_review' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your application is being reviewed. You will be notified via email once a decision is made.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
