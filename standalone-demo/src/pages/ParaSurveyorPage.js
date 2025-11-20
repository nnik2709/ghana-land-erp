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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
} from '@mui/material';

// Para-Surveyor Module - Based on Rwanda's successful community surveyor model
// Trained local community members who can perform Tier 1 and Tier 2 data collection

const mockParaSurveyors = [
  {
    id: 'PS-001',
    name: 'Emmanuel Addo',
    phone: '+233 24 123 4567',
    region: 'Greater Accra',
    district: 'Tema West',
    status: 'active',
    certified: '2024-03-15',
    parcelsCompleted: 156,
    accuracy: 94,
    rating: 4.8,
    tier: 2,
  },
  {
    id: 'PS-002',
    name: 'Abena Gyasi',
    phone: '+233 20 234 5678',
    region: 'Ashanti',
    district: 'Kumasi Metro',
    status: 'active',
    certified: '2024-04-20',
    parcelsCompleted: 89,
    accuracy: 91,
    rating: 4.5,
    tier: 2,
  },
  {
    id: 'PS-003',
    name: 'Kofi Asante',
    phone: '+233 27 345 6789',
    region: 'Eastern',
    district: 'Abuakwa North',
    status: 'active',
    certified: '2024-05-10',
    parcelsCompleted: 234,
    accuracy: 96,
    rating: 4.9,
    tier: 2,
  },
  {
    id: 'PS-004',
    name: 'Fatima Ibrahim',
    phone: '+233 26 456 7890',
    region: 'Northern',
    district: 'Tamale Metro',
    status: 'training',
    certified: null,
    parcelsCompleted: 12,
    accuracy: 85,
    rating: 4.2,
    tier: 1,
  },
  {
    id: 'PS-005',
    name: 'Yaw Mensah',
    phone: '+233 24 567 8901',
    region: 'Central',
    district: 'Cape Coast',
    status: 'inactive',
    certified: '2024-02-01',
    parcelsCompleted: 45,
    accuracy: 88,
    rating: 4.0,
    tier: 1,
  },
];

const mockAssignments = [
  {
    id: 'ASN-001',
    surveyor: 'Emmanuel Addo',
    project: 'Ashaiman Community Mapping',
    parcels: 25,
    completed: 18,
    dueDate: '2024-11-25',
    status: 'in_progress',
  },
  {
    id: 'ASN-002',
    surveyor: 'Abena Gyasi',
    project: 'Adum Systematic Registration',
    parcels: 40,
    completed: 40,
    dueDate: '2024-11-15',
    status: 'completed',
  },
  {
    id: 'ASN-003',
    surveyor: 'Kofi Asante',
    project: 'Akyem Abuakwa Stool Lands',
    parcels: 50,
    completed: 32,
    dueDate: '2024-11-30',
    status: 'in_progress',
  },
  {
    id: 'ASN-004',
    surveyor: 'Fatima Ibrahim',
    project: 'Tamale Pilot Project',
    parcels: 15,
    completed: 8,
    dueDate: '2024-12-01',
    status: 'in_progress',
  },
];

const trainingModules = [
  {
    id: 1,
    name: 'Introduction to Land Administration',
    duration: '4 hours',
    type: 'theory',
    required: true,
  },
  {
    id: 2,
    name: 'GPS Device Operation',
    duration: '8 hours',
    type: 'practical',
    required: true,
  },
  {
    id: 3,
    name: 'Mobile App Data Collection',
    duration: '6 hours',
    type: 'practical',
    required: true,
  },
  {
    id: 4,
    name: 'Community Engagement & Conflict Resolution',
    duration: '4 hours',
    type: 'theory',
    required: true,
  },
  {
    id: 5,
    name: 'Boundary Identification & Marking',
    duration: '8 hours',
    type: 'practical',
    required: true,
  },
  {
    id: 6,
    name: 'Data Quality & Verification',
    duration: '4 hours',
    type: 'theory',
    required: true,
  },
  {
    id: 7,
    name: 'Drone Operation (Tier 2+)',
    duration: '12 hours',
    type: 'practical',
    required: false,
  },
  {
    id: 8,
    name: 'Advanced GIS Tools (Tier 2+)',
    duration: '8 hours',
    type: 'practical',
    required: false,
  },
];

const statistics = {
  totalParaSurveyors: 156,
  active: 123,
  inTraining: 28,
  parcelsThisMonth: 2340,
  avgAccuracy: 92,
  avgRating: 4.6,
};

function ParaSurveyorPage() {
  const [tabValue, setTabValue] = useState(0);

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'success' },
      training: { label: 'In Training', color: 'warning' },
      inactive: { label: 'Inactive', color: 'default' },
      suspended: { label: 'Suspended', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getAssignmentStatus = (status) => {
    const statusConfig = {
      in_progress: { label: 'In Progress', color: 'warning' },
      completed: { label: 'Completed', color: 'success' },
      overdue: { label: 'Overdue', color: 'error' },
      pending: { label: 'Pending', color: 'info' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const renderOverview = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Para-surveyors are community-trained technicians who perform field data collection for Tier 1 and
        Tier 2 registrations, reducing costs by 80% while maintaining quality through standardized training
        and quality control.
      </Alert>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.totalParaSurveyors}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Para-surveyors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {statistics.active}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In field
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Training
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {statistics.inTraining}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                This Month
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.parcelsThisMonth.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Parcels mapped
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Accuracy
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.avgAccuracy}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Rating
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.avgRating}
              </Typography>
              <Rating value={statistics.avgRating} precision={0.1} size="small" readOnly />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Benefits */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Benefits of Para-Surveyor Model
      </Typography>
      <Grid container spacing={3}>
        {[
          {
            title: 'Cost Reduction',
            value: '80%',
            description: 'Lower than licensed surveyors for basic registration',
          },
          {
            title: 'Local Knowledge',
            value: 'High',
            description: 'Community members know boundaries and tenure history',
          },
          {
            title: 'Employment',
            value: 'Jobs',
            description: 'Creates rural employment opportunities',
          },
          {
            title: 'Speed',
            value: '5x',
            description: 'Faster coverage with distributed workforce',
          },
        ].map((benefit) => (
          <Grid item xs={6} md={3} key={benefit.title}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                  {benefit.value}
                </Typography>
                <Typography variant="subtitle2">{benefit.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderSurveyors = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Para-Surveyors</Typography>
        <Button variant="contained" size="small">
          Register New
        </Button>
      </Box>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Region / District</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockParaSurveyors.map((surveyor) => (
              <TableRow key={surveyor.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                      {surveyor.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {surveyor.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {surveyor.phone}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{surveyor.region}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {surveyor.district}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={`Tier ${surveyor.tier}`} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{getStatusChip(surveyor.status)}</TableCell>
                <TableCell>{surveyor.parcelsCompleted}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{surveyor.accuracy}%</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={surveyor.accuracy}
                      sx={{ width: 50, height: 4, borderRadius: 2 }}
                      color={surveyor.accuracy >= 90 ? 'success' : surveyor.accuracy >= 80 ? 'warning' : 'error'}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Rating value={surveyor.rating} precision={0.1} size="small" readOnly />
                </TableCell>
                <TableCell>
                  <Button size="small">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAssignments = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Field Assignments</Typography>
        <Button variant="contained" size="small">
          Create Assignment
        </Button>
      </Box>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assignment ID</TableCell>
              <TableCell>Surveyor</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAssignments.map((assignment) => (
              <TableRow key={assignment.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {assignment.id}
                  </Typography>
                </TableCell>
                <TableCell>{assignment.surveyor}</TableCell>
                <TableCell>{assignment.project}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {assignment.completed} / {assignment.parcels}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(assignment.completed / assignment.parcels) * 100}
                      sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>{getAssignmentStatus(assignment.status)}</TableCell>
                <TableCell>
                  <Button size="small">Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTraining = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Training Curriculum
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Para-surveyors must complete 34 hours of core training (6 modules) to be certified for Tier 1
        data collection. An additional 20 hours qualifies them for Tier 2 work with GPS and drone equipment.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Training Modules
              </Typography>
              <List>
                {trainingModules.map((module) => (
                  <ListItem
                    key={module.id}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: module.type === 'practical' ? 'primary.main' : 'secondary.main' }}>
                        {module.id}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={module.name}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip label={module.duration} size="small" variant="outlined" />
                          <Chip
                            label={module.type}
                            size="small"
                            color={module.type === 'practical' ? 'primary' : 'secondary'}
                          />
                          {module.required ? (
                            <Chip label="Required" size="small" color="error" variant="outlined" />
                          ) : (
                            <Chip label="Optional" size="small" variant="outlined" />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Certification Levels
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Tier 1 Certified
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  34 hours - Sketch maps, witness collection, basic GPS
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Tier 2 Certified
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  54 hours - Drone operation, advanced GPS, GIS tools
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Schedule Training
              </Typography>
              <TextField
                fullWidth
                label="Region"
                select
                size="small"
                sx={{ mb: 2 }}
              >
                <MenuItem value="accra">Greater Accra</MenuItem>
                <MenuItem value="ashanti">Ashanti</MenuItem>
                <MenuItem value="eastern">Eastern</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Participants"
                type="number"
                size="small"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth>
                Schedule Training
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Para-Surveyor Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Community-trained technicians for scalable, affordable land data collection
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Surveyors" />
        <Tab label="Assignments" />
        <Tab label="Training" />
      </Tabs>

      {tabValue === 0 && renderOverview()}
      {tabValue === 1 && renderSurveyors()}
      {tabValue === 2 && renderAssignments()}
      {tabValue === 3 && renderTraining()}
    </Box>
  );
}

export default ParaSurveyorPage;
