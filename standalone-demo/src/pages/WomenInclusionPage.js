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
} from '@mui/material';

// Women's Land Rights & Inclusion Module
// Based on Ethiopia's SDO model and best practices for protecting women's tenure

const mockCases = [
  {
    id: 'WLR-2024-001',
    name: 'Akosua Mensah',
    type: 'Widow Succession',
    region: 'Ashanti',
    district: 'Kumasi Metro',
    status: 'resolved',
    outcome: 'Joint title issued',
    sdo: 'Abena Osei',
    date: '2024-11-10',
  },
  {
    id: 'WLR-2024-002',
    name: 'Ama Adjei',
    type: 'Marital Property',
    region: 'Greater Accra',
    district: 'Accra Metro',
    status: 'in_progress',
    outcome: null,
    sdo: 'Efua Asante',
    date: '2024-11-15',
  },
  {
    id: 'WLR-2024-003',
    name: 'Fatima Ibrahim',
    type: 'Inheritance Dispute',
    region: 'Northern',
    district: 'Tamale Metro',
    status: 'mediation',
    outcome: null,
    sdo: 'Salamatu Yakubu',
    date: '2024-11-12',
  },
  {
    id: 'WLR-2024-004',
    name: 'Esi Owusu',
    type: 'Co-ownership Recognition',
    region: 'Central',
    district: 'Cape Coast',
    status: 'resolved',
    outcome: 'Both names on title',
    sdo: 'Ama Agyemang',
    date: '2024-11-08',
  },
  {
    id: 'WLR-2024-005',
    name: 'Yaa Asantewaa Group',
    type: 'Collective Title',
    region: 'Eastern',
    district: 'Abuakwa South',
    status: 'pending',
    outcome: null,
    sdo: 'Abena Osei',
    date: '2024-11-18',
  },
];

const mockSDOs = [
  {
    id: 'SDO-001',
    name: 'Abena Osei',
    region: 'Ashanti',
    casesHandled: 89,
    resolvedFavorably: 78,
    rating: 4.9,
    active: true,
  },
  {
    id: 'SDO-002',
    name: 'Efua Asante',
    region: 'Greater Accra',
    casesHandled: 123,
    resolvedFavorably: 98,
    rating: 4.7,
    active: true,
  },
  {
    id: 'SDO-003',
    name: 'Salamatu Yakubu',
    region: 'Northern',
    casesHandled: 67,
    resolvedFavorably: 52,
    rating: 4.5,
    active: true,
  },
  {
    id: 'SDO-004',
    name: 'Ama Agyemang',
    region: 'Central',
    casesHandled: 45,
    resolvedFavorably: 41,
    rating: 4.8,
    active: true,
  },
];

const statistics = {
  totalWomenRegistered: 34567,
  jointTitles: 18234,
  singleWomenTitles: 16333,
  casesThisYear: 456,
  resolvedFavorably: 89,
  activeSDOs: 45,
  womenPercentage: 42,
};

const caseTypes = [
  { value: 'widow_succession', label: 'Widow Succession', description: 'Protect widows from disinheritance' },
  { value: 'marital_property', label: 'Marital Property', description: 'Recognition of joint ownership' },
  { value: 'inheritance', label: 'Inheritance Dispute', description: 'Fair distribution of inherited land' },
  { value: 'co_ownership', label: 'Co-ownership Recognition', description: 'Add spouse to existing title' },
  { value: 'collective', label: 'Collective Title', description: 'Women\'s groups and cooperatives' },
  { value: 'divorce', label: 'Divorce Settlement', description: 'Equitable division of property' },
];

function WomenInclusionPage() {
  const [tabValue, setTabValue] = useState(0);

  const getStatusChip = (status) => {
    const statusConfig = {
      resolved: { label: 'Resolved', color: 'success' },
      in_progress: { label: 'In Progress', color: 'warning' },
      mediation: { label: 'Mediation', color: 'info' },
      pending: { label: 'Pending', color: 'default' },
      escalated: { label: 'Escalated', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const renderOverview = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Women constitute 52% of agricultural laborers but hold only {statistics.womenPercentage}% of land titles.
        This module ensures gender equity in land registration through proactive outreach, legal support,
        and Social Development Officers (SDOs) trained in women's land rights.
      </Alert>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Women Title Holders
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.totalWomenRegistered.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {statistics.womenPercentage}% of all titles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Joint Titles
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {statistics.jointTitles.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Husband & wife together
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Cases This Year
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.casesThisYear}
              </Typography>
              <Typography variant="caption" color="success.main">
                {statistics.resolvedFavorably}% resolved favorably
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active SDOs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statistics.activeSDOs}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Social Development Officers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Initiatives */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Key Initiatives
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'Mandatory Joint Registration',
            description: 'Married couples must have both names on title by default',
            impact: 'Increased joint titles by 340%',
          },
          {
            title: 'Photo ID on Certificates',
            description: 'Both spouses\' photos appear on land certificate',
            impact: 'Prevents unilateral sale',
          },
          {
            title: 'Widow Protection Protocol',
            description: 'Automatic succession rights for surviving spouse',
            impact: '94% widows retain land',
          },
          {
            title: 'Women\'s Land Rights Committees',
            description: 'Local committees to advocate and mediate',
            impact: '156 committees active',
          },
        ].map((initiative) => (
          <Grid item xs={12} md={6} key={initiative.title}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {initiative.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {initiative.description}
                </Typography>
                <Chip label={initiative.impact} size="small" color="success" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Case Types */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Supported Case Types
      </Typography>
      <Grid container spacing={2}>
        {caseTypes.map((type) => (
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

  const renderCases = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Active Cases</Typography>
        <Button variant="contained" size="small">
          New Case
        </Button>
      </Box>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case ID</TableCell>
              <TableCell>Claimant</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Region/District</TableCell>
              <TableCell>SDO Assigned</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Outcome</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockCases.map((caseItem) => (
              <TableRow key={caseItem.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {caseItem.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {caseItem.date}
                  </Typography>
                </TableCell>
                <TableCell>{caseItem.name}</TableCell>
                <TableCell>
                  <Chip label={caseItem.type} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{caseItem.region}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {caseItem.district}
                  </Typography>
                </TableCell>
                <TableCell>{caseItem.sdo}</TableCell>
                <TableCell>{getStatusChip(caseItem.status)}</TableCell>
                <TableCell>
                  {caseItem.outcome ? (
                    <Typography variant="body2" color="success.main">
                      {caseItem.outcome}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  )}
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

  const renderSDOs = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Social Development Officers</Typography>
        <Button variant="contained" size="small">
          Add SDO
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        SDOs are trained professionals who advocate for women's land rights, provide legal guidance,
        mediate disputes, and ensure women are informed of their rights during registration.
      </Alert>

      <Grid container spacing={3}>
        {mockSDOs.map((sdo) => (
          <Grid item xs={12} md={6} key={sdo.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {sdo.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {sdo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sdo.region} Region
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Cases</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {sdo.casesHandled}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Success Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                      {Math.round((sdo.resolvedFavorably / sdo.casesHandled) * 100)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Rating</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {sdo.rating}/5
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                    View Profile
                  </Button>
                  <Button size="small" variant="outlined">
                    Assign Case
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderNewCase = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Report Women's Land Rights Case
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Claimant Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone Number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Case Type" select>
                {caseTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Region" select>
                <MenuItem value="greater_accra">Greater Accra</MenuItem>
                <MenuItem value="ashanti">Ashanti</MenuItem>
                <MenuItem value="eastern">Eastern</MenuItem>
                <MenuItem value="central">Central</MenuItem>
                <MenuItem value="northern">Northern</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="District" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Property Reference (if known)" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Case Description"
                multiline
                rows={4}
                placeholder="Describe the situation, parties involved, and desired outcome..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Supporting Documents
              </Typography>
              <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                Upload Marriage Certificate
              </Button>
              <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                Upload ID
              </Button>
              <Button variant="outlined" size="small">
                Upload Evidence
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                All information is confidential. A Social Development Officer will contact you within
                48 hours to discuss your case.
              </Alert>
              <Button variant="contained">Submit Case</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderReports = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Gender Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Title Holder Distribution
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Men Only</Typography>
                  <Typography variant="body2">58%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={58} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Women Only</Typography>
                  <Typography variant="body2">19%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={19} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Joint Titles</Typography>
                  <Typography variant="body2">23%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={23} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Regional Comparison
              </Typography>
              {[
                { region: 'Greater Accra', percentage: 48 },
                { region: 'Ashanti', percentage: 41 },
                { region: 'Eastern', percentage: 39 },
                { region: 'Northern', percentage: 32 },
                { region: 'Central', percentage: 44 },
              ].map((item) => (
                <Box key={item.region} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{item.region}</Typography>
                    <Typography variant="body2">{item.percentage}% women</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                    color={item.percentage >= 45 ? 'success' : item.percentage >= 35 ? 'warning' : 'error'}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Monthly Progress
              </Typography>
              <Alert severity="success">
                Women's registration has increased 15% compared to last year. Joint titling is up 34%
                following the mandatory joint registration policy.
              </Alert>
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
          Women's Land Rights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ensuring gender equity in land registration and protecting women's tenure security
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Cases" />
        <Tab label="SDO Officers" />
        <Tab label="New Case" />
        <Tab label="Analytics" />
      </Tabs>

      {tabValue === 0 && renderOverview()}
      {tabValue === 1 && renderCases()}
      {tabValue === 2 && renderSDOs()}
      {tabValue === 3 && renderNewCase()}
      {tabValue === 4 && renderReports()}
    </Box>
  );
}

export default WomenInclusionPage;
