import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, TextField,
  Stepper, Step, StepLabel, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Divider, Alert, List, ListItem, ListItemText,
  ListItemIcon, Avatar
} from '@mui/material';
import {
  FamilyRestroom, Person, Gavel, Description, Add, CheckCircle, Schedule,
  Warning, AccountTree, VerifiedUser
} from '@mui/icons-material';

export default function SuccessionPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mock succession cases
  const successionCases = [
    {
      id: 1,
      caseNumber: 'SUC/2024/001',
      deceased: 'Kofi Mensah',
      deathDate: '2024-06-15',
      parcels: ['ACC/2024/001', 'ACC/2024/015'],
      totalValue: 2500000,
      beneficiaries: [
        { name: 'Ama Mensah', relation: 'Spouse', share: 50 },
        { name: 'Kweku Mensah', relation: 'Son', share: 25 },
        { name: 'Akosua Mensah', relation: 'Daughter', share: 25 }
      ],
      status: 'Court Probate',
      submittedDate: '2024-07-20',
      hasWill: true,
      currentStep: 2
    },
    {
      id: 2,
      caseNumber: 'SUC/2024/002',
      deceased: 'Yaw Boateng',
      deathDate: '2024-03-10',
      parcels: ['ASH/2024/008'],
      totalValue: 850000,
      beneficiaries: [
        { name: 'Abena Boateng', relation: 'Spouse', share: 40 },
        { name: 'Kofi Boateng', relation: 'Son', share: 30 },
        { name: 'Esi Boateng', relation: 'Daughter', share: 30 }
      ],
      status: 'Title Transfer',
      submittedDate: '2024-04-05',
      hasWill: false,
      currentStep: 4
    },
    {
      id: 3,
      caseNumber: 'SUC/2024/003',
      deceased: 'Nana Owusu',
      deathDate: '2024-08-22',
      parcels: ['WES/2024/003', 'WES/2024/004', 'WES/2024/005'],
      totalValue: 5200000,
      beneficiaries: [
        { name: 'Owusu Family Trust', relation: 'Family Trust', share: 100 }
      ],
      status: 'Document Review',
      submittedDate: '2024-09-15',
      hasWill: true,
      currentStep: 1
    },
    {
      id: 4,
      caseNumber: 'SUC/2024/004',
      deceased: 'Akua Darko',
      deathDate: '2024-01-05',
      parcels: ['NOR/2024/012'],
      totalValue: 380000,
      beneficiaries: [
        { name: 'Kwame Darko', relation: 'Son', share: 50 },
        { name: 'Adjoa Darko', relation: 'Daughter', share: 50 }
      ],
      status: 'Completed',
      submittedDate: '2024-02-10',
      hasWill: false,
      currentStep: 5
    }
  ];

  const workflowSteps = [
    'Application Filed',
    'Document Review',
    'Court Probate',
    'Tax Clearance',
    'Title Transfer',
    'Completed'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Title Transfer': return 'primary';
      case 'Court Probate': return 'warning';
      case 'Document Review': return 'info';
      case 'Disputed': return 'error';
      default: return 'default';
    }
  };

  const handleViewDetails = (successionCase) => {
    setSelectedCase(successionCase);
    setDialogOpen(true);
  };

  const handleNewCase = () => {
    setNewCaseOpen(true);
  };

  const handleSubmitCase = () => {
    setAlert({ type: 'success', message: 'Succession case filed successfully. Reference: SUC/2024/005' });
    setNewCaseOpen(false);
  };

  const totalCases = successionCases.length;
  const activeCases = successionCases.filter(c => c.status !== 'Completed').length;
  const completedCases = successionCases.filter(c => c.status === 'Completed').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <FamilyRestroom sx={{ mr: 1, verticalAlign: 'middle' }} />
            Succession & Inheritance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process land inheritance and succession transfers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewCase}
          sx={{ bgcolor: '#006B3F' }}
        >
          File New Case
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
          <Card sx={{ bgcolor: '#006B3F', color: 'white' }}>
            <CardContent>
              <FamilyRestroom sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{totalCases}</Typography>
              <Typography variant="body2">Total Cases</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FCD116', color: '#333' }}>
            <CardContent>
              <Schedule sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{activeCases}</Typography>
              <Typography variant="body2">In Progress</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <CheckCircle sx={{ fontSize: 32, mb: 1, color: 'success.main' }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">{completedCases}</Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cases Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Succession Cases</Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case Number</TableCell>
                <TableCell>Deceased</TableCell>
                <TableCell>Parcels</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Beneficiaries</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {successionCases.map((succCase) => (
                <TableRow key={succCase.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {succCase.caseNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{succCase.deceased}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(succCase.deathDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {succCase.parcels.length} parcel{succCase.parcels.length > 1 ? 's' : ''}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      GHS {succCase.totalValue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{succCase.beneficiaries.length}</TableCell>
                  <TableCell>
                    <Chip
                      label={succCase.status}
                      size="small"
                      color={getStatusColor(succCase.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(succCase)}
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

      {/* Case Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCase && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Case: {selectedCase.caseNumber}</Typography>
                <Box>
                  {selectedCase.hasWill && (
                    <Chip label="Has Will" size="small" color="info" sx={{ mr: 1 }} />
                  )}
                  <Chip
                    label={selectedCase.status}
                    color={getStatusColor(selectedCase.status)}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Deceased</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedCase.deceased}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date of Death</Typography>
                  <Typography variant="body1">
                    {new Date(selectedCase.deathDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Properties</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    {selectedCase.parcels.map((parcel) => (
                      <Chip key={parcel} label={parcel} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total Estate Value</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    GHS {selectedCase.totalValue.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Filed Date</Typography>
                  <Typography variant="body1">
                    {new Date(selectedCase.submittedDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>
                <AccountTree sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                Beneficiaries
              </Typography>
              <List dense sx={{ bgcolor: '#f5f5f5', borderRadius: 1, mb: 3 }}>
                {selectedCase.beneficiaries.map((beneficiary, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#006B3F' }}>
                        <Person sx={{ fontSize: 18 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={beneficiary.name}
                      secondary={`${beneficiary.relation} - ${beneficiary.share}% share`}
                    />
                    <Chip
                      label={`GHS ${(selectedCase.totalValue * beneficiary.share / 100).toLocaleString()}`}
                      size="small"
                      color="primary"
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle2" gutterBottom>Process Status</Typography>
              <Stepper activeStep={selectedCase.currentStep} alternativeLabel>
                {workflowSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {selectedCase.status !== 'Completed' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Estimated completion: 30-90 days depending on court proceedings and document verification.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedCase.status === 'Completed' && (
                <Button variant="contained" startIcon={<Description />} sx={{ bgcolor: '#006B3F' }}>
                  Download Certificate
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Case Dialog */}
      <Dialog
        open={newCaseOpen}
        onClose={() => setNewCaseOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>File Succession Case</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Deceased Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name of Deceased" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Date of Death" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Ghana Card Number" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Has Will?</InputLabel>
                  <Select label="Has Will?" defaultValue="">
                    <MenuItem value="yes">Yes - Testate Succession</MenuItem>
                    <MenuItem value="no">No - Intestate Succession</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Property Information
            </Typography>
            <TextField
              fullWidth
              label="Parcel ID(s)"
              sx={{ mb: 2 }}
              placeholder="Enter parcel IDs separated by commas"
              helperText="e.g., ACC/2024/001, ACC/2024/002"
            />

            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Applicant Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Applicant Name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship to Deceased</InputLabel>
                  <Select label="Relationship to Deceased" defaultValue="">
                    <MenuItem value="spouse">Spouse</MenuItem>
                    <MenuItem value="child">Child</MenuItem>
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="sibling">Sibling</MenuItem>
                    <MenuItem value="executor">Executor (Will)</MenuItem>
                    <MenuItem value="administrator">Administrator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Contact Phone" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address" type="email" />
              </Grid>
            </Grid>

            <Alert severity="warning" icon={<Warning />}>
              <Typography variant="body2" fontWeight="bold">Required Documents:</Typography>
              <Typography variant="caption">
                Death Certificate, Title Certificates, Will (if any), Family Tree/Affidavit,
                Ghana Cards of all beneficiaries, Court Letters of Administration (if no will)
              </Typography>
            </Alert>

            <Alert severity="info" sx={{ mt: 2 }} icon={<Gavel />}>
              Processing fee: GHS 1,500 - 5,000 depending on estate value.
              Court probate fees may apply separately.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCaseOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitCase}
            sx={{ bgcolor: '#006B3F' }}
          >
            Submit Case
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
