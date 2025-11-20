import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Divider,
  LinearProgress,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

// Community Mapping Module - Based on STDM and participatory approaches
// Supports customary/communal land documentation

const mockMappingProjects = [
  {
    id: 'CMP-2024-001',
    community: 'Ashaiman Traditional Area',
    chief: 'Nii Adjei Kwei II',
    region: 'Greater Accra',
    status: 'active',
    parcels: 234,
    validated: 189,
    startDate: '2024-09-15',
    participants: 45,
    progress: 81,
  },
  {
    id: 'CMP-2024-002',
    community: 'Akyem Abuakwa Stool Lands',
    chief: 'Okyenhene Osagyefuo Amoatia Ofori Panin',
    region: 'Eastern',
    status: 'active',
    parcels: 567,
    validated: 234,
    startDate: '2024-10-01',
    participants: 89,
    progress: 41,
  },
  {
    id: 'CMP-2024-003',
    community: 'Ga Mashie',
    chief: 'Nii Tackie Tawiah III',
    region: 'Greater Accra',
    status: 'completed',
    parcels: 412,
    validated: 412,
    startDate: '2024-06-01',
    participants: 67,
    progress: 100,
  },
  {
    id: 'CMP-2024-004',
    community: 'Dormaa Traditional Council',
    chief: 'Osagyefuo Oseadeeyo Agyeman Badu II',
    region: 'Bono',
    status: 'planning',
    parcels: 0,
    validated: 0,
    startDate: '2024-12-01',
    participants: 0,
    progress: 0,
  },
];

const mockValidationQueue = [
  {
    id: 'VAL-001',
    parcel: 'PCL-ASH-0145',
    claimant: 'Mensah Family',
    type: 'Family Land',
    submitted: '2024-11-18',
    witnesses: 3,
    status: 'pending',
  },
  {
    id: 'VAL-002',
    parcel: 'PCL-ASH-0146',
    claimant: 'Tetteh Akwetey',
    type: 'Individual',
    submitted: '2024-11-17',
    witnesses: 2,
    status: 'scheduled',
    meetingDate: '2024-11-22',
  },
  {
    id: 'VAL-003',
    parcel: 'PCL-ASH-0147',
    claimant: 'Adjei Community',
    type: 'Communal',
    submitted: '2024-11-16',
    witnesses: 5,
    status: 'approved',
  },
  {
    id: 'VAL-004',
    parcel: 'PCL-ASH-0148',
    claimant: 'Addo Antwi',
    type: 'Individual',
    submitted: '2024-11-15',
    witnesses: 2,
    status: 'disputed',
    disputeNote: 'Boundary conflict with neighbor',
  },
];

const tenureTypes = [
  { value: 'individual', label: 'Individual/Private', description: 'Single owner with exclusive rights' },
  { value: 'family', label: 'Family Land', description: 'Held by extended family, managed by family head' },
  { value: 'communal', label: 'Communal/Community', description: 'Shared by community members' },
  { value: 'stool', label: 'Stool Land', description: 'Vested in traditional stool/chief' },
  { value: 'clan', label: 'Clan Land', description: 'Belongs to specific clan group' },
  { value: 'skin', label: 'Skin Land', description: 'Northern Ghana traditional holding' },
];

const statistics = {
  totalProjects: 23,
  activeProjects: 8,
  totalParcels: 12450,
  validatedParcels: 9823,
  pendingValidation: 456,
  disputes: 34,
  communitiesCovered: 156,
};

function CommunityMappingPage() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'success' },
      completed: { label: 'Completed', color: 'default' },
      planning: { label: 'Planning', color: 'info' },
      paused: { label: 'Paused', color: 'warning' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getValidationStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Review', color: 'warning' },
      scheduled: { label: 'Meeting Scheduled', color: 'info' },
      approved: { label: 'Validated', color: 'success' },
      disputed: { label: 'Under Dispute', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const renderOverview = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Community mapping empowers traditional authorities and local communities to document customary
        tenure through participatory processes, ensuring social legitimacy and reducing conflicts.
      </Alert>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Projects
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.activeProjects}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of {statistics.totalProjects} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Parcels Mapped
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.totalParcels.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">
                {statistics.validatedParcels.toLocaleString()} validated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Pending Validation
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {statistics.pendingValidation}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Awaiting community review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Communities
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.communitiesCovered}
              </Typography>
              <Typography variant="caption" color="error.main">
                {statistics.disputes} active disputes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How It Works */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Participatory Mapping Process
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            step: 1,
            title: 'Community Mobilization',
            description: 'Engage traditional authorities, form mapping committees, train para-surveyors',
          },
          {
            step: 2,
            title: 'Data Collection',
            description: 'Walk boundaries with neighbors, collect GPS points, photograph evidence',
          },
          {
            step: 3,
            title: 'Public Display',
            description: 'Post maps in community for 30 days, allow objections and corrections',
          },
          {
            step: 4,
            title: 'Validation Meeting',
            description: 'Community committee reviews claims, resolves disputes, validates tenure',
          },
          {
            step: 5,
            title: 'Documentation',
            description: 'Issue community-validated certificates, enter into national registry',
          },
        ].map((item) => (
          <Grid item xs={12} md={2.4} key={item.step}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  {item.step}
                </Avatar>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tenure Types */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Supported Tenure Types
      </Typography>
      <Grid container spacing={2}>
        {tenureTypes.map((type) => (
          <Grid item xs={12} md={4} key={type.value}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {type.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {type.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderProjects = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Mapping Projects</Typography>
        <Button variant="contained" size="small">
          New Project
        </Button>
      </Box>
      <Grid container spacing={3}>
        {mockMappingProjects.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {project.community}
                  </Typography>
                  {getStatusChip(project.status)}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.chief} | {project.region} Region
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Parcels Mapped</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {project.validated} / {project.parcels}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Participants</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {project.participants} people
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Progress</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" sx={{ float: 'right' }}>
                      {project.progress}%
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                  {project.status === 'active' && (
                    <Button size="small" variant="outlined">
                      Add Parcel
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderValidation = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Validation Queue</Typography>
        <Button variant="contained" size="small">
          Schedule Meeting
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Community validation ensures social legitimacy. Each claim requires witness attestation and
        committee approval before official recognition.
      </Alert>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcel ID</TableCell>
              <TableCell>Claimant</TableCell>
              <TableCell>Tenure Type</TableCell>
              <TableCell>Witnesses</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockValidationQueue.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.parcel}
                  </Typography>
                </TableCell>
                <TableCell>{item.claimant}</TableCell>
                <TableCell>
                  <Chip label={item.type} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                    {[...Array(item.witnesses)].map((_, i) => (
                      <Avatar key={i} sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                        W
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell>{item.submitted}</TableCell>
                <TableCell>
                  {getValidationStatusChip(item.status)}
                  {item.status === 'scheduled' && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {item.meetingDate}
                    </Typography>
                  )}
                  {item.status === 'disputed' && (
                    <Typography variant="caption" display="block" color="error">
                      {item.disputeNote}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button size="small">Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderNewProject = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Create New Mapping Project
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Community / Traditional Area Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Traditional Authority / Chief" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Region" select>
                <MenuItem value="greater_accra">Greater Accra</MenuItem>
                <MenuItem value="ashanti">Ashanti</MenuItem>
                <MenuItem value="eastern">Eastern</MenuItem>
                <MenuItem value="central">Central</MenuItem>
                <MenuItem value="western">Western</MenuItem>
                <MenuItem value="bono">Bono</MenuItem>
                <MenuItem value="northern">Northern</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="District" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Estimated Parcels" type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Project Start Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                multiline
                rows={3}
                placeholder="Describe the mapping objectives, boundaries, and stakeholders..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Committee Members
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Add at least 5 community members who will serve on the validation committee
              </Typography>
              <Button variant="outlined" size="small">
                Add Committee Member
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained">Create Project</Button>
                <Button variant="outlined">Save Draft</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Community Mapping
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Participatory mapping for customary and communal land tenure documentation
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Projects" />
        <Tab label="Validation Queue" />
        <Tab label="New Project" />
      </Tabs>

      {tabValue === 0 && renderOverview()}
      {tabValue === 1 && renderProjects()}
      {tabValue === 2 && renderValidation()}
      {tabValue === 3 && renderNewProject()}
    </Box>
  );
}

export default CommunityMappingPage;
