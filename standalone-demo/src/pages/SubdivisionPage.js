import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, TextField,
  Stepper, Step, StepLabel, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Divider, Alert, List, ListItem, ListItemIcon,
  ListItemText, Checkbox
} from '@mui/material';
import {
  GridOn, CallSplit, Merge, Add, CheckCircle, Schedule, Description, Map,
  Assignment, Warning
} from '@mui/icons-material';

export default function SubdivisionPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [applicationType, setApplicationType] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mock subdivision/merger applications
  const applications = [
    {
      id: 1,
      type: 'Subdivision',
      parcelId: 'ACC/2024/001',
      location: 'East Legon, Accra',
      originalArea: 2500,
      proposedParcels: 4,
      proposedAreas: [625, 625, 625, 625],
      status: 'Under Review',
      applicant: 'Kwame Asante',
      submittedDate: '2024-10-15',
      purpose: 'Residential Development',
      currentStep: 2
    },
    {
      id: 2,
      type: 'Merger',
      parcelId: 'ACC/2024/010, ACC/2024/011',
      location: 'Airport Residential',
      originalArea: 800,
      proposedParcels: 1,
      proposedAreas: [1600],
      status: 'Approved',
      applicant: 'Accra Developers Ltd',
      submittedDate: '2024-09-20',
      purpose: 'Commercial Building',
      currentStep: 5
    },
    {
      id: 3,
      type: 'Subdivision',
      parcelId: 'ASH/2024/005',
      location: 'Kumasi Ahodwo',
      originalArea: 5000,
      proposedParcels: 10,
      proposedAreas: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
      status: 'Pending Survey',
      applicant: 'Ashanti Estates',
      submittedDate: '2024-10-28',
      purpose: 'Housing Estate',
      currentStep: 1
    },
    {
      id: 4,
      type: 'Land Use Change',
      parcelId: 'WES/2024/003',
      location: 'Takoradi Beach Road',
      originalArea: 3000,
      proposedParcels: 1,
      proposedAreas: [3000],
      status: 'EPA Review',
      applicant: 'Western Hotels Ltd',
      submittedDate: '2024-10-05',
      purpose: 'Agricultural to Commercial',
      currentStep: 3
    }
  ];

  const workflowSteps = [
    'Application Submitted',
    'Survey Verification',
    'Planning Review',
    'Public Notice',
    'Final Approval',
    'New Titles Issued'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Under Review': return 'primary';
      case 'Pending Survey': return 'warning';
      case 'EPA Review': return 'info';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Subdivision': return <CallSplit />;
      case 'Merger': return <Merge />;
      case 'Land Use Change': return <GridOn />;
      default: return <Map />;
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleNewApplication = () => {
    setNewApplicationOpen(true);
  };

  const handleSubmitApplication = () => {
    setAlert({ type: 'success', message: 'Application submitted successfully. Reference number: SUB/2024/156' });
    setNewApplicationOpen(false);
  };

  const requirements = [
    { label: 'Completed Application Form', checked: true },
    { label: 'Proof of Ownership (Title Certificate)', checked: true },
    { label: 'Site Plan/Survey Drawing', checked: false },
    { label: 'Environmental Impact Assessment (if required)', checked: false },
    { label: 'Town Planning Approval', checked: false },
    { label: 'Payment of Processing Fee', checked: false }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <GridOn sx={{ mr: 1, verticalAlign: 'middle' }} />
            Subdivision & Land Use Change
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage land subdivision, merger, and land use change applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewApplication}
          sx={{ bgcolor: '#006B3F' }}
        >
          New Application
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CallSplit sx={{ fontSize: 32, color: '#006B3F', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {applications.filter(a => a.type === 'Subdivision').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Subdivisions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Merge sx={{ fontSize: 32, color: '#FCD116', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {applications.filter(a => a.type === 'Merger').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Mergers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GridOn sx={{ fontSize: 32, color: '#CE1126', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {applications.filter(a => a.type === 'Land Use Change').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Land Use Changes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {applications.filter(a => a.status !== 'Approved' && a.status !== 'Rejected').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Applications Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Applications</Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Parcel ID</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Original Area</TableCell>
                <TableCell>Proposed</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(app.type)}
                      <Typography variant="body2">{app.type}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {app.parcelId}
                    </Typography>
                  </TableCell>
                  <TableCell>{app.location}</TableCell>
                  <TableCell>{app.originalArea.toLocaleString()} m²</TableCell>
                  <TableCell>
                    {app.type === 'Subdivision'
                      ? `${app.proposedParcels} parcels`
                      : app.type === 'Merger'
                      ? '1 parcel'
                      : app.purpose.split(' to ')[1]}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.status}
                      size="small"
                      color={getStatusColor(app.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(app)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Application Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getTypeIcon(selectedApplication.type)}
                  <Typography variant="h6">{selectedApplication.type} Application</Typography>
                </Box>
                <Chip
                  label={selectedApplication.status}
                  color={getStatusColor(selectedApplication.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parcel ID</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedApplication.parcelId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Applicant</Typography>
                  <Typography variant="body1">{selectedApplication.applicant}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{selectedApplication.location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Original Area</Typography>
                  <Typography variant="body1">{selectedApplication.originalArea.toLocaleString()} m²</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Purpose</Typography>
                  <Typography variant="body1">{selectedApplication.purpose}</Typography>
                </Grid>
                {selectedApplication.type === 'Subdivision' && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Proposed Parcels</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {selectedApplication.proposedAreas.map((area, idx) => (
                        <Chip key={idx} label={`Parcel ${idx + 1}: ${area} m²`} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Typography variant="subtitle2" gutterBottom>Workflow Progress</Typography>
              <Stepper activeStep={selectedApplication.currentStep} alternativeLabel sx={{ mb: 2 }}>
                {workflowSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Alert severity="info" sx={{ mt: 2 }}>
                Submitted on {new Date(selectedApplication.submittedDate).toLocaleDateString()}.
                {selectedApplication.status === 'Approved'
                  ? ' Application has been approved. New titles will be issued shortly.'
                  : ' Estimated completion: 15-30 business days.'}
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedApplication.status === 'Approved' && (
                <Button variant="contained" startIcon={<Description />} sx={{ bgcolor: '#006B3F' }}>
                  Download Approval
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Application Dialog */}
      <Dialog
        open={newApplicationOpen}
        onClose={() => setNewApplicationOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>New Subdivision/Land Use Change Application</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Application Type</InputLabel>
              <Select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
                label="Application Type"
              >
                <MenuItem value="subdivision">Subdivision</MenuItem>
                <MenuItem value="merger">Parcel Merger</MenuItem>
                <MenuItem value="landuse">Land Use Change</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Parcel ID(s)"
              sx={{ mb: 2 }}
              placeholder="e.g., ACC/2024/001"
              helperText="For mergers, enter multiple IDs separated by commas"
            />

            {applicationType === 'subdivision' && (
              <TextField
                fullWidth
                label="Number of Proposed Parcels"
                type="number"
                sx={{ mb: 2 }}
              />
            )}

            {applicationType === 'landuse' && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Current Land Use</InputLabel>
                  <Select label="Current Land Use" defaultValue="">
                    <MenuItem value="agricultural">Agricultural</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Proposed Land Use</InputLabel>
                  <Select label="Proposed Land Use" defaultValue="">
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="mixed">Mixed Use</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            <TextField
              fullWidth
              label="Purpose/Justification"
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" gutterBottom>Required Documents</Typography>
            <List dense>
              {requirements.map((req, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Checkbox checked={req.checked} />
                  </ListItemIcon>
                  <ListItemText primary={req.label} />
                </ListItem>
              ))}
            </List>

            <Alert severity="warning" icon={<Warning />} sx={{ mt: 2 }}>
              Processing fees: Subdivision (GHS 2,000), Merger (GHS 1,500), Land Use Change (GHS 3,000).
              Additional fees may apply based on property size and complexity.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewApplicationOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitApplication}
            sx={{ bgcolor: '#006B3F' }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
