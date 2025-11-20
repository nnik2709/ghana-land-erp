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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  VerifiedUser,
  Person,
  School,
  WorkHistory,
  CheckCircle,
  Warning,
  Pending,
  Upload,
  Download,
  Visibility,
  Edit,
  Search,
  Badge,
  AssignmentTurnedIn,
  Schedule,
  Star,
  LocationOn,
  Phone,
  Email,
  Cancel,
  Refresh,
  FilterList,
} from '@mui/icons-material';

// Mock data for accredited surveyors
const mockSurveyors = [
  {
    id: 1,
    licenseNo: 'GhIS/LS/2024/001',
    name: 'Kwame Mensah',
    email: 'k.mensah@survey.gh',
    phone: '+233 20 123 4567',
    region: 'Greater Accra',
    specialization: 'Cadastral Surveying',
    status: 'active',
    rating: 4.8,
    completedSurveys: 156,
    accreditedDate: '2020-03-15',
    expiryDate: '2025-03-15',
    cpdPoints: 45,
    requiredCpdPoints: 50,
    qualifications: ['BSc Land Surveying - KNUST', 'MSc GIS - Legon'],
    equipment: ['GPS RTK', 'Total Station', 'Drone'],
  },
  {
    id: 2,
    licenseNo: 'GhIS/LS/2024/002',
    name: 'Akosua Boateng',
    email: 'a.boateng@survey.gh',
    phone: '+233 24 567 8901',
    region: 'Ashanti',
    specialization: 'Engineering Surveying',
    status: 'active',
    rating: 4.9,
    completedSurveys: 203,
    accreditedDate: '2019-06-20',
    expiryDate: '2024-06-20',
    cpdPoints: 52,
    requiredCpdPoints: 50,
    qualifications: ['BSc Geomatic Engineering - UMaT', 'PgDip Photogrammetry'],
    equipment: ['GPS RTK', 'LiDAR Scanner', 'UAV Mapping'],
  },
  {
    id: 3,
    licenseNo: 'GhIS/LS/2024/003',
    name: 'Yaw Asante',
    email: 'y.asante@survey.gh',
    phone: '+233 27 234 5678',
    region: 'Western',
    specialization: 'Mining Surveying',
    status: 'pending_renewal',
    rating: 4.6,
    completedSurveys: 89,
    accreditedDate: '2021-01-10',
    expiryDate: '2024-01-10',
    cpdPoints: 38,
    requiredCpdPoints: 50,
    qualifications: ['BSc Surveying - KNUST'],
    equipment: ['GPS RTK', 'Total Station'],
  },
  {
    id: 4,
    licenseNo: 'GhIS/LS/2024/004',
    name: 'Ama Owusu',
    email: 'a.owusu@survey.gh',
    phone: '+233 26 345 6789',
    region: 'Northern',
    specialization: 'Cadastral Surveying',
    status: 'suspended',
    rating: 3.2,
    completedSurveys: 45,
    accreditedDate: '2022-08-05',
    expiryDate: '2025-08-05',
    cpdPoints: 15,
    requiredCpdPoints: 50,
    qualifications: ['HND Surveying - Accra Poly'],
    equipment: ['GPS Standard'],
  },
];

// Mock applications for accreditation
const mockApplications = [
  {
    id: 1,
    applicantName: 'Kofi Adjei',
    applicationDate: '2024-11-01',
    status: 'under_review',
    stage: 2,
    type: 'new',
  },
  {
    id: 2,
    applicantName: 'Efua Mensah',
    applicationDate: '2024-10-28',
    status: 'pending_documents',
    stage: 1,
    type: 'new',
  },
  {
    id: 3,
    applicantName: 'Yaw Asante',
    applicationDate: '2024-11-10',
    status: 'under_review',
    stage: 3,
    type: 'renewal',
  },
];

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function SurveyorAccreditationPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedSurveyor, setSelectedSurveyor] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyLicenseNo, setVerifyLicenseNo] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending_renewal': return 'warning';
      case 'suspended': return 'error';
      case 'expired': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending_renewal': return 'Pending Renewal';
      case 'suspended': return 'Suspended';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const filteredSurveyors = mockSurveyors.filter(surveyor => {
    const matchesSearch = surveyor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surveyor.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || surveyor.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || surveyor.region === filterRegion;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const handleVerifyLicense = () => {
    const found = mockSurveyors.find(s =>
      s.licenseNo.toLowerCase() === verifyLicenseNo.toLowerCase()
    );
    setVerificationResult(found || 'not_found');
  };

  const handleViewDetails = (surveyor) => {
    setSelectedSurveyor(surveyor);
    setDetailsDialogOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Surveyor Accreditation Portal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage surveyor licenses, verify accreditation, and track CPD compliance
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle color="success" />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {mockSurveyors.filter(s => s.status === 'active').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Surveyors
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Warning color="warning" />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {mockSurveyors.filter(s => s.status === 'pending_renewal').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending Renewal
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Pending color="info" />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {mockApplications.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <Cancel color="error" />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {mockSurveyors.filter(s => s.status === 'suspended').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Suspended
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Verify Card */}
      <Card sx={{ mb: 3, bgcolor: '#F0FDF4', border: '1px solid #86EFAC' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">Quick License Verification</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verify a surveyor's accreditation status instantly
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter License No. (e.g., GhIS/LS/2024/001)"
                  value={verifyLicenseNo}
                  onChange={(e) => setVerifyLicenseNo(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleVerifyLicense}
                  disabled={!verifyLicenseNo}
                >
                  Verify
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Verification Result */}
          {verificationResult && (
            <Box sx={{ mt: 2 }}>
              {verificationResult === 'not_found' ? (
                <Alert severity="error">
                  License number not found. Please check and try again.
                </Alert>
              ) : (
                <Alert
                  severity={verificationResult.status === 'active' ? 'success' : 'warning'}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => handleViewDetails(verificationResult)}
                    >
                      View Details
                    </Button>
                  }
                >
                  <strong>{verificationResult.name}</strong> - {verificationResult.licenseNo}
                  <br />
                  Status: <Chip label={getStatusLabel(verificationResult.status)} size="small" color={getStatusColor(verificationResult.status)} sx={{ ml: 1 }} />
                  {verificationResult.status === 'active' && (
                    <span> | Valid until: {new Date(verificationResult.expiryDate).toLocaleDateString()}</span>
                  )}
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Accredited Surveyors" />
          <Tab label="Applications" />
          <Tab label="CPD Tracking" />
        </Tabs>

        {/* Surveyors Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search by name or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending_renewal">Pending Renewal</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Region</InputLabel>
                <Select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="all">All Regions</MenuItem>
                  <MenuItem value="Greater Accra">Greater Accra</MenuItem>
                  <MenuItem value="Ashanti">Ashanti</MenuItem>
                  <MenuItem value="Western">Western</MenuItem>
                  <MenuItem value="Northern">Northern</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Surveyors Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Surveyor</TableCell>
                    <TableCell>License No.</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSurveyors.map((surveyor) => (
                    <TableRow key={surveyor.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {surveyor.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {surveyor.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {surveyor.completedSurveys} surveys
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {surveyor.licenseNo}
                        </Typography>
                      </TableCell>
                      <TableCell>{surveyor.region}</TableCell>
                      <TableCell>{surveyor.specialization}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(surveyor.status)}
                          size="small"
                          color={getStatusColor(surveyor.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2">{surveyor.rating}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(surveyor)}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        {/* Applications Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Pending Applications</Typography>
            <List>
              {mockApplications.map((app) => (
                <Paper key={app.id} variant="outlined" sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: app.type === 'new' ? 'primary.light' : 'warning.light' }}>
                        {app.type === 'new' ? <Person /> : <Refresh />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={app.applicantName}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {app.type === 'new' ? 'New Application' : 'Renewal'} | Applied: {app.applicationDate}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Stepper activeStep={app.stage} alternativeLabel>
                              <Step><StepLabel>Documents</StepLabel></Step>
                              <Step><StepLabel>Review</StepLabel></Step>
                              <Step><StepLabel>Interview</StepLabel></Step>
                              <Step><StepLabel>Approval</StepLabel></Step>
                            </Stepper>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button variant="outlined" size="small">
                        Review
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </CardContent>
        </TabPanel>

        {/* CPD Tracking Tab */}
        <TabPanel value={tabValue} index={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>CPD Points Compliance</Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Surveyors must earn 50 CPD points annually to maintain active accreditation status.
            </Alert>

            {mockSurveyors.map((surveyor) => (
              <Paper key={surveyor.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {surveyor.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {surveyor.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {surveyor.licenseNo}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {surveyor.cpdPoints} / {surveyor.requiredCpdPoints} points
                    </Typography>
                    <Chip
                      label={surveyor.cpdPoints >= surveyor.requiredCpdPoints ? 'Compliant' : 'Below Target'}
                      size="small"
                      color={surveyor.cpdPoints >= surveyor.requiredCpdPoints ? 'success' : 'warning'}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((surveyor.cpdPoints / surveyor.requiredCpdPoints) * 100, 100)}
                  color={surveyor.cpdPoints >= surveyor.requiredCpdPoints ? 'success' : 'warning'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Paper>
            ))}
          </CardContent>
        </TabPanel>
      </Card>

      {/* Surveyor Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedSurveyor && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                    {selectedSurveyor.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedSurveyor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedSurveyor.licenseNo}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={getStatusLabel(selectedSurveyor.status)}
                  color={getStatusColor(selectedSurveyor.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Email fontSize="small" /></ListItemIcon>
                      <ListItemText primary={selectedSurveyor.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone fontSize="small" /></ListItemIcon>
                      <ListItemText primary={selectedSurveyor.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationOn fontSize="small" /></ListItemIcon>
                      <ListItemText primary={selectedSurveyor.region} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>License Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Specialization"
                        secondary={selectedSurveyor.specialization}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Accredited Since"
                        secondary={new Date(selectedSurveyor.accreditedDate).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Expires"
                        secondary={new Date(selectedSurveyor.expiryDate).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>Qualifications</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedSurveyor.qualifications.map((qual, i) => (
                      <Chip key={i} label={qual} size="small" icon={<School />} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Equipment</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedSurveyor.equipment.map((equip, i) => (
                      <Chip key={i} label={equip} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Performance</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary">{selectedSurveyor.completedSurveys}</Typography>
                        <Typography variant="caption">Surveys Completed</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Star sx={{ color: 'warning.main' }} />
                          <Typography variant="h5">{selectedSurveyor.rating}</Typography>
                        </Box>
                        <Typography variant="caption">Rating</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color={selectedSurveyor.cpdPoints >= 50 ? 'success.main' : 'warning.main'}>
                          {selectedSurveyor.cpdPoints}
                        </Typography>
                        <Typography variant="caption">CPD Points</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Download />}>
                Download Certificate
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
