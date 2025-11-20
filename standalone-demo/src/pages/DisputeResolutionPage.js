import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  Stepper, Step, StepLabel, Alert, Divider, Timeline, TimelineItem, TimelineSeparator,
  TimelineConnector, TimelineContent, TimelineDot, Tabs, Tab, IconButton, Tooltip
} from '@mui/material';
import {
  Gavel, Add, Visibility, Schedule, CheckCircle, Warning, Person, Description,
  LocationOn, Phone, Email, History, Balance, Handshake, LocalPolice
} from '@mui/icons-material';

export default function DisputeResolutionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [alert, setAlert] = useState(null);

  const [newDispute, setNewDispute] = useState({
    parcel_id: '',
    dispute_type: '',
    description: '',
    opposing_party: '',
    opposing_contact: '',
    evidence_docs: []
  });

  // Mock disputes data
  const [disputes] = useState([
    {
      id: 'DSP-2024-001',
      parcel_id: 'GH-ACC-12345',
      location: 'East Legon, Accra',
      dispute_type: 'Boundary Dispute',
      status: 'Mediation',
      filed_date: '2024-10-15',
      complainant: 'Kofi Mensah',
      respondent: 'Ama Darko',
      description: 'Dispute over boundary markers between adjacent parcels',
      priority: 'High',
      assigned_officer: 'James Owusu',
      next_hearing: '2024-11-25',
      resolution_progress: 60,
      timeline: [
        { date: '2024-10-15', action: 'Dispute Filed', status: 'completed' },
        { date: '2024-10-20', action: 'Initial Review', status: 'completed' },
        { date: '2024-10-28', action: 'Site Inspection', status: 'completed' },
        { date: '2024-11-10', action: 'Mediation Session 1', status: 'completed' },
        { date: '2024-11-25', action: 'Mediation Session 2', status: 'pending' },
        { date: 'TBD', action: 'Resolution', status: 'pending' }
      ]
    },
    {
      id: 'DSP-2024-002',
      parcel_id: 'GH-ASH-45678',
      location: 'Adum, Kumasi',
      dispute_type: 'Ownership Claim',
      status: 'Court Referral',
      filed_date: '2024-09-20',
      complainant: 'Yaw Boateng',
      respondent: 'Kwame Asante',
      description: 'Multiple parties claiming ownership of the same parcel',
      priority: 'Critical',
      assigned_officer: 'Abena Osei',
      next_hearing: '2024-12-05',
      resolution_progress: 40,
      timeline: [
        { date: '2024-09-20', action: 'Dispute Filed', status: 'completed' },
        { date: '2024-09-25', action: 'Document Verification', status: 'completed' },
        { date: '2024-10-05', action: 'Mediation Attempted', status: 'completed' },
        { date: '2024-10-15', action: 'Referred to Court', status: 'completed' },
        { date: '2024-12-05', action: 'Court Hearing', status: 'pending' }
      ]
    },
    {
      id: 'DSP-2024-003',
      parcel_id: 'GH-WR-78910',
      location: 'Takoradi',
      dispute_type: 'Encroachment',
      status: 'Under Review',
      filed_date: '2024-11-01',
      complainant: 'Akua Serwaa',
      respondent: 'Unknown Party',
      description: 'Unauthorized construction on part of registered land',
      priority: 'Medium',
      assigned_officer: 'Pending Assignment',
      next_hearing: 'TBD',
      resolution_progress: 15,
      timeline: [
        { date: '2024-11-01', action: 'Dispute Filed', status: 'completed' },
        { date: '2024-11-05', action: 'Under Review', status: 'in_progress' }
      ]
    },
    {
      id: 'DSP-2023-089',
      parcel_id: 'GH-NR-11213',
      location: 'Tamale',
      dispute_type: 'Inheritance Dispute',
      status: 'Resolved',
      filed_date: '2023-08-10',
      complainant: 'Family of Late Chief Abdulai',
      respondent: 'Musa Ibrahim',
      description: 'Dispute over inheritance rights to family land',
      priority: 'Low',
      assigned_officer: 'Fatima Mohammed',
      resolution_date: '2024-01-15',
      resolution_progress: 100,
      resolution_outcome: 'Settled through family mediation. Land divided among rightful heirs.',
      timeline: [
        { date: '2023-08-10', action: 'Dispute Filed', status: 'completed' },
        { date: '2023-08-20', action: 'Family Meeting', status: 'completed' },
        { date: '2023-09-15', action: 'Document Review', status: 'completed' },
        { date: '2023-10-20', action: 'Mediation', status: 'completed' },
        { date: '2024-01-15', action: 'Resolution Achieved', status: 'completed' }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'Mediation': return 'info';
      case 'Court Referral': return 'error';
      case 'Under Review': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const handleFileDispute = () => {
    setAlert({ type: 'success', message: 'Dispute filed successfully. Reference: DSP-2024-004' });
    setDialogOpen(false);
    setNewDispute({
      parcel_id: '',
      dispute_type: '',
      description: '',
      opposing_party: '',
      opposing_contact: '',
      evidence_docs: []
    });
  };

  const filteredDisputes = tabValue === 0
    ? disputes
    : tabValue === 1
    ? disputes.filter(d => d.status !== 'Resolved')
    : disputes.filter(d => d.status === 'Resolved');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
            Dispute Resolution
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Register, track, and resolve land disputes through mediation or court referral
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#006B3F' }}
        >
          File New Dispute
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
              <Typography variant="h4" fontWeight="bold" color="primary">
                {disputes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Disputes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {disputes.filter(d => d.status === 'Under Review').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Under Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {disputes.filter(d => d.status === 'Mediation').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">In Mediation</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {disputes.filter(d => d.status === 'Resolved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Resolved</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="All Disputes" />
          <Tab label="Active" />
          <Tab label="Resolved" />
        </Tabs>
      </Paper>

      {/* Disputes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Dispute ID</TableCell>
              <TableCell>Parcel</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Parties</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Filed Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDisputes.map((dispute) => (
              <TableRow key={dispute.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{dispute.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{dispute.parcel_id}</Typography>
                  <Typography variant="caption" color="text.secondary">{dispute.location}</Typography>
                </TableCell>
                <TableCell>{dispute.dispute_type}</TableCell>
                <TableCell>
                  <Typography variant="body2">{dispute.complainant}</Typography>
                  <Typography variant="caption" color="text.secondary">vs {dispute.respondent}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={dispute.status} size="small" color={getStatusColor(dispute.status)} />
                </TableCell>
                <TableCell>
                  <Chip label={dispute.priority} size="small" color={getPriorityColor(dispute.priority)} variant="outlined" />
                </TableCell>
                <TableCell>{dispute.filed_date}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => { setSelectedDispute(dispute); setDetailDialogOpen(true); }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* File New Dispute Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
          File New Land Dispute
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parcel ID"
                value={newDispute.parcel_id}
                onChange={(e) => setNewDispute({ ...newDispute, parcel_id: e.target.value })}
                placeholder="GH-XXX-XXXXX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dispute Type</InputLabel>
                <Select
                  value={newDispute.dispute_type}
                  onChange={(e) => setNewDispute({ ...newDispute, dispute_type: e.target.value })}
                  label="Dispute Type"
                >
                  <MenuItem value="Boundary Dispute">Boundary Dispute</MenuItem>
                  <MenuItem value="Ownership Claim">Ownership Claim</MenuItem>
                  <MenuItem value="Encroachment">Encroachment</MenuItem>
                  <MenuItem value="Inheritance Dispute">Inheritance Dispute</MenuItem>
                  <MenuItem value="Fraud/Forgery">Fraud/Forgery</MenuItem>
                  <MenuItem value="Lease Dispute">Lease Dispute</MenuItem>
                  <MenuItem value="Customary Land">Customary Land Dispute</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description of Dispute"
                value={newDispute.description}
                onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                placeholder="Provide detailed description of the dispute..."
              />
            </Grid>
            <Grid item xs={12}>
              <Divider><Chip label="Opposing Party Details" /></Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Opposing Party Name"
                value={newDispute.opposing_party}
                onChange={(e) => setNewDispute({ ...newDispute, opposing_party: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Opposing Party Contact"
                value={newDispute.opposing_contact}
                onChange={(e) => setNewDispute({ ...newDispute, opposing_contact: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" startIcon={<Description />}>
                Upload Evidence Documents
              </Button>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                Accepted: PDF, Images, Survey Reports, Title Documents
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFileDispute}>
            Submit Dispute
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dispute Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedDispute && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Dispute Details: {selectedDispute.id}</Typography>
                <Chip label={selectedDispute.status} color={getStatusColor(selectedDispute.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Dispute Information</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Type</Typography>
                          <Typography variant="body2">{selectedDispute.dispute_type}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Priority</Typography>
                          <Typography variant="body2">
                            <Chip label={selectedDispute.priority} size="small" color={getPriorityColor(selectedDispute.priority)} />
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Parcel ID</Typography>
                          <Typography variant="body2">{selectedDispute.parcel_id}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Location</Typography>
                          <Typography variant="body2">{selectedDispute.location}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Description</Typography>
                          <Typography variant="body2">{selectedDispute.description}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Parties */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Parties Involved</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">Complainant</Typography>
                        <Typography variant="body2">
                          <Person sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {selectedDispute.complainant}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">Respondent</Typography>
                        <Typography variant="body2">
                          <Person sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {selectedDispute.respondent}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Assigned Officer</Typography>
                        <Typography variant="body2">{selectedDispute.assigned_officer}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Timeline */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        <History sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                        Resolution Timeline
                      </Typography>
                      <Stepper orientation="vertical">
                        {selectedDispute.timeline.map((item, index) => (
                          <Step key={index} active={item.status === 'in_progress'} completed={item.status === 'completed'}>
                            <StepLabel
                              optional={<Typography variant="caption">{item.date}</Typography>}
                            >
                              {item.action}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resolution Outcome (if resolved) */}
                {selectedDispute.status === 'Resolved' && (
                  <Grid item xs={12}>
                    <Alert severity="success" icon={<CheckCircle />}>
                      <Typography variant="subtitle2">Resolution Outcome</Typography>
                      <Typography variant="body2">{selectedDispute.resolution_outcome}</Typography>
                      <Typography variant="caption">Resolved on: {selectedDispute.resolution_date}</Typography>
                    </Alert>
                  </Grid>
                )}

                {/* Actions for active disputes */}
                {selectedDispute.status !== 'Resolved' && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" startIcon={<Handshake />}>
                        Schedule Mediation
                      </Button>
                      <Button variant="outlined" startIcon={<LocalPolice />}>
                        Refer to Court
                      </Button>
                      <Button variant="outlined" startIcon={<Description />}>
                        Add Document
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
