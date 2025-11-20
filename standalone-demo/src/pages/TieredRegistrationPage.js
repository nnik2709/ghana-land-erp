import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';

// Tiered Registration System - Based on Fit-for-Purpose approach
// Tier 1: Community Recognition (lowest cost, quickest)
// Tier 2: General Boundary (medium formality)
// Tier 3: Fixed Boundary Survey (full cadastral)

const tierDefinitions = [
  {
    tier: 1,
    name: 'Community Recognition',
    description: 'Social tenure documented through community validation',
    accuracy: '10-50m (general location)',
    cost: '$2-5 per parcel',
    time: '1-2 days',
    method: 'Participatory mapping, sketch maps, community attestation',
    suitable: 'Rural areas, customary lands, initial registration drives',
    evidence: ['Community attestation', 'Witness signatures', 'Sketch map', 'Photos'],
    color: '#059669',
  },
  {
    tier: 2,
    name: 'General Boundary',
    description: 'Visible boundaries mapped using imagery or handheld GPS',
    accuracy: '1-5m (sub-meter possible)',
    cost: '$5-15 per parcel',
    time: '3-7 days',
    method: 'Satellite/drone imagery, handheld GPS, mobile apps',
    suitable: 'Peri-urban areas, small towns, systematic registration',
    evidence: ['GPS coordinates', 'Orthophoto boundary', 'Neighbor agreement', 'ID verification'],
    color: '#0284C7',
  },
  {
    tier: 3,
    name: 'Fixed Boundary Survey',
    description: 'Precise cadastral survey with permanent markers',
    accuracy: '<0.5m (survey-grade)',
    cost: '$50-200 per parcel',
    time: '2-4 weeks',
    method: 'Total station, RTK-GPS, professional surveyor',
    suitable: 'Urban areas, high-value land, formal titles',
    evidence: ['Survey plan', 'Beacon coordinates', 'Licensed surveyor certificate', 'Full documentation'],
    color: '#7C3AED',
  },
];

const mockRegistrations = [
  {
    id: 'REG-2024-001',
    location: 'Ashaiman, Greater Accra',
    tier: 1,
    status: 'completed',
    date: '2024-11-15',
    holders: 'Mensah Family',
    area: '0.8 acres',
    upgradeEligible: true,
  },
  {
    id: 'REG-2024-002',
    location: 'Tema Community 25',
    tier: 2,
    status: 'in_progress',
    date: '2024-11-18',
    holders: 'Abena Osei',
    area: '0.5 acres',
    upgradeEligible: false,
  },
  {
    id: 'REG-2024-003',
    location: 'Airport Residential',
    tier: 3,
    status: 'completed',
    date: '2024-11-10',
    holders: 'GoldStar Properties Ltd',
    area: '2.3 acres',
    upgradeEligible: false,
  },
  {
    id: 'REG-2024-004',
    location: 'Dodowa Rural',
    tier: 1,
    status: 'pending_validation',
    date: '2024-11-19',
    holders: 'Tetteh Community',
    area: '15 acres',
    upgradeEligible: true,
  },
  {
    id: 'REG-2024-005',
    location: 'Madina Zongo',
    tier: 2,
    status: 'completed',
    date: '2024-11-12',
    holders: 'Mohammed Ibrahim',
    area: '0.25 acres',
    upgradeEligible: true,
  },
];

const statistics = {
  totalRegistrations: 45823,
  tier1: 28450,
  tier2: 14230,
  tier3: 3143,
  pendingUpgrades: 892,
  thisMonth: 342,
};

function TieredRegistrationPage() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTier, setSelectedTier] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

  const getStatusChip = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: 'success' },
      in_progress: { label: 'In Progress', color: 'warning' },
      pending_validation: { label: 'Pending Validation', color: 'info' },
      rejected: { label: 'Rejected', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getTierChip = (tier) => {
    const colors = { 1: 'success', 2: 'info', 3: 'secondary' };
    return <Chip label={`Tier ${tier}`} color={colors[tier]} size="small" variant="outlined" />;
  };

  const renderOverview = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        The Fit-for-Purpose approach enables rapid, affordable land registration starting with basic
        community recognition and upgrading to formal survey as needed and resources allow.
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Registrations
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.totalRegistrations.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">
                +{statistics.thisMonth} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Tier 1 (Community)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#059669' }}>
                {statistics.tier1.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(statistics.tier1 / statistics.totalRegistrations) * 100}
                sx={{ mt: 1, bgcolor: '#D1FAE5', '& .MuiLinearProgress-bar': { bgcolor: '#059669' } }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Tier 2 (General)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#0284C7' }}>
                {statistics.tier2.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(statistics.tier2 / statistics.totalRegistrations) * 100}
                sx={{ mt: 1, bgcolor: '#E0F2FE', '& .MuiLinearProgress-bar': { bgcolor: '#0284C7' } }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Tier 3 (Fixed Survey)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#7C3AED' }}>
                {statistics.tier3.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(statistics.tier3 / statistics.totalRegistrations) * 100}
                sx={{ mt: 1, bgcolor: '#EDE9FE', '& .MuiLinearProgress-bar': { bgcolor: '#7C3AED' } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tier Comparison */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Registration Tiers Comparison
      </Typography>
      <Grid container spacing={3}>
        {tierDefinitions.map((tier) => (
          <Grid item xs={12} md={4} key={tier.tier}>
            <Card sx={{ height: '100%', borderTop: `4px solid ${tier.color}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={`Tier ${tier.tier}`}
                    size="small"
                    sx={{ bgcolor: tier.color, color: 'white', mr: 1 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {tier.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tier.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ '& > div': { mb: 1.5 } }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Accuracy</Typography>
                    <Typography variant="body2">{tier.accuracy}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Cost</Typography>
                    <Typography variant="body2">{tier.cost}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Time</Typography>
                    <Typography variant="body2">{tier.time}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Best For</Typography>
                    <Typography variant="body2">{tier.suitable}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRegistrations = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Recent Registrations</Typography>
        <Button variant="contained" size="small">
          New Registration
        </Button>
      </Box>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Rights Holder</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Upgrade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockRegistrations.map((reg) => (
              <TableRow key={reg.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {reg.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {reg.date}
                  </Typography>
                </TableCell>
                <TableCell>{reg.location}</TableCell>
                <TableCell>{getTierChip(reg.tier)}</TableCell>
                <TableCell>{reg.holders}</TableCell>
                <TableCell>{reg.area}</TableCell>
                <TableCell>{getStatusChip(reg.status)}</TableCell>
                <TableCell>
                  {reg.upgradeEligible && reg.tier < 3 ? (
                    <Button size="small" variant="outlined">
                      Upgrade to Tier {reg.tier + 1}
                    </Button>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      {reg.tier === 3 ? 'Max tier' : 'Not eligible'}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderNewRegistration = () => {
    const steps = [
      {
        label: 'Select Registration Tier',
        content: (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Registration Tier"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              sx={{ mb: 2 }}
            >
              {tierDefinitions.map((tier) => (
                <MenuItem key={tier.tier} value={tier.tier}>
                  Tier {tier.tier}: {tier.name} ({tier.cost})
                </MenuItem>
              ))}
            </TextField>
            <Alert severity="info" sx={{ mb: 2 }}>
              {tierDefinitions[selectedTier - 1].description}
            </Alert>
          </Box>
        ),
      },
      {
        label: 'Rights Holder Information',
        content: (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name / Group Name" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="ID Type" select>
                  <MenuItem value="ghana_card">Ghana Card</MenuItem>
                  <MenuItem value="passport">Passport</MenuItem>
                  <MenuItem value="voter_id">Voter ID</MenuItem>
                  <MenuItem value="community_cert">Community Certificate</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="ID Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone Number" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" multiline rows={2} />
              </Grid>
            </Grid>
          </Box>
        ),
      },
      {
        label: 'Parcel Information',
        content: (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Region" select>
                  <MenuItem value="greater_accra">Greater Accra</MenuItem>
                  <MenuItem value="ashanti">Ashanti</MenuItem>
                  <MenuItem value="central">Central</MenuItem>
                  <MenuItem value="eastern">Eastern</MenuItem>
                  <MenuItem value="western">Western</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="District" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Location Description" multiline rows={2} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Approximate Area" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Land Use" select>
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="agricultural">Agricultural</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="mixed">Mixed Use</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        ),
      },
      {
        label: 'Evidence & Validation',
        content: (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Required Evidence for Tier {selectedTier}:
            </Typography>
            {tierDefinitions[selectedTier - 1].evidence.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>{item}</Typography>
                <Button variant="outlined" size="small">
                  Upload Document
                </Button>
              </Box>
            ))}
            {selectedTier === 1 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Community validation will be scheduled after document submission.
                A local committee will verify your claim within 7 days.
              </Alert>
            )}
          </Box>
        ),
      },
      {
        label: 'Review & Submit',
        content: (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your Tier {selectedTier} registration is ready for submission.
            </Alert>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Registration Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Tier: {tierDefinitions[selectedTier - 1].name}<br />
                Estimated Processing Time: {tierDefinitions[selectedTier - 1].time}<br />
                Fee: {tierDefinitions[selectedTier - 1].cost}
              </Typography>
            </Card>
          </Box>
        ),
      },
    ];

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          New Tiered Registration
        </Typography>
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    {step.content}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(index + 1)}
                        sx={{ mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Submit' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Tiered Registration System
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fit-for-Purpose land registration with progressive formalization
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Registrations" />
        <Tab label="New Registration" />
      </Tabs>

      {tabValue === 0 && renderOverview()}
      {tabValue === 1 && renderRegistrations()}
      {tabValue === 2 && renderNewRegistration()}
    </Box>
  );
}

export default TieredRegistrationPage;
