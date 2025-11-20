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
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Home,
  Delete,
  Visibility,
  Link as LinkIcon,
  CheckCircle,
  Warning,
  Info,
  Payment,
  Description,
  Edit
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock linked properties
const initialProperties = [
  {
    id: 1,
    brn: 'BRN-2024-001234',
    address: '15 Independence Avenue, Accra',
    titleNumber: 'GA-2024-00456',
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    propertyType: 'Residential',
    landUse: 'Single Family Dwelling',
    size: '450 sq.m',
    ownershipType: 'Freehold',
    linkedDate: '2024-01-15',
    verificationStatus: 'verified',
    outstandingBalance: 2500.00,
    lastPaymentDate: '2024-08-15'
  },
  {
    id: 2,
    brn: 'BRN-2024-005678',
    address: '23 Liberation Road, Kumasi',
    titleNumber: 'KU-2024-00789',
    region: 'Ashanti',
    district: 'Kumasi Metropolitan',
    propertyType: 'Commercial',
    landUse: 'Retail Shop',
    size: '200 sq.m',
    ownershipType: 'Leasehold',
    linkedDate: '2024-03-20',
    verificationStatus: 'verified',
    outstandingBalance: 1800.00,
    lastPaymentDate: '2024-09-20'
  }
];

export default function MyPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState(initialProperties);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchType, setSearchType] = useState('brn');
  const [searchValue, setSearchValue] = useState('');
  const [foundProperty, setFoundProperty] = useState(null);

  const linkSteps = ['Find Property', 'Verify Ownership', 'Confirm'];

  const handleSearch = () => {
    // Mock search - in real app would call API
    if (searchValue.toLowerCase().includes('brn') || searchValue.toLowerCase().includes('ga-') || searchValue.toLowerCase().includes('ku-')) {
      setFoundProperty({
        brn: 'BRN-2024-009999',
        address: '45 Ring Road Central, Accra',
        titleNumber: 'GA-2024-00999',
        region: 'Greater Accra',
        district: 'Accra Metropolitan',
        propertyType: 'Residential',
        landUse: 'Multi-Family Dwelling',
        size: '600 sq.m',
        ownershipType: 'Freehold'
      });
      setAlert({ type: 'success', message: 'Property found! Please verify ownership.' });
    } else {
      setAlert({ type: 'error', message: 'No property found with the provided reference.' });
      setFoundProperty(null);
    }
  };

  const handleLinkProperty = async () => {
    setProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add property to list
    const newProperty = {
      ...foundProperty,
      id: properties.length + 1,
      linkedDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
      outstandingBalance: 0,
      lastPaymentDate: null
    };

    setProperties([...properties, newProperty]);
    setProcessing(false);
    setLinkDialogOpen(false);
    setActiveStep(0);
    setSearchValue('');
    setFoundProperty(null);
    setAlert({ type: 'success', message: 'Property linked successfully! Verification is in progress.' });
  };

  const handleUnlinkProperty = async () => {
    setProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProperties(properties.filter(p => p.id !== selectedProperty.id));
    setProcessing(false);
    setUnlinkDialogOpen(false);
    setSelectedProperty(null);
    setAlert({ type: 'success', message: 'Property unlinked successfully.' });
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle fontSize="small" />;
      case 'pending': return <Warning fontSize="small" />;
      default: return <Info fontSize="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            My Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage properties linked to your account for easy billing and payments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setLinkDialogOpen(true)}
        >
          Link New Property
        </Button>
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
                <Home color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {properties.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Linked Properties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle color="success" />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {properties.filter(p => p.verificationStatus === 'verified').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Payment color="error" />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  GHS {properties.reduce((sum, p) => sum + p.outstandingBalance, 0).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Outstanding
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Properties Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Linked Properties
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>BRN</TableCell>
                  <TableCell>Title Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Outstanding</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Home sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography color="text.secondary">
                        No properties linked to your account yet.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setLinkDialogOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Link Your First Property
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {property.address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {property.region}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {property.brn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {property.titleNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={property.propertyType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(property.verificationStatus)}
                          label={property.verificationStatus}
                          size="small"
                          color={getStatusColor(property.verificationStatus)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            color: property.outstandingBalance > 0 ? 'error.main' : 'success.main'
                          }}
                        >
                          GHS {property.outstandingBalance.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewProperty(property)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Unlink Property">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedProperty(property);
                              setUnlinkDialogOpen(true);
                            }}
                          >
                            <Delete />
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

      {/* Link Property Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => {
          setLinkDialogOpen(false);
          setActiveStep(0);
          setSearchValue('');
          setFoundProperty(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LinkIcon />
            Link New Property
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 1 }}>
            {linkSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Search for your property using BRN or Title Number to link it to your account.
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  label="Search By"
                >
                  <MenuItem value="brn">Billing Reference Number (BRN)</MenuItem>
                  <MenuItem value="title">Title Number</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label={searchType === 'brn' ? 'Enter BRN' : 'Enter Title Number'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'brn' ? 'e.g., BRN-2024-001234' : 'e.g., GA-2024-00456'}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
              >
                Search Property
              </Button>

              {foundProperty && (
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {foundProperty.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      BRN: {foundProperty.brn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Title: {foundProperty.titleNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {foundProperty.propertyType} - {foundProperty.landUse}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                To verify ownership, we will send a verification code to the registered address or you can provide proof of ownership documents.
              </Alert>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Property to Link:
              </Typography>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">{foundProperty?.address}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {foundProperty?.brn} | {foundProperty?.titleNumber}
                  </Typography>
                </CardContent>
              </Card>
              <Typography variant="body2" color="text.secondary">
                By clicking "Verify", you confirm that you are the legal owner or authorized representative of this property.
              </Typography>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Verification initiated! Your property will be linked once verified.
              </Alert>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Summary:
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>{foundProperty?.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BRN</TableCell>
                    <TableCell>{foundProperty?.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Title Number</TableCell>
                    <TableCell>{foundProperty?.titleNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Property Type</TableCell>
                    <TableCell>{foundProperty?.propertyType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Land Use</TableCell>
                    <TableCell>{foundProperty?.landUse}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </Button>
          )}
          <Button onClick={() => {
            setLinkDialogOpen(false);
            setActiveStep(0);
            setSearchValue('');
            setFoundProperty(null);
          }}>
            Cancel
          </Button>
          {activeStep < 2 && foundProperty && (
            <Button
              variant="contained"
              onClick={() => setActiveStep(activeStep + 1)}
            >
              {activeStep === 0 ? 'Proceed to Verify' : 'Verify'}
            </Button>
          )}
          {activeStep === 2 && (
            <Button
              variant="contained"
              onClick={handleLinkProperty}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={20} /> : <LinkIcon />}
            >
              {processing ? 'Linking...' : 'Link Property'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* View Property Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedProperty.address}
              </Typography>
              <Chip
                icon={getStatusIcon(selectedProperty.verificationStatus)}
                label={selectedProperty.verificationStatus}
                size="small"
                color={getStatusColor(selectedProperty.verificationStatus)}
                sx={{ mb: 2 }}
              />
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>BRN</TableCell>
                    <TableCell>{selectedProperty.brn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title Number</TableCell>
                    <TableCell>{selectedProperty.titleNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
                    <TableCell>{selectedProperty.region}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>District</TableCell>
                    <TableCell>{selectedProperty.district}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property Type</TableCell>
                    <TableCell>{selectedProperty.propertyType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Land Use</TableCell>
                    <TableCell>{selectedProperty.landUse}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                    <TableCell>{selectedProperty.size}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ownership Type</TableCell>
                    <TableCell>{selectedProperty.ownershipType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Linked Date</TableCell>
                    <TableCell>{new Date(selectedProperty.linkedDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Outstanding Balance</TableCell>
                    <TableCell sx={{ color: selectedProperty.outstandingBalance > 0 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                      GHS {selectedProperty.outstandingBalance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  {selectedProperty.lastPaymentDate && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Last Payment</TableCell>
                      <TableCell>{new Date(selectedProperty.lastPaymentDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedProperty?.outstandingBalance > 0 && (
            <Button variant="contained" startIcon={<Payment />}>
              Pay Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Unlink Confirmation Dialog */}
      <Dialog
        open={unlinkDialogOpen}
        onClose={() => setUnlinkDialogOpen(false)}
      >
        <DialogTitle>Unlink Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to unlink <strong>{selectedProperty?.address}</strong> from your account?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            You will no longer be able to view billing information or make payments for this property through your account.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnlinkDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleUnlinkProperty}
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <Delete />}
          >
            {processing ? 'Unlinking...' : 'Unlink Property'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
